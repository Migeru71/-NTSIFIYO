// server/config/db.js
// Conexión a MySQL usando mysql2 (reemplaza db.php)

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mazahua_platform_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión al iniciar
pool.getConnection()
    .then(conn => {
        console.log('✅ Conectado a MySQL:', process.env.DB_NAME);
        conn.release();
    })
    .catch(err => {
        console.warn('⚠️ No se pudo conectar a MySQL:', err.message);
        console.warn('   El servidor funcionará con datos mock.');
    });

module.exports = pool;
