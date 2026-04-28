// client/src/components/Games/Intruso/IntrusoAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'

function IntrusoAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.INTRUDER}
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
