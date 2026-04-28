// client/src/components/Games/Intruso/IntrusoAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'

function LaberintoAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.MAZE}
            icon="🀄"
            title="Laberinto"
            subtitle="Encuentra la salida del laberinto"
            gameBasePath="/games/laberinto"
            cardIcon="🀄"
            tipStudent="Encuentra la salida del laberinto rápidamente para ganar más XP"
        />
    );
}

export default LaberintoAccessPanel;
