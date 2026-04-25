import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import ActivityTypes from '../../../utils/activityTypes';

function MemoriaRapidaAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.fastMemory.value}
            icon="⚡"
            title="Memoria Rápida"
            subtitle="Desliza a la derecha si coincide, a la izquierda si no"
            gameBasePath="/games/memoria_rapida"
            cardIcon="🎴"
            tipStudent="Desliza rápido y acumula combos para ganar más XP"
            tipTeacher="Crea actividades personalizadas de Memoria Rápida para tus alumnos"
        />
    );
}

export default MemoriaRapidaAccessPanel;