// client/src/components/Games/MemoriaRapida/MemoriaRapidaFinalView.js
// Pantalla de resultado para Memoria Rápida
import React from 'react';
import './MemoriaRapida.css';

const MemoriaRapidaFinalView = ({ result, activity }) => {
    const renderStars = (stars) => (
        <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>
            ))}
        </div>
    );

    const getStarMessage = (stars) => {
        const messages = {
            5: '🏆 ¡Increíble! ¡Reflejos perfectos!',
            4: '🎉 ¡Excelente ritmo!',
            3: '👍 ¡Bien hecho! Sigue practicando',
            2: '💪 Necesitas más velocidad',
            1: '📚 Sigue intentando',
            0: '❌ Inténtalo de nuevo'
        };
        return messages[stars] || 'Gracias por jugar';
    };

    const correctCards = result.gameStats?.correctCards || 0;
    const totalCards = result.gameStats?.totalCards || 0;
    const maxCombo = result.gameStats?.maxCombo || 0;
    const gameScore = result.gameStats?.score || 0;
    const accuracy = totalCards > 0 ? Math.round((correctCards / totalCards) * 100) : 0;

    return (
        <div className="resultado-juego-container">
            <div className="resultado-content">

                {/* 1. Encabezado */}
                <div className="resultado-header">
                    <h1>🎉 ¡Tiempo!</h1>
                    <p className="activity-name">{activity.name}</p>
                </div>

                {/* 2. Calificación */}
                <div className="rating-section">
                    <div className="stars-display">{renderStars(result.stars)}</div>
                    <p className="star-message">{getStarMessage(result.stars)}</p>
                </div>

                {/* 3. Estadísticas */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <span className="stat-label">Puntaje</span>
                            <span className="stat-value">{gameScore.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <span className="stat-label">Correctas</span>
                            <span className="stat-value">{correctCards} / {totalCards}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-content">
                            <span className="stat-label">Combo Máximo</span>
                            <span className="stat-value">{maxCombo}x</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <span className="stat-label">Precisión</span>
                            <span className="stat-value">{accuracy}%</span>
                        </div>
                    </div>
                </div>

                {/* 4. Desglose */}
                <div className="scoring-breakdown">
                    <h3>📈 Análisis de Desempeño</h3>
                    <div className="breakdown-item">
                        <span className="breakdown-label">Precisión ({accuracy}%)</span>
                        <div className="breakdown-bar">
                            <div className="breakdown-fill success" style={{ width: `${accuracy}%` }} />
                        </div>
                    </div>
                    <div className="breakdown-item">
                        <span className="breakdown-label">Combo ({maxCombo}x)</span>
                        <div className="breakdown-bar">
                            <div className="breakdown-fill warning" style={{ width: `${Math.min(100, maxCombo * 10)}%` }} />
                        </div>
                    </div>
                    <div className="breakdown-total">
                        <span className="breakdown-label">Puntuación General</span>
                        <span className="breakdown-score">{result.score}/100</span>
                    </div>
                </div>

                {/* 5. XP */}
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
                    {accuracy >= 90 ? (
                        <p>🎊 ¡Perfecto! Tus reflejos y vocabulario son excelentes. ¡Intenta en dificultad más alta!</p>
                    ) : accuracy >= 60 ? (
                        <p>🌟 Buen trabajo. Practica más para mejorar tu velocidad de reconocimiento de palabras mazahua.</p>
                    ) : (
                        <p>📚 Repasa el vocabulario y vuelve a intentarlo. La práctica hace al maestro.</p>
                    )}
                </div>

                {/* 7. Botones */}
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        🔄 Jugar de Nuevo
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.history.back()}>
                        ← Volver al Menú
                    </button>
                </div>

                {/* 8. Info */}
                <div className="save-info">
                    <p>✅ Tu resultado ha sido guardado correctamente</p>
                    <small>{`Completado el: ${new Date(result.completedAt).toLocaleString()}`}</small>
                </div>
            </div>
        </div>
    );
};

export default MemoriaRapidaFinalView;