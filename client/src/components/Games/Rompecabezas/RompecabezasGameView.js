// client/src/components/Games/Rompecabezas/RompecabezasGameView.js
// Vista de juego de Rompecabezas — Fase 2: Juego (con API real)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RompecabezasService from '../../../services/RompecabezasService';
import mockRompecabezas from '../../../data/mockRompecabezas';
import RompecabezasFinalView from './RompecabezasFinalView';
import './Rompecabezas.css';

const RompecabezasGameView = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();

    // ─── Estado general ────────────────────────────────────────────────────
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [activityTitle, setActivityTitle] = useState('Rompecabezas');

    // Configuraciones de display (del servidor)
    // gameConfigs[0] → cómo mostrar el TÍTULO; gameConfigs[1] → RESPUESTAS
    const [gameConfigs, setGameConfigs] = useState([
        { showText: true, showImage: false, playAudio: false, isMazahua: false },
        { showText: true, showImage: false, playAudio: false, isMazahua: false }
    ]);

    // Cola de preguntas (incluye reintentos al final)
    const [questionQueue, setQuestionQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalOriginal, setTotalOriginal] = useState(5);
    const [completedOriginal, setCompletedOriginal] = useState(0);

    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('loading'); // loading | playing | finished | error
    const [elapsed, setElapsed] = useState(0);
    const [failedOnFirst, setFailedOnFirst] = useState(new Set());

    const timerRef = useRef(null);
    const feedbackTimeout = useRef(null);

    // ─── Cargar juego desde la API ─────────────────────────────────────────
    useEffect(() => {
        initGame();
        return () => {
            clearInterval(timerRef.current);
            clearTimeout(feedbackTimeout.current);
        };
    }, [activityId]);

    async function initGame() {
        setLoading(true);
        setLoadError(null);

        const gameId = parseInt(activityId);
        const result = await RompecabezasService.startGame(gameId);

        if (result.success && result.data) {
            loadFromApiData(result.data);
        } else {
            // Fallback a datos mock
            console.warn('API no disponible, usando datos de ejemplo:', result.error);
            const fallback = mockRompecabezas.find(a => a.id === gameId) || mockRompecabezas[0];
            if (fallback) {
                loadFromMockData(fallback);
            } else {
                setLoadError('No se encontró la actividad.');
                setGameState('error');
            }
        }

        setLoading(false);
    }

    /** Mapea la respuesta de la API al estado del juego */
    function loadFromApiData(data) {
        // data: { activityId, wordIds, questions, mediaId, gameConfigs }
        const questions = (data.questions || []).map(q => ({
            question: q.question,
            wordId: q.wordId,
            responseList: shuffleArray([...q.responseList])
        }));

        if (questions.length === 0) {
            setLoadError('La actividad no tiene preguntas disponibles.');
            setGameState('error');
            return;
        }

        if (data.gameConfigs && data.gameConfigs.length >= 2) {
            setGameConfigs(data.gameConfigs);
        }

        setQuestionQueue(questions);
        setTotalOriginal(questions.length);
        setActivityTitle('Rompecabezas');
        setGameState('playing');
    }

    /** Fallback: usa datos del mock */
    function loadFromMockData(activity) {
        const questions = (activity.questions || []).map(q => ({
            question: q.question,
            wordId: null,
            responseList: shuffleArray([...q.responseList])
        }));

        if (activity.gameConfigs && activity.gameConfigs.length >= 2) {
            setGameConfigs(activity.gameConfigs);
        }

        setQuestionQueue(questions);
        setTotalOriginal(questions.length);
        setActivityTitle(activity.title || activity.name || 'Rompecabezas');
        setGameState('playing');
    }

    // ─── Cronómetro ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    function shuffleArray(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    // ─── Seleccionar opción ─────────────────────────────────────────────────
    const handleSelectOption = (option) => {
        if (feedback !== null) return;
        setSelectedOption(option);
    };

    // ─── Comprobar respuesta ────────────────────────────────────────────────
    const handleCheck = useCallback(() => {
        if (!selectedOption || feedback !== null) return;

        const isCorrect = selectedOption.isCorrect;
        const currentQ = questionQueue[currentIndex];

        if (isCorrect) {
            setFeedback('correct');
            if (!failedOnFirst.has(currentIndex)) {
                setScore(prev => prev + 1);
            }
        } else {
            setFeedback('incorrect');
            if (!failedOnFirst.has(currentIndex)) {
                setFailedOnFirst(prev => new Set([...prev, currentIndex]));
                // Segunda oportunidad: añadir al final de la cola con respuestas mezcladas
                setQuestionQueue(prev => [...prev, {
                    ...currentQ,
                    responseList: shuffleArray([...currentQ.responseList])
                }]);
            }
        }

        feedbackTimeout.current = setTimeout(() => {
            setFeedback(null);
            setSelectedOption(null);
            const nextIndex = currentIndex + 1;
            setCompletedOriginal(prev => Math.min(prev + 1, totalOriginal));

            if (nextIndex >= questionQueue.length) {
                setGameState('finished');
            } else {
                setCurrentIndex(nextIndex);
            }
        }, 900);
    }, [selectedOption, feedback, questionQueue, currentIndex, failedOnFirst, totalOriginal]);

    // ─── Progreso ────────────────────────────────────────────────────────────
    const progressPercent = totalOriginal > 0
        ? (Math.min(completedOriginal, totalOriginal) / totalOriginal) * 100 : 0;
    const questionLabel = Math.min(completedOriginal + 1, totalOriginal);

    // ─── Render: Loading ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="game-loading-container">
                <div className="spinner" />
                <p style={{ color: '#1E3A8A', fontFamily: 'Poppins, sans-serif', marginTop: '1rem' }}>
                    Cargando rompecabezas...
                </p>
            </div>
        );
    }

    // ─── Render: Error ────────────────────────────────────────────────────────
    if (gameState === 'error') {
        return (
            <div className="game-error-container">
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '15px',
                    textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxWidth: '400px'
                }}>
                    <p style={{ fontSize: '48px', marginBottom: '1rem' }}>😕</p>
                    <h2 style={{ color: '#E65100', fontFamily: 'Poppins, sans-serif', marginBottom: '0.5rem' }}>
                        Actividad no encontrada
                    </h2>
                    <p style={{ color: '#374151', marginBottom: '1.5rem' }}>{loadError}</p>
                    <button
                        onClick={() => navigate('/games/rompecabezas')}
                        style={{
                            background: '#1E3A8A', color: 'white', padding: '0.75rem 1.5rem',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif', fontWeight: '600'
                        }}>
                        Volver
                    </button>
                </div>
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
                activityTitle={activityTitle}
                onRetry={() => window.location.reload()}
                onExit={() => navigate('/games/rompecabezas')}
            />
        );
    }

    const currentQuestion = questionQueue[currentIndex];
    // ¿Es un reintento? (está más allá del rango de preguntas originales)
    const isRetry = currentIndex >= totalOriginal;

    return (
        <div className="rp-container">
            {/* ── Barra superior ── */}
            <div className="rp-top-bar">
                <button className="rp-back-btn" onClick={() => navigate('/games/rompecabezas')} title="Salir">
                    ‹
                </button>
                <span className="rp-title">{activityTitle}</span>
                <button className="rp-help-btn" title="Ayuda">?</button>
            </div>

            {/* ── Barra de progreso ── */}
            <div className="rp-progress-row">
                <div className="rp-progress-bar-bg">
                    <div className="rp-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="rp-progress-label">{questionLabel}/{totalOriginal}</span>
            </div>

            {/* ── Instrucción ── */}
            <div className="rp-instruction">
                Completa la frase
                {isRetry && (
                    <span style={{ display: 'block', fontSize: '13px', color: '#E65100', fontWeight: '600', marginTop: '4px' }}>
                        🔄 Segunda oportunidad
                    </span>
                )}
            </div>

            {/* ── Piezas superiores (pregunta + slot) ── */}
            <div className="rp-question-area" key={`q-${currentIndex}`}>
                {/* Pieza con la pregunta */}
                <div className="rp-piece rp-piece-question">
                    {/* Mostrar texto si gameConfigs[0].showText */}
                    {gameConfigs[0]?.showText && currentQuestion.question}
                </div>

                {/* Slot para la respuesta */}
                <div className={`rp-piece-slot ${selectedOption ? 'filled' : ''}`}>
                    {selectedOption ? (
                        <span style={{
                            fontSize: '18px', fontWeight: '700',
                            color: feedback === 'correct' ? 'var(--success)'
                                : feedback === 'incorrect' ? 'var(--error)'
                                    : 'var(--primary-orange)'
                        }}>
                            {gameConfigs[1]?.showText && selectedOption.answerText}
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
                        if (feedback && selectedOption?.answerText === option.answerText) {
                            extraClass = feedback === 'correct' ? 'correct' : 'incorrect';
                        } else if (feedback === 'incorrect' && option.isCorrect) {
                            extraClass = 'correct'; // Revelar la correcta cuando falla
                        }
                        const isSelected = selectedOption?.answerText === option.answerText;

                        return (
                            <button
                                key={idx}
                                className={`rp-option-piece ${isSelected && !feedback ? 'selected' : ''} ${extraClass}`}
                                onClick={() => handleSelectOption(option)}
                                disabled={!!feedback}
                            >
                                <span className="rp-option-text">
                                    {gameConfigs[1]?.showText && option.answerText}
                                </span>
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

            {/* ── Cronómetro (esquina superior derecha) ── */}
            <div style={{
                position: 'fixed', top: '14px', right: '70px',
                fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)',
                fontVariantNumeric: 'tabular-nums'
            }}>
                ⏱ {formatTime(elapsed)}
            </div>
        </div>
    );
};

export default RompecabezasGameView;
