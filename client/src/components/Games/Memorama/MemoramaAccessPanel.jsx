import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig';

function MemoramaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.MEMORY_GAME}
            icon="🃏"
            title="Memorama"
            subtitle="Emparejar Pares"
            gameBasePath="/games/memorama"
            cardIcon="🎴"
            tipStudent="Encuentra los pares para completar el memorama"
            tipTeacher="Crea pares de palabras e imágenes para el memorama"
        />
    );
}

export default MemoramaAccessPanel;
