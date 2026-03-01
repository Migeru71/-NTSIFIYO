// client/src/components/Games/Rompecabezas/RompecabezasFinalView.js
// Vista Final del Rompecabezas — Fase 3: ¡Lección Completada!
import React from 'react';
import './Rompecabezas.css';

const RompecabezasFinalView = ({
    score,
    totalQuestions,
    elapsed,
    activityTitle,
    onRetry,
    onExit
}) => {
    const formatTime = (seconds) => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    };

    const getMotivationalMessage = () => {
        if (score === totalQuestions) return '¡Excelente trabajo!';
        if (score >= totalQuestions * 0.8) return '¡Muy bien hecho!';
        if (score >= totalQuestions * 0.6) return '¡Buen esfuerzo!';
        return '¡Sigue practicando!';
    };

    return (
        <div className="rp-final-container">
            {/* ── Barra superior ── */}
            <div className="rp-final-top-bar">
                <div className="rp-final-avatar">👤</div>
                <span className="rp-final-header-title">Puntaje</span>
                <button className="rp-final-close-btn" onClick={onExit}>✕</button>
            </div>

            {/* ── Titulo ── */}
            <h1 className="rp-final-lesson-title">
                ¡Lección<br />Completada!
            </h1>

            {/* ── Trofeo ── */}
            <div className="rp-trophy-circle">🏆</div>

            {/* ── Card de resultados ── */}
            <div className="rp-results-card">
                <div className="rp-results-card-header">
                    RESULTADOS DEL DÍA
                </div>

                <p className="rp-results-message">{getMotivationalMessage()}</p>

                {/* Tiempo */}
                <div className="rp-results-row">
                    <div className="rp-results-row-left">
                        <div className="rp-results-row-icon">🕐</div>
                        <span>Tiempo</span>
                    </div>
                    <span className="rp-results-row-value">{formatTime(elapsed)}</span>
                </div>

                {/* Puntaje */}
                <div className="rp-results-row">
                    <div className="rp-results-row-left">
                        <div className="rp-results-row-icon"
                            style={{ background: '#ECFDF5' }}>
                            ⭐
                        </div>
                        <span>Puntaje</span>
                    </div>
                    <span className="rp-results-row-value">{score}/{totalQuestions}</span>
                </div>
            </div>

            {/* ── Acciones ── */}
            <div className="rp-final-actions">
                <button className="rp-btn-repeat" onClick={onRetry}>
                    Repetir
                </button>
                <button className="rp-btn-next" onClick={onExit}>
                    Siguiente Lección
                </button>
            </div>
        </div>
    );
};

export default RompecabezasFinalView;
