// client/src/components/Games/Memorama/MemoramaFinalView.js
// Fase 3 — Final: Resultados de la partida de Memorama
import React from 'react';
import './Memorama.css';

const MemoramaFinalView = ({ totalPairs, matchedPairs, attempts, elapsed, experience, onRetry, onExit }) => {
    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    // Precisión basada en intentos vs pares
    const accuracy = attempts > 0 ? Math.round((matchedPairs / attempts) * 100) : 100;

    // Estrellas: 1-5
    const getStars = (acc) => {
        if (acc >= 90) return 5;
        if (acc >= 75) return 4;
        if (acc >= 55) return 3;
        if (acc >= 35) return 2;
        return 1;
    };

    const stars = getStars(accuracy);

    // XP ganado proporcional a estrellas
    const xpEarned = Math.round(experience * (stars / 5));

    const starsRow = Array.from({ length: 5 }, (_, i) =>
        <span key={i} style={{ opacity: i < stars ? 1 : 0.25 }}>⭐</span>
    );

    return (
        <div className="mem-final-container">
            {/* Título */}
            <h1 className="mem-final-title">¡Actividad<br />Completada!</h1>

            {/* Círculo de pares */}
            <div className="mem-pairs-circle">
                <span className="mem-pairs-big">{matchedPairs}</span>
                <span className="mem-pairs-total">/ {totalPairs}</span>
                <span className="mem-pairs-label">Pares Encontrados</span>
            </div>

            {/* Stats card (precisión + tiempo) */}
            <div className="mem-stats-card">
                <div className="mem-stat-col">
                    <span className="mem-stat-label">Precisión</span>
                    <div className="mem-stars-row">{starsRow}</div>
                </div>
                <div className="mem-stat-col">
                    <span className="mem-stat-label">Tiempo</span>
                    <div className="mem-stat-time">
                        🕐 {formatTime(elapsed)}
                    </div>
                </div>
            </div>

            {/* XP Banner */}
            <div className="mem-xp-banner">
                <div className="mem-xp-value">⭐ +{xpEarned} XP</div>
                <div className="mem-xp-sub">Nivel de precisión: {accuracy}%</div>
            </div>

            {/* Botones */}
            <div className="mem-final-actions">
                <button className="mem-btn-retry" onClick={onRetry}>
                    ↺ Reintentar
                </button>
                <button className="mem-btn-continue" onClick={onExit}>
                    ✓ Continuar
                </button>
            </div>
        </div>
    );
};

export default MemoramaFinalView;
