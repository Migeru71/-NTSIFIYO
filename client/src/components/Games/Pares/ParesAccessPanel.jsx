import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig';

function ParesAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.PAIRS}
            icon="🃏"
            title="Pares"
            subtitle="Enlaza los elementos"
            gameBasePath="/games/pares"
            cardIcon="mediation"
            tipStudent="Traza una línea para unir los elementos correctos."
            tipTeacher="Configura parejas de elementos (texto, imagen o audio) para que el estudiante las relacione."
        />
    );
}

export default ParesAccessPanel;
