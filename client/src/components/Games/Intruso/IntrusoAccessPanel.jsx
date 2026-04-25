// client/src/components/Games/Intruso/IntrusoAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import ActivityTypes from '../../../utils/activityTypes'

function IntrusoAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.intruder.value}
            icon="🕵️"
            title="Encuentra al Intruso"
            subtitle="Selecciona la palabra que no pertenece al grupo"
            gameBasePath="/games/intruso"
            cardIcon="🕵️"
            tipStudent="Encuentra al intruso rápidamente para ganar más XP"
        />
    );
}

export default IntrusoAccessPanel;
