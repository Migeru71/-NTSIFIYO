// server/data/mockUsers.js
// Mock de usuarios para desarrollo sin base de datos
// Usuarios: Daniel7TG, Heidi996, Migeru71

const bcrypt = require('bcryptjs');

// Contraseñas hasheadas (generadas con bcrypt, salt rounds = 10)
// En desarrollo, las contraseñas en texto plano son las mismas que el username en minúscula + "123"
const mockUsers = {
    // ==================== MAESTROS ====================
    teachers: [
        {
            id: 1,
            username: 'Daniel7TG',
            full_name: 'Daniel Torres García',
            email: 'daniel7tg@mazahua.edu.mx',
            password_plain: 'daniel123',    // Solo para referencia, no se usa en producción
            password_hash: bcrypt.hashSync('daniel123', 10),
            role: 'TEACHER',
            subject: 'Lengua Mazahua',
            created_at: '2026-01-15T10:00:00Z'
        },
        {
            id: 2,
            username: 'Heidi996',
            full_name: 'Heidi Hernández López',
            email: 'heidi996@mazahua.edu.mx',
            password_plain: 'heidi123',
            password_hash: bcrypt.hashSync('heidi123', 10),
            role: 'TEACHER',
            subject: 'Cultura Mazahua',
            created_at: '2026-01-15T10:00:00Z'
        },
        {
            id: 3,
            username: 'Migeru71',
            full_name: 'Miguel Rodríguez Vargas',
            email: 'migeru71@mazahua.edu.mx',
            password_plain: 'migeru123',
            password_hash: bcrypt.hashSync('migeru123', 10),
            role: 'TEACHER',
            subject: 'Gramática Mazahua',
            created_at: '2026-01-15T10:00:00Z'
        }
    ],

    // ==================== ESTUDIANTES ====================
    // Los estudiantes usan nombre completo + número mágico para login
    students: [
        {
            id: 101,
            student_id: 'STU-101',
            full_name: 'Daniel7TG',
            magic_number: '7777',
            role: 'STUDENT',
            grade: '3A',
            xp: 450,
            level: 5,
            created_at: '2026-01-20T08:00:00Z'
        },
        {
            id: 102,
            student_id: 'STU-102',
            full_name: 'Heidi996',
            magic_number: '9996',
            role: 'STUDENT',
            grade: '3A',
            xp: 320,
            level: 4,
            created_at: '2026-01-20T08:00:00Z'
        },
        {
            id: 103,
            student_id: 'STU-103',
            full_name: 'Migeru71',
            magic_number: '7171',
            role: 'STUDENT',
            grade: '3B',
            xp: 580,
            level: 6,
            created_at: '2026-01-20T08:00:00Z'
        }
    ],

    // ==================== VISITANTES ====================
    visitors: [
        {
            id: 201,
            username: 'Daniel7TG',
            full_name: 'Daniel Torres García',
            email: 'daniel7tg@gmail.com',
            password_plain: 'daniel123',
            password_hash: bcrypt.hashSync('daniel123', 10),
            role: 'VISITOR',
            created_at: '2026-02-01T12:00:00Z'
        },
        {
            id: 202,
            username: 'Heidi996',
            full_name: 'Heidi Hernández López',
            email: 'heidi996@gmail.com',
            password_plain: 'heidi123',
            password_hash: bcrypt.hashSync('heidi123', 10),
            role: 'VISITOR',
            created_at: '2026-02-01T12:00:00Z'
        },
        {
            id: 203,
            username: 'Migeru71',
            full_name: 'Miguel Rodríguez Vargas',
            email: 'migeru71@gmail.com',
            password_plain: 'migeru123',
            password_hash: bcrypt.hashSync('migeru123', 10),
            role: 'VISITOR',
            created_at: '2026-02-01T12:00:00Z'
        }
    ]
};

// ==================== FUNCIONES DE BÚSQUEDA ====================

/**
 * Buscar maestro por username
 */
function findTeacher(username) {
    return mockUsers.teachers.find(t =>
        t.username.toLowerCase() === username.toLowerCase()
    );
}

/**
 * Buscar estudiante por nombre y número mágico
 */
function findStudent(fullName, magicNumber) {
    return mockUsers.students.find(s =>
        s.full_name.toLowerCase() === fullName.toLowerCase() &&
        s.magic_number === magicNumber
    );
}

/**
 * Buscar visitante por email
 */
function findVisitor(email) {
    return mockUsers.visitors.find(v =>
        v.email.toLowerCase() === email.toLowerCase()
    );
}

/**
 * Buscar visitante por username o email (para verificar duplicados)
 */
function findVisitorByUsernameOrEmail(username, email) {
    return mockUsers.visitors.find(v =>
        v.username.toLowerCase() === username.toLowerCase() ||
        v.email.toLowerCase() === email.toLowerCase()
    );
}

/**
 * Obtener todos los usuarios disponibles (para asignación a grupos)
 */
function getAllStudents() {
    return mockUsers.students.map(s => ({
        id: s.id,
        studentId: s.student_id,
        fullName: s.full_name,
        grade: s.grade,
        xp: s.xp,
        level: s.level
    }));
}

/**
 * Obtener todos los maestros
 */
function getAllTeachers() {
    return mockUsers.teachers.map(t => ({
        id: t.id,
        username: t.username,
        fullName: t.full_name,
        email: t.email,
        subject: t.subject
    }));
}

module.exports = {
    mockUsers,
    findTeacher,
    findStudent,
    findVisitor,
    findVisitorByUsernameOrEmail,
    getAllStudents,
    getAllTeachers
};
