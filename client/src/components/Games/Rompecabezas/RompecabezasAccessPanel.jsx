// client/src/components/Games/Rompecabezas/RompecabezasAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'
import IconPuzzle from '../../../assets/svgs/juegos/rompecabezas_premium.svg';

function RompecabezasAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.PUZZLE}
            icon={<img src={IconPuzzle} alt="Rompecabezas" className="w-12 h-12" />}
            title="Rompecabezas"
            subtitle="Completa la frase eligiendo la pieza correcta"
            gameBasePath="/games/rompecabezas"
            cardIcon={<img src={IconPuzzle} alt="Pieza" className="w-6 h-6" />}
            tipStudent="Elige la pieza correcta para completar la frase"
            tipTeacher="Crea actividades y tus alumnos aprenderán completando frases"
        />
    );
}

export default RompecabezasAccessPanel;
