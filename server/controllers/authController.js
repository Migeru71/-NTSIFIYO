// server/controllers/authController.js
// Controlador de autenticación con mock de usuarios

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findTeacher, findStudent, findVisitor, findVisitorByUsernameOrEmail } = require('../data/mockUsers');

const JWT_SECRET = process.env.JWT_SECRET || 'mazahua_default_secret';

/**
 * Login de usuario
 * POST /api/auth/login
 * Body: { username, password, userType, grade? }
 */
exports.login = async (req, res) => {
    const { username, password, userType, grade } = req.body;

    if (!username || !password || !userType) {
        return res.status(400).json({ message: 'Username, password y userType son requeridos' });
    }

    try {
        // Primero intentar con la base de datos real
        let rows;

        if (userType === 'STUDENT') {
            [rows] = await db.query(
                'SELECT * FROM students WHERE full_name = ? AND magic_number = ?',
                [username, password]
            );
        } else if (userType === 'TEACHER') {
            [rows] = await db.query(
                'SELECT * FROM teachers WHERE username = ?',
                [username]
            );
            if (rows.length > 0) {
                const validPassword = await bcrypt.compare(password, rows[0].password_hash);
                if (!validPassword) {
                    return res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            }
        } else {
            [rows] = await db.query(
                'SELECT * FROM visitors WHERE email = ?',
                [username]
            );
            if (rows.length > 0) {
                const validPassword = await bcrypt.compare(password, rows[0].password_hash);
                if (!validPassword) {
                    return res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            }
        }

        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = rows[0];
        const token = jwt.sign(
            { id: user.id || user.student_id, username, role: userType },
            JWT_SECRET, { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: user.id || user.student_id,
                name: user.full_name || user.fullname || username,
                role: userType,
                grade: grade || null
            }
        });

    } catch (error) {
        // ============ FALLBACK: USAR MOCK DE USUARIOS ============
        console.log('⚠️  DB no disponible, usando mock de usuarios...');
        return loginWithMock(req, res, username, password, userType, grade);
    }
};

/**
 * Login usando datos mock (sin base de datos)
 */
function loginWithMock(req, res, username, password, userType, grade) {
    let user = null;

    if (userType === 'STUDENT') {
        // Estudiante: username = nombre, password = número mágico
        user = findStudent(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Nombre o número mágico incorrecto' });
        }
    } else if (userType === 'TEACHER') {
        // Maestro: username + contraseña
        user = findTeacher(username);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    } else {
        // Visitante: email + contraseña
        user = findVisitor(username);
        if (!user) {
            return res.status(401).json({ message: 'Email no registrado' });
        }
        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    }

    // Generar JWT
    const token = jwt.sign(
        { id: user.id || user.student_id, username, role: userType },
        JWT_SECRET, { expiresIn: '24h' }
    );

    return res.json({
        success: true,
        token,
        user: {
            id: user.id || user.student_id,
            name: user.full_name || username,
            role: userType,
            grade: grade || user.grade || null,
            xp: user.xp || 0,
            level: user.level || 1
        },
        mock: true
    });
}

/**
 * Registro de visitante
 * POST /api/auth/visitor
 * Body: { firstname, lastname, email, password, username }
 */
exports.registerVisitor = async (req, res) => {
    const { firstname, lastname, email, password, username } = req.body;

    if (!firstname || !email || !password || !username) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        const [existing] = await db.query(
            'SELECT id FROM visitors WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'El correo o usuario ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const fullName = `${firstname} ${lastname}`.trim();
        const [result] = await db.query(
            'INSERT INTO visitors (full_name, username, email, password_hash) VALUES (?, ?, ?, ?)',
            [fullName, username, email, passwordHash]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });

    } catch (error) {
        // Fallback: verificar en mock si ya existe
        console.log('⚠️  DB no disponible, verificando en mock...');
        const existing = findVisitorByUsernameOrEmail(username, email);
        if (existing) {
            return res.status(409).json({ message: 'El correo o usuario ya está registrado (mock)' });
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado (modo desarrollo)',
            userId: Date.now(),
            mock: true
        });
    }
};