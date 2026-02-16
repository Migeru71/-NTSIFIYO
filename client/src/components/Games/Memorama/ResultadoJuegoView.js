// client/src/components/Games/Memorama/ResultadoJuegoView.js
import React from 'react';
import './Memorama.css';

const ResultadoJuegoView = ({ result, activity }) => {
    const renderStars = (stars) => (
        <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>
            ))}
        </div>
    );

    const getStarMessage = (stars) => {
        const messages = {
            5: '🏆 ¡Excelente! Dominaste completamente',
            4: '🎉 ¡Muy bien! Gran desempeño',
            3: '👍 ¡Bueno! Sigue practicando',
            2: '💪 Necesitas más práctica',
            1: '📚 Sigue intentando',
            0: '❌ Inténtalo nuevamente'
        };
        return messages[stars] || 'Gracias por jugar';
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="resultado-juego-container">
            <div className="resultado-content">

                {/* 1. Encabezado */}
                <div className="resultado-header">
                    <h1>Actividad Completada</h1>
                    <p className="activity-name">{activity.name}</p>
                </div>

                {/* 2. Calificación */}
                <div className="rating-section">
                    <div className="stars-display">{renderStars(result.stars)}</div>
                    <p className="star-message">{getStarMessage(result.stars)}</p>
                </div>

                {/* 3. Estadísticas del Juego */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                            <span className="stat-label">Tiempo Total</span>
                            <span className="stat-value">{formatTime(result.gameStats.totalTime)}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <span className="stat-label">Intentos</span>
                            <span className="stat-value">{result.gameStats.totalAttempts}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <span className="stat-label">Parejas Encontradas</span>
                            <span className="stat-value">{`${result.gameStats.correctMatches} / ${result.gameStats.totalPairs}`}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <span className="stat-label">Precisión</span>
                            <span className="stat-value">{`${result.successRate}%`}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Desglose de Puntuación */}
                <div className="scoring-breakdown">
                    <h3>📈 Análisis de Puntuación</h3>
                    <div className="breakdown-item">
                        <span className="breakdown-label">Éxito en Emparejamiento (40%)</span>
                        <div className="breakdown-bar">
                            <div className="breakdown-fill success" style={{ width: `${result.successRate}%` }} />
                        </div>
                        <span className="breakdown-value">{`${result.successRate}%`}</span>
                    </div>
                    <div className="breakdown-total">
                        <span className="breakdown-label">Puntuación General</span>
                        <span className="breakdown-score">{`${result.score}/100`}</span>
                    </div>
                </div>

                {/* 5. Sección XP */}
                <div className="xp-section">
                    <div className="xp-card">
                        <div className="xp-recommended">
                            <span className="xp-label">XP Recomendado</span>
                            <span className="xp-value">{result.recommendedXP}</span>
                        </div>
                        <div className="xp-arrow">→</div>
                        <div className="xp-earned">
                            <span className="xp-label">XP Obtenido</span>
                            <span className="xp-value highlight">{result.finalXP}</span>
                        </div>
                    </div>
                    <p className="xp-info">{`Ganaste ${result.finalXP} XP basado en ${result.stars} ⭐`}</p>
                </div>

                {/* 6. Retroalimentación */}
                <div className="feedback-section">
                    <h3>💡 Retroalimentación</h3>
                    {result.successRate === 100 ? (
                        <p>🎊 ¡Perfecto! Encontraste todos los pares sin errores.</p>
                    ) : result.stars >= 3 ? (
                        <p>🌟 Buen trabajo. Si reduces el tiempo y aumentas la precisión, alcanzarás 5 estrellas.</p>
                    ) : (
                        <p>📚 Necesitas más práctica. Intenta memorizar mejor la ubicación de las cartas.</p>
                    )}
                </div>

                {/* 7. Botones de Acción */}
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        🔄 Jugar de Nuevo
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.history.back()}>
                        ← Volver al Menú
                    </button>
                </div>

                {/* 8. Info de Guardado */}
                <div className="save-info">
                    <p>✅ Tu resultado ha sido guardado correctamente</p>
                    <small>{`Completado el: ${new Date(result.completedAt).toLocaleString()}`}</small>
                </div>
            </div>
        </div>
    );
};

export default ResultadoJuegoView;