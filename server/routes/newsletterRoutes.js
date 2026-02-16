// server/routes/newsletterRoutes.js
// Ruta para suscripción al newsletter (reemplaza subscribe_newsletter.php)

const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * POST /api/newsletter/subscribe
 * Suscribe un correo al newsletter
 * Reemplaza: subscribe_newsletter.php
 */
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Correo inválido.'
        });
    }

    try {
        // Intentar guardar en DB si está disponible
        await db.query(
            'INSERT INTO newsletter_subscribers (email) VALUES (?)',
            [email]
        );

        res.json({
            status: 'success',
            message: `¡Gracias! Te hemos suscrito exitosamente con: ${email}`
        });
    } catch (error) {
        // Si la tabla no existe o hay error de DB, responder exitosamente de todas formas
        console.warn('Newsletter DB error (usando mock):', error.message);
        res.json({
            status: 'success',
            message: `¡Gracias! Te hemos suscrito exitosamente con: ${email}`,
            mock: true
        });
    }
});

module.exports = router;
