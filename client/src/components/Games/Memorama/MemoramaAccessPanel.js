// client/src/components/Games/Memorama/MemoramaAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GameAccessPanel';
import ActivityTypes from '../../../utils/activityTypes'

function MemoramaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.fastMemory.value}
            icon="⚡"
            title="Memoria Rápida"
            subtitle="Desliza a la derecha si coincide, a la izquierda si no"
            gameBasePath="/games/memorama"
            cardIcon="🎴"
            tipStudent="Desliza rápido y acumula combos para ganar más XP"
        />
    );
}

export default MemoramaAccessPanel;