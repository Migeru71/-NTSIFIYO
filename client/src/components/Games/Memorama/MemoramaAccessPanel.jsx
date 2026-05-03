import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig';
import IconPares from '../../../assets/svgs/juegos/pares_premium.svg';
import IconMemorama from '../../../assets/svgs/juegos/memorama_premium.svg';

function MemoramaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.MEMORY_GAME}
            icon={<img src={IconPares} alt="Memorama" className="w-12 h-12" />}
            title="Memorama"
            subtitle="Emparejar Pares"
            gameBasePath="/games/memorama"
            cardIcon={<img src={IconMemorama} alt="Cartas" className="w-6 h-6" />}
            tipStudent="Encuentra los pares para completar el memorama"
            tipTeacher="Crea pares de palabras e imágenes para el memorama"
        />
    );
}

export default MemoramaAccessPanel;
