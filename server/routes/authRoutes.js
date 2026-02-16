// server/routes/authRoutes.js
// Rutas de autenticación (login y registro)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login — Inicio de sesión (estudiante, maestro, visitante)
router.post('/login', authController.login);

// POST /api/auth/visitor — Registro de visitante
router.post('/visitor', authController.registerVisitor);

module.exports = router;