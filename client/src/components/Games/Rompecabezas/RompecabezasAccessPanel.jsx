// client/src/components/Games/Rompecabezas/RompecabezasAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'

function RompecabezasAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.PUZZLE}
            icon="🧩"
            title="Rompecabezas"
            subtitle="Completa la frase eligiendo la pieza correcta"
            gameBasePath="/games/rompecabezas"
            cardIcon="🧩"
            tipStudent="Elige la pieza correcta para completar la frase"
            tipTeacher="Crea actividades y tus alumnos aprenderán completando frases"
        />
    );
}

export default RompecabezasAccessPanel;
