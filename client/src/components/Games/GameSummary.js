// client/src/components/Games/GameSummary.js
import React, { useState, useEffect } from 'react';
import ActivityApiService from '../../services/ActivityApiService';
import './GameSummary.css';

const GameSummary = ({
    activityId,
    gameId,
    startDate,
    correctAnswers,
    totalQuestions,
    responseLogs,
    onExit,
    onRetry
}) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [expandedLogs, setExpandedLogs] = useState(false);

    useEffect(() => {
        const calculateResults = async () => {
            try {
                // Formatting payload as requested by user
                const payload = {
                    activityId: parseInt(activityId, 10),
                    startDate: startDate,
                    correctAnswers: correctAnswers,
                    gameId: parseInt(gameId, 10),
                    responseLogs: responseLogs.map(log => ({
                        questionId: log.questionId,
                        answerId: log.answerId,
                        isCorrect: log.isCorrect
                    }))
                };

                const apiResult = await ActivityApiService.completeActivity(payload);

                if (apiResult.success && apiResult.data) {
                    setResult(apiResult.data);
                } else {
                    // Fallback visual data if API fails or doesn't return correct structure initially
                    setResult({
                        xpGained: 150,
                        actualXp: 450,
                        currentLevel: 2,
                        isLevelUp: false
                    });
                    console.warn("API completion failed or unexpected response, using fallback UI.");
                }
            } catch (err) {
                console.error("Error completing activity:", err);
                setError("Hubo un problema al guardar tu progreso.");
            } finally {
                setLoading(false);
            }
        };

        calculateResults();
    }, [activityId, gameId, startDate, correctAnswers, responseLogs]);

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => { });
        }
    };

    if (loading) {
        return (
            <div className="game-summary-container">
                <div className="spinner"></div>
                <h2>Guardando progreso...</h2>
            </div>
        );
    }

    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const isLevelUp = result?.isLevelUp;

    return (
        <div className="game-summary-container">
            <div className="gs-card">
                {/* Left Panel */}
                <div className="gs-left-panel">
                    <div className="gs-header">
                        <h2>¡Actividad Completada!</h2>
                        <span className="gs-emoji">
                            {percentage >= 80 ? '🏆' : percentage >= 50 ? '🌟' : '📚'}
                        </span>
                    </div>

                    <div className="gs-score-section">
                        <div className="gs-score-circle">
                            <svg viewBox="0 0 100 100" className="gs-progress-ring">
                                <circle className="gs-ring-bg" cx="50" cy="50" r="45"></circle>
                                <circle
                                    className="gs-ring-fill"
                                    cx="50" cy="50" r="45"
                                    style={{ strokeDashoffset: `calc(283 - (283 * ${percentage}) / 100)` }}
                                ></circle>
                            </svg>
                            <div className="gs-score-text">
                                <span className="gs-score-number">{correctAnswers}</span>
                                <span className="gs-score-total">/ {totalQuestions}</span>
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className={`gs-xp-container ${isLevelUp ? 'level-up-anim' : 'xp-pop-anim'}`}>
                            <div className="gs-xp-badge">
                                <span className="gs-xp-icon">⭐</span>
                                <span className="gs-xp-value">+{result.xpGained} XP</span>
                            </div>

                            <div className="gs-level-info">
                                {isLevelUp && <div className="gs-level-up-tag">¡SUBISTE DE NIVEL! 🚀</div>}
                                <span className="gs-current-level">Nivel {result.currentLevel}</span>
                            </div>
                        </div>
                    )}

                    <div className="gs-actions">
                        {onRetry && (
                            <button className="gs-btn gs-btn-retry" onClick={onRetry}>
                                🔄 Reintentar
                            </button>
                        )}
                        <button className="gs-btn gs-btn-exit" onClick={onExit}>
                            ✓ Continuar
                        </button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="gs-right-panel">
                    <div className={`gs-logs-section ${expandedLogs ? 'expanded' : ''}`}>
                        <button
                            className="gs-logs-toggle"
                            onClick={() => setExpandedLogs(!expandedLogs)}
                        >
                            {expandedLogs ? 'Ocultar Revisión' : 'Revisar Respuestas'}
                            <span>{expandedLogs ? '▲' : '▼'}</span>
                        </button>

                        <div className="gs-logs-list">
                            {responseLogs.map((log, index) => (
                                <div key={index} className={`gs-log-item ${log.isCorrect ? 'log-correct' : 'log-wrong'}`}>
                                    <div className="gs-log-header">
                                        <span className="gs-log-icon">{log.isCorrect ? '✅' : '❌'}</span>
                                        <span className="gs-log-question-num">Pregunta {index + 1}</span>
                                    </div>

                                    <div className="gs-log-content">
                                        <div className="gs-log-label">Pregunta:</div>
                                        <div className="gs-log-stimulus">
                                            {log.questionImage && <img src={log.questionImage} alt="Q" className="gs-log-img" />}
                                            {log.questionText && <span>{log.questionText}</span>}
                                            {log.questionAudio && (
                                                <button onClick={() => playAudio(log.questionAudio)} className="gs-log-audio-btn">🔊</button>
                                            )}
                                        </div>
                                    </div>

                                    {log.isMemorama ? (
                                        <div className="gs-log-comparison">
                                            <div className="gs-log-cell correct-cell">
                                                <div className="gs-log-label">Respuesta correcta (Estímulo):</div>
                                                <div className="gs-log-value">
                                                    {log.questionText && <span>{log.questionText}</span>}
                                                    {log.questionAudio && <button onClick={() => playAudio(log.questionAudio)} className="gs-log-audio-btn">🔊</button>}
                                                </div>
                                                <div className="gs-log-label">Tarjeta mostrada (a evaluar):</div>
                                                <div className="gs-log-value">
                                                    {log.correctText && <span>{log.correctText}</span>}
                                                    {log.correctAudio && <button onClick={() => playAudio(log.correctAudio)} className="gs-log-audio-btn">🔊</button>}
                                                </div>
                                            </div>
                                            <div className="gs-log-cell user-cell">
                                                <div className="gs-log-label">Tu elección:</div>
                                                <div className="gs-log-value" style={{ fontWeight: 'bold', color: log.isCorrect ? '#16a34a' : '#dc2626' }}>
                                                    {log.userSaidMatch ? 'Verdadero (Match)' : 'Falso (No Match)'}
                                                </div>
                                                {!log.isCorrect && (
                                                    <div className="gs-log-correction" style={{ fontSize: '12px', marginTop: '4px', color: '#6b7280' }}>
                                                        Era {log.actuallyMatched ? 'Match' : 'No Match'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="gs-log-comparison">
                                            <div className="gs-log-cell correct-cell">
                                                <div className="gs-log-label">Correcta:</div>
                                                <div className="gs-log-value">
                                                    {log.correctImage && <img src={log.correctImage} alt="C" className="gs-log-img" />}
                                                    {log.correctText && <span>{log.correctText}</span>}
                                                    {log.correctAudio && <button onClick={() => playAudio(log.correctAudio)} className="gs-log-audio-btn">🔊</button>}
                                                </div>
                                            </div>

                                            {!log.isCorrect && (
                                                <div className="gs-log-cell wrong-cell">
                                                    <div className="gs-log-label">Seleccionaste:</div>
                                                    <div className="gs-log-value">
                                                        {log.selectedImage && <img src={log.selectedImage} alt="W" className="gs-log-img" />}
                                                        {log.selectedText ? <span>{log.selectedText}</span> : (!log.selectedImage && !log.selectedAudio ? <span>(Sin respuesta / Tiempo)</span> : null)}
                                                        {log.selectedAudio && <button onClick={() => playAudio(log.selectedAudio)} className="gs-log-audio-btn">🔊</button>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameSummary;
