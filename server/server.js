// server/server.js
// Entry point del servidor Node.js/Express

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// ============ MIDDLEWARE ============
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de peticiones (desarrollo)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============ RUTAS ============
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', homeRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        server: 'mazahua-connect-api',
        timestamp: new Date().toISOString()
    });
});

// ============ MANEJO DE ERRORES ============
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Error interno del servidor'
    });
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor MazahuaConnect corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/home`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/auth/visitor`);
    console.log(`   POST /api/newsletter/subscribe\n`);
});
