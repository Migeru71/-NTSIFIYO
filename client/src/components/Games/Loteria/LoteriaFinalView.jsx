// client/src/components/Games/Loteria/LoteriaFinalView.jsx
// Fase 3 — Final: Resultados de la partida de Lotería
// Estilo basado en la referencia: fondo degradado, trofeo naranja, stats en tarjetas
import React from 'react';
import './Loteria.css';

const LoteriaFinalView = ({
    totalCards,
    matchedCards,
    score,
    penaltyCount,
    elapsed,
    experience,
    onRetry,
    onExit
}) => {
    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const accuracy = totalCards > 0 ? Math.round((matchedCards / totalCards) * 100) : 100;

    const getSubtitle = (acc) => {
        if (acc === 100) return '¡Excelente partida, campeón!';
        if (acc >= 80) return '¡Muy bien jugado!';
        if (acc >= 60) return '¡Buen intento, sigue practicando!';
        return '¡Sigue practicando para mejorar!';
    };

    const xpEarned = Math.max(0, Math.round(experience * (accuracy / 100) - penaltyCount * 2));

    return (
        <div className="lot-final-bg">

            {/* Barra superior */}
            <div className="lot-final-topbar">
                <div className="lot-final-logo">
                    <span className="lot-final-logo-icon">🎰</span>
                    Lotería
                </div>
            </div>

            {/* Cuerpo */}
            <div className="lot-final-body">

                {/* Título */}
                <h1 className="lot-final-title">¡Lotería!</h1>
                <p className="lot-final-subtitle">{getSubtitle(accuracy)}</p>

                {/* Trofeo */}
                <div className="lot-trophy-wrapper">
                    <div className="lot-trophy-circle">🏆</div>
                    <div className="lot-trophy-star">⭐</div>
                </div>

                {/* Stats: Puntaje + Tiempo */}
                <div className="lot-final-stats">
                    <div className="lot-final-stat-card">
                        <span className="lot-final-stat-label">Puntaje Final</span>
                        <span className="lot-final-stat-value">{score}</span>
                    </div>
                    <div className="lot-final-stat-card">
                        <span className="lot-final-stat-label">Tiempo Total</span>
                        <span className="lot-final-stat-value" style={{ fontSize: '36px' }}>{formatTime(elapsed)}</span>
                    </div>
                </div>

                {/* Info adicional */}
                <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '480px' }}>
                    <div className="lot-final-stat-card" style={{ opacity: 0.85 }}>
                        <span className="lot-final-stat-label">Cartas</span>
                        <span className="lot-final-stat-value" style={{ fontSize: '28px' }}>
                            {matchedCards}/{totalCards}
                        </span>
                    </div>
                    {penaltyCount > 0 && (
                        <div className="lot-final-stat-card" style={{ opacity: 0.85 }}>
                            <span className="lot-final-stat-label">Penalizaciones</span>
                            <span className="lot-final-stat-value" style={{ fontSize: '28px', color: '#EF4444' }}>
                                {penaltyCount}
                            </span>
                        </div>
                    )}
                    <div className="lot-final-stat-card" style={{ opacity: 0.85 }}>
                        <span className="lot-final-stat-label">XP Ganado</span>
                        <span className="lot-final-stat-value" style={{ fontSize: '28px', color: '#E84C0A' }}>
                            +{xpEarned}
                        </span>
                    </div>
                </div>

                {/* Botones */}
                <div className="lot-final-btns">
                    <button className="lot-final-btn-retry" onClick={onRetry}>
                        🔄 Jugar de Nuevo
                    </button>
                    <button className="lot-final-btn-home" onClick={onExit}>
                        🏠 Inicio
                    </button>
                </div>
            </div>

            <div className="lot-final-footer">© Mazahua Prodigioso — Lotería</div>
        </div>
    );
};

export default LoteriaFinalView;
