import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig';
import IconPares from '../../../assets/svgs/juegos/pares_premium.svg';

function ParesAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.PAIRS}
            icon={<img src={IconPares} alt="Pares" className="w-12 h-12" />}
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
