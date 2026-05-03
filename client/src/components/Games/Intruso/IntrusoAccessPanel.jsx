// client/src/components/Games/Intruso/IntrusoAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'
import IconIntruder from '../../../assets/svgs/juegos/intruso_premium.svg';

function IntrusoAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.INTRUDER}
            icon={<img src={IconIntruder} alt="Intruso" className="w-12 h-12" />}
            title="Encuentra al Intruso"
            subtitle="Selecciona la palabra que no pertenece al grupo"
            gameBasePath="/games/intruso"
            cardIcon={<img src={IconIntruder} alt="Lupa" className="w-6 h-6" />}
            tipStudent="Encuentra al intruso rápidamente para ganar más XP"
        />
    );
}

export default IntrusoAccessPanel;
