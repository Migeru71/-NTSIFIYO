// server/routes/homeRoutes.js
// Rutas para datos de la página principal (reemplaza get_home.php y landing_data.php)

const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET /api/home
 * Provee los datos dinámicos para la Landing Page
 * Reemplaza: get_home.php
 */
router.get('/home', async (req, res) => {
    try {
        // En producción: SELECT COUNT(*) FROM students, etc.
        // Por ahora, datos estáticos idénticos al PHP original
        const homeData = {
            hero: {
                badge: "Nuevo curso interactivo disponible",
                student_count: "500+"
            },
            daily_phrase: {
                phrase: "Ki jñaa kjo",
                translation: "Habla bien",
                context: "Saludo general y cortesía."
            },
            status: "success"
        };

        res.json(homeData);
    } catch (error) {
        console.error('Error obteniendo datos del home:', error.message);
        res.status(500).json({ message: 'Error al obtener datos' });
    }
});

/**
 * GET /api/landing
 * Datos extendidos de la landing page
 * Reemplaza: landing_data.php
 */
router.get('/landing', async (req, res) => {
    try {
        const data = {
            stats: {
                active_learners: 500,
                daily_phrase: {
                    mazahua: "Ki jñaa kjo",
                    spanish: "Habla bien",
                    context: "Se usa como saludo general."
                }
            },
            courses_count: 12,
            latest_news: "Nuevo curso interactivo disponible"
        };

        res.json(data);
    } catch (error) {
        console.error('Error obteniendo datos del landing:', error.message);
        res.status(500).json({ message: 'Error al obtener datos' });
    }
});

module.exports = router;
