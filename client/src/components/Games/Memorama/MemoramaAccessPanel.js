import React from 'react';
import GameAccessPanel from '../GameAccessPanel';
import ActivityTypes from '../../../utils/activityTypes';

function MemoramaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.memoryGame.value}
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
