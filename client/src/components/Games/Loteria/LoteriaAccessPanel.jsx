// client/src/components/Games/Loteria/LoteriaAccessPanel.jsx
// Fase 1 — Acceso: Panel de actividades disponibles para el juego de Lotería
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig';
import IconLottery from '../../../assets/svgs/juegos/loteria_premium.svg';
import IconPares from '../../../assets/svgs/juegos/pares_premium.svg';

function LoteriaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.LOTTERY}
            icon={<img src={IconLottery} alt="Loteria" className="w-12 h-12" />}
            title="Lotería"
            subtitle="Selecciona las cartas"
            gameBasePath="/games/loteria"
            cardIcon={<img src={IconPares} alt="Cartas" className="w-6 h-6" />}
            tipStudent="Selecciona las cartas del tablero que coincidan con las que aparecen en la pila"
            tipTeacher="Crea actividades de lotería con palabras e imágenes en mazahua"
        />
    );
}

export default LoteriaAccessPanel;
