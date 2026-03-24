// client/src/components/Games/Loteria/LoteriaAccessPanel.jsx
// Fase 1 — Acceso: Panel de actividades disponibles para el juego de Lotería
import React from 'react';
import GameAccessPanel from '../GameAccessPanel';
import ActivityTypes from '../../../utils/activityTypes';

function LoteriaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.lottery.value}
            icon="🎰"
            title="Lotería"
            subtitle="Selecciona las cartas"
            gameBasePath="/games/loteria"
            cardIcon="🃏"
            tipStudent="Selecciona las cartas del tablero que coincidan con las que aparecen en la pila"
            tipTeacher="Crea actividades de lotería con palabras e imágenes en mazahua"
        />
    );
}

export default LoteriaAccessPanel;
