// client/src/components/Games/Rompecabezas/RompecabezasGameView.js
// Vista de juego de Rompecabezas — Fase 2: Juego
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockRompecabezas from '../../../data/mockRompecabezas';
import RompecabezasFinalView from './RompecabezasFinalView';
import './Rompecabezas.css';

const RompecabezasGameView = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cola de preguntas (incluye reintentos al final)
    const [questionQueue, setQuestionQueue] = useState([]);
    // Índice actual dentro de la cola
    const [currentIndex, setCurrentIndex] = useState(0);
    // Cuántas preguntas "originales" se procesaron (para la barra de progreso)
    const [completedOriginal, setCompletedOriginal] = useState(0);
    // Total de preguntas originales (5)
    const [totalOriginal, setTotalOriginal] = useState(5);

    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
    const [score, setScore] = useState(0);         // Aciertos al primer intento
    const [gameState, setGameState] = useState('loading'); // loading | playing | finished
    const [elapsed, setElapsed] = useState(0);
    // Preguntas que el usuario falló al primer intento (marcadas para segunda oportunidad)
    const [failedOnFirst, setFailedOnFirst] = useState(new Set());

    const timerRef = useRef(null);
    const feedbackTimeout = useRef(null);

    // ─── Cargar actividad ────────────────────────────────────────────────────
    useEffect(() => {
        const id = parseInt(activityId);
        const found = mockRompecabezas.find(a => a.id === id);
        if (found && found.questions) {
            setActivity(found);
            // Mezclar opciones de cada pregunta para que no siempre esté la correcta a la izquierda
            const shuffled = found.questions.map(q => ({
                ...q,
                responseList: [...q.responseList].sort(() => Math.random() - 0.5)
            }));
            setQuestionQueue(shuffled);
            setTotalOriginal(found.questions.length);
            setGameState('playing');
        } else {
            console.error('Actividad de Rompecabezas no encontrada con ID:', id);
        }
        setLoading(false);
    }, [activityId]);

    // ─── Cronómetro ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    const formatTime = (seconds) => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    };

    // ─── Seleccionar opción ─────────────────────────────────────────────────
    const handleSelectOption = (option) => {
        if (feedback !== null) return; // ignorar durante feedback
        setSelectedOption(option);
    };

    // ─── Comprobar respuesta ────────────────────────────────────────────────
    const handleCheck = useCallback(() => {
        if (!selectedOption || feedback !== null) return;

        const isCorrect = selectedOption.isCorrect;
        const currentQ = questionQueue[currentIndex];

        if (isCorrect) {
            setFeedback('correct');
            // Solo cuenta como acierto si es el primer intento (no un reintento)
            if (!failedOnFirst.has(currentIndex)) {
                setScore(prev => prev + 1);
            }
        } else {
            setFeedback('incorrect');
            // Marcar como fallada si es el primer intento — agregar al final de la cola
            if (!failedOnFirst.has(currentIndex)) {
                setFailedOnFirst(prev => new Set([...prev, currentIndex]));
                // Añadir la pregunta al final de la cola (segunda oportunidad)
                setQuestionQueue(prev => [...prev, {
                    ...currentQ,
                    responseList: [...currentQ.responseList].sort(() => Math.random() - 0.5)
                }]);
            }
        }

        // Avanzar después de mostrar feedback
        feedbackTimeout.current = setTimeout(() => {
            setFeedback(null);
            setSelectedOption(null);

            const nextIndex = currentIndex + 1;
            setCompletedOriginal(prev => Math.min(prev + 1, totalOriginal));

            if (nextIndex >= questionQueue.length + (isCorrect ? 0 : 0)
                || nextIndex >= (questionQueue.length)) {
                // Verificar si la cola ya terminó
                setGameState('finished');
            } else {
                setCurrentIndex(nextIndex);
            }
        }, 900);
    }, [selectedOption, feedback, questionQueue, currentIndex, failedOnFirst, totalOriginal]);

    // Limpiar timeouts al desmontar
    useEffect(() => {
        return () => {
            clearTimeout(feedbackTimeout.current);
            clearInterval(timerRef.current);
        };
    }, []);

    // ─── Progreso visual ─────────────────────────────────────────────────────
    // La barra muestra cuántas preguntas se han procesado de las 5 originales.
    // Los reintentos no aumentan la barra.
    const progressPercent = totalOriginal > 0
        ? (Math.min(completedOriginal, totalOriginal) / totalOriginal) * 100
        : 0;
    // La etiqueta numérica muestra la pregunta original actual
    const questionLabel = Math.min(completedOriginal + 1, totalOriginal);

    // ─── Render: Loading ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="game-loading-container">
                <div className="spinner" />
                <p>Cargando rompecabezas...</p>
            </div>
        );
    }

    // ─── Render: Error ────────────────────────────────────────────────────────
    if (!activity) {
        return (
            <div className="game-error-container">
                <p style={{ color: '#E65100', fontWeight: '700' }}>Actividad no encontrada</p>
                <button onClick={() => navigate('/games/rompecabezas')}
                    style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Volver
                </button>
            </div>
        );
    }

    // ─── Render: Final ────────────────────────────────────────────────────────
    if (gameState === 'finished') {
        return (
            <RompecabezasFinalView
                score={score}
                totalQuestions={totalOriginal}
                elapsed={elapsed}
                activityTitle={activity.title}
                onRetry={() => window.location.reload()}
                onExit={() => navigate('/games/rompecabezas')}
            />
        );
    }

    const currentQuestion = questionQueue[currentIndex];
    const isRetry = failedOnFirst.has(currentIndex) === false
        ? false
        : currentIndex >= totalOriginal;

    return (
        <div className="rp-container">
            {/* ── Barra superior ── */}
            <div className="rp-top-bar">
                <button className="rp-back-btn" onClick={() => navigate('/games/rompecabezas')}
                    title="Salir">
                    ‹
                </button>
                <span className="rp-title">{activity.title}</span>
                <button className="rp-help-btn" title="Ayuda">?</button>
            </div>

            {/* ── Barra de progreso ── */}
            <div className="rp-progress-row">
                <div className="rp-progress-bar-bg">
                    <div
                        className="rp-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <span className="rp-progress-label">{questionLabel}/{totalOriginal}</span>
            </div>

            {/* ── Instrucción ── */}
            <div className="rp-instruction">
                Completa la frase
                {isRetry && (
                    <span style={{ display: 'block', fontSize: '13px', color: '#E65100', marginTop: '4px' }}>
                        🔄 Segunda oportunidad
                    </span>
                )}
            </div>

            {/* ── Piezas superiores (pregunta + slot) ── */}
            <div className="rp-question-area" key={`q-${currentIndex}`}>
                {/* Pieza con la palabra/frase */}
                <div className="rp-piece rp-piece-question">
                    {currentQuestion.question}
                </div>

                {/* Slot para completar */}
                <div className={`rp-piece-slot ${selectedOption ? 'filled' : ''}`}>
                    {selectedOption ? (
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: feedback === 'correct' ? 'var(--success)'
                                : feedback === 'incorrect' ? 'var(--error)'
                                    : 'var(--primary-orange)'
                        }}>
                            {selectedOption.answerText}
                        </span>
                    ) : (
                        <span style={{ fontSize: '28px' }}>+</span>
                    )}
                </div>
            </div>

            {/* ── Opciones ── */}
            <div className="rp-options-section">
                <div className="rp-options-grid">
                    {currentQuestion.responseList.map((option, idx) => {
                        let extraClass = '';
                        if (feedback && selectedOption && selectedOption.answerText === option.answerText) {
                            extraClass = feedback === 'correct' ? 'correct' : 'incorrect';
                        } else if (feedback === 'incorrect' && option.isCorrect) {
                            // Resaltar la correcta cuando el usuario se equivoca
                            extraClass = 'correct';
                        }

                        const isSelected = selectedOption && selectedOption.answerText === option.answerText;

                        return (
                            <button
                                key={idx}
                                className={`rp-option-piece ${isSelected && !feedback ? 'selected' : ''} ${extraClass}`}
                                onClick={() => handleSelectOption(option)}
                                disabled={!!feedback}
                            >
                                <span className="rp-option-text">{option.answerText}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Botón Comprobar ── */}
            <button
                className="rp-check-btn"
                onClick={handleCheck}
                disabled={!selectedOption || !!feedback}
            >
                Comprobar Respuesta
            </button>

            {/* ── Feedback Banner ── */}
            {feedback && (
                <div className={`rp-feedback-banner ${feedback}`}>
                    {feedback === 'correct' ? '¡Correcto! 🎉' : 'Inténtalo de nuevo 😅'}
                </div>
            )}

            {/* ── Cronómetro (mini, esquina) ── */}
            <div style={{
                position: 'fixed',
                top: '14px',
                right: '70px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                fontVariantNumeric: 'tabular-nums'
            }}>
                ⏱ {formatTime(elapsed)}
            </div>
        </div>
    );
};

export default RompecabezasGameView;
