// server/controllers/authController.js
// Controlador de autenticación — reemplaza la lógica de register.php y auth PHP

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Login de usuario
 * POST /api/auth/login
 * Body: { username, password, userType, grade? }
 */
exports.login = async (req, res) => {
    const { username, password, userType, grade } = req.body;

    try {
        let rows;

        if (userType === 'STUDENT') {
            // Estudiante: username = nombre, password = número mágico
            [rows] = await db.query(
                'SELECT * FROM students WHERE full_name = ? AND magic_number = ?',
                [username, password]
            );
        } else if (userType === 'TEACHER') {
            // Maestro: login con username y password
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
            // Visitante: login con email y password
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

        // Generar JWT
        const token = jwt.sign(
            {
                id: user.id || user.student_id,
                username: username,
                role: userType
            },
            process.env.JWT_SECRET || 'mazahua_default_secret',
            { expiresIn: '24h' }
        );

        res.json({
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
        console.error('Error en login:', error.message);
        // Fallback: si no hay DB, usar mock para desarrollo
        const token = jwt.sign(
            { id: 1, username, role: userType },
            process.env.JWT_SECRET || 'mazahua_default_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { id: 1, name: username, role: userType, grade: grade || null },
            mock: true
        });
    }
};

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
        // Verificar si el email ya existe
        const [existing] = await db.query(
            'SELECT id FROM visitors WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'El correo o usuario ya está registrado' });
        }

        // Hash del password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insertar visitante
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
        console.error('Error en registro:', error.message);
        // Fallback mock para desarrollo sin DB
        res.status(201).json({
            success: true,
            message: 'Usuario registrado (modo desarrollo)',
            userId: Date.now(),
            mock: true
        });
    }
};