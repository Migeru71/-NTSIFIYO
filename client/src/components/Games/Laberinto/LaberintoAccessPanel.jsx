// client/src/components/Games/Intruso/IntrusoAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'
import IconMaze from '../../../assets/svgs/juegos/laberinto_premium.svg';

function LaberintoAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.MAZE}
            icon={<img src={IconMaze} alt="Laberinto" className="w-12 h-12" />}
            title="Laberinto"
            subtitle="Encuentra la salida del laberinto"
            gameBasePath="/games/laberinto"
            cardIcon={<img src={IconMaze} alt="Laberinto" className="w-6 h-6" />}
            tipStudent="Encuentra la salida del laberinto rápidamente para ganar más XP"
        />
    );
}

export default LaberintoAccessPanel;
