// client/src/components/Games/Memorama/MemoramaGameView.js
// Memoria Rápida — Juego de deslizar tarjetas (word ↔ image match)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import ExperienceService from '../../../services/ExperienceService';
import GameCard from './GameCard';
import ResultadoJuegoView from './ResultadoJuegoView';
import './Memorama.css';

// ─── CONFIGURACIÓN DEL JUEGO (modificar aquí) ──────────────────────────────
const GAME_DURATION = 120;     // segundos de tiempo límite
const BASE_SPEED = 9000;       // ms entre tarjetas en nivel 1
const MIN_SPEED = 1200;        // ms mínimo (velocidad máxima)
const SPEED_DECREASE = 150;    // ms que se resta por respuesta correcta
const COUNTDOWN_SECONDS = 3;   // cuenta regresiva inicial
const MATCH_PROBABILITY = 0.5; // probabilidad de mostrar un par correcto
// ────────────────────────────────────────────────────────────────────────────

const MemoramaGameView = ({ studentId = 'student_001' }) => {
    const { activityId } = useParams();
    const { currentGameData } = useGame();

    const [activity, setActivity] = useState(null);
    const [gameConfigs, setGameConfigs] = useState([{}, {}]);
    const [gameState, setGameState] = useState('loading');
    const [error, setError] = useState(null);

    // Game state
    const [currentCard, setCurrentCard] = useState(null);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [speed, setSpeed] = useState(BASE_SPEED);
    const [feedback, setFeedback] = useState(null);
    const [cardKey, setCardKey] = useState(0);
    const [gameResult, setGameResult] = useState(null);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

    // Pair tracking: which pairs have been correctly matched
    const [matchedPairIds, setMatchedPairIds] = useState(new Set());
    const [totalPairs, setTotalPairs] = useState(0);

    const pairsRef = useRef([]);
    const autoTimerRef = useRef(null);

    const scoreRef = useRef(0);
    const correctRef = useRef(0);
    const totalRef = useRef(0);
    const maxComboRef = useRef(0);
    const gameStateRef = useRef('loading');

    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { correctRef.current = correctCount; }, [correctCount]);
    useEffect(() => { totalRef.current = totalCards; }, [totalCards]);
    useEffect(() => { maxComboRef.current = maxCombo; }, [maxCombo]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

    // Load activity from GameContext
    useEffect(() => {
        if (!currentGameData) {
            setError("No hay datos de la actividad. Regresa al panel para iniciar.");
            setGameState('error');
            return;
        }

        // Store gameConfigs sorted by order
        if (currentGameData.gameConfigs && currentGameData.gameConfigs.length >= 2) {
            const sorted = [...currentGameData.gameConfigs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setGameConfigs(sorted);
        }

        // Map words into pairs with full word data
        const mappedPairs = (currentGameData.words || []).map((w, i) => ({
            id: w.id || i,
            mazahuaWord: w.mazahuaWord || '',
            spanishWord: w.spanishWord || '',
            imageUrl: w.imageUrl || '',
            audioUrl: w.audioUrl || ''
        }));

        if (mappedPairs.length === 0) {
            setError("La actividad no tiene palabras configuradas.");
            setGameState('error');
            return;
        }

        setActivity({ name: "Memoria Rápida", recommendedXP: 100 });
        pairsRef.current = mappedPairs;
        setTotalPairs(mappedPairs.length);
        setGameState('countdown');
    }, [currentGameData]);

    // Countdown
    useEffect(() => {
        if (gameState !== 'countdown') return;
        if (countdown <= 0) {
            setGameState('playing');
            generateNextCard();
            return;
        }
        const t = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [gameState, countdown]);

    // Main timer
    useEffect(() => {
        if (gameState !== 'playing') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setTimeout(() => handleGameOver(), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    // Auto-skip card
    useEffect(() => {
        if (gameState !== 'playing' || !currentCard) return;
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = setTimeout(() => {
            processAnswer(false);
        }, speed);
        return () => clearTimeout(autoTimerRef.current);
    }, [currentCard, gameState, speed]);

    // Helper: get display text based on config
    const getWordText = (word, config) => {
        if (!config.showText) return null;
        return config.isMazahua ? word.mazahuaWord : word.spanishWord;
    };

    // Helper: play audio
    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => { });
        }
    };

    // Generate the next card using pairs logic
    const generateNextCard = useCallback(() => {
        const pairs = pairsRef.current;
        if (!pairs || pairs.length === 0) return;

        // Pick a random pair as the stimulus (top display)
        const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
        const shouldMatch = Math.random() < MATCH_PROBABILITY;

        let stimulusWord, responseWord, matches;

        if (shouldMatch) {
            // Show matching pair
            stimulusWord = randomPair;
            responseWord = randomPair;
            matches = true;
        } else {
            // Show mismatched pair
            let otherPair;
            do {
                otherPair = pairs[Math.floor(Math.random() * pairs.length)];
            } while (otherPair.id === randomPair.id && pairs.length > 1);

            stimulusWord = randomPair;
            responseWord = otherPair;
            matches = false;
        }

        setCurrentCard({ stimulusWord, responseWord, matches, pairId: randomPair.id });
        setCardKey(prev => prev + 1);
    }, []);

    const processAnswer = useCallback((userSaysMatch) => {
        if (!currentCard || gameStateRef.current !== 'playing') return;

        clearTimeout(autoTimerRef.current);
        const isCorrect = userSaysMatch === currentCard.matches;

        setTotalCards(prev => prev + 1);

        if (isCorrect) {
            const comboMultiplier = Math.min(1 + combo * 0.1, 3);
            const pointsEarned = Math.round(100 * comboMultiplier);
            setScore(prev => prev + pointsEarned);
            setCombo(prev => {
                const newCombo = prev + 1;
                setMaxCombo(mc => Math.max(mc, newCombo));
                return newCombo;
            });
            setCorrectCount(prev => prev + 1);
            setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_DECREASE));
            setFeedback('✅');

            // If user correctly identified a match, mark this pair as done
            if (currentCard.matches) {
                setMatchedPairIds(prev => {
                    const updated = new Set(prev);
                    updated.add(currentCard.pairId);
                    return updated;
                });
            }
        } else {
            setCombo(0);
            setFeedback('❌');
        }

        setTimeout(() => setFeedback(null), 400);
        setTimeout(() => generateNextCard(), 350);
    }, [currentCard, combo, generateNextCard]);

    // Check if all pairs have been matched → end game
    useEffect(() => {
        if (gameState === 'playing' && totalPairs > 0 && matchedPairIds.size >= totalPairs) {
            setTimeout(() => handleGameOver(), 500);
        }
    }, [matchedPairIds, totalPairs, gameState]);

    const handleSwipe = useCallback((direction) => {
        processAnswer(direction === 'right');
    }, [processAnswer]);

    const handleCorrectBtn = () => processAnswer(true);
    const handleIncorrectBtn = () => processAnswer(false);

    const handleGameOver = async () => {
        if (gameStateRef.current === 'completed') return;
        setGameState('completed');
        clearTimeout(autoTimerRef.current);

        const gameStats = {
            totalTime: GAME_DURATION - timeLeft,
            correctCards: correctRef.current,
            totalCards: totalRef.current,
            maxCombo: maxComboRef.current,
            score: scoreRef.current,
            won: correctRef.current > totalRef.current * 0.5
        };

        const result = await ExperienceService.processGameCompletion({
            activityId: parseInt(activityId),
            studentId,
            recommendedXP: activity.recommendedXP,
            gameStats
        });

        if (result.success) {
            setGameResult(result.result);
        } else {
            setError(result.error);
        }
    };

    const togglePause = () => {
        setGameState(prev => prev === 'paused' ? 'playing' : 'paused');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- RENDERIZADO ---

    if (gameState === 'error') {
        return (
            <div className="game-error-container">
                <div className="error-box">
                    <h2>❌ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-secondary" onClick={() => window.history.back()}>
                        Volver Atrás
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'loading' || !activity) {
        return (
            <div className="game-loading-container">
                <div className="spinner" />
                <p>Cargando actividad...</p>
            </div>
        );
    }

    if (gameState === 'completed' && gameResult) {
        return <ResultadoJuegoView result={gameResult} activity={activity} />;
    }

    if (gameState === 'countdown') {
        return (
            <div className="memoria-rapida-container" style={{ justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '1rem' }}>
                        {activity.name}
                    </p>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 1.5rem',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        animation: 'comboPop 0.5s ease'
                    }}>
                        <span style={{ fontSize: '56px', fontWeight: '800', color: '#1e293b' }}>
                            {countdown || '🚀'}
                        </span>
                    </div>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#374151' }}>
                        ¡Prepárate!
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '0.5rem' }}>
                        Desliza ➡️ si coincide, ⬅️ si no
                    </p>
                </div>
            </div>
        );
    }

    if (gameState === 'paused') {
        return (
            <div className="memoria-rapida-container" style={{ justifyContent: 'center' }}>
                <div style={{
                    background: 'white', borderRadius: '24px', padding: '2.5rem',
                    textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    maxWidth: '360px', width: '100%'
                }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>⏸️</span>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Juego Pausado
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        Puntaje actual: <strong>{score.toLocaleString()}</strong>
                    </p>
                    <button
                        onClick={togglePause}
                        style={{
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white', border: 'none', borderRadius: '14px',
                            padding: '14px 2rem', fontSize: '16px', fontWeight: '700',
                            cursor: 'pointer', width: '100%', marginBottom: '0.75rem'
                        }}
                    >
                        ▶️ Continuar
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            background: 'transparent', color: '#ef4444', border: '2px solid #ef4444',
                            borderRadius: '14px', padding: '12px 2rem', fontSize: '14px',
                            fontWeight: '700', cursor: 'pointer', width: '100%'
                        }}
                    >
                        Salir del Juego
                    </button>
                </div>
            </div>
        );
    }

    // PLAYING state — config1 = stimulus (word display top), config2 = response (card bottom)
    const config1 = gameConfigs[0] || {};
    const config2 = gameConfigs[1] || {};

    return (
        <div className="memoria-rapida-container">
            {/* Top Bar */}
            <div className="mr-top-bar">
                <button className="mr-pause-btn" onClick={togglePause}>⏸</button>

                {combo >= 2 && (
                    <div className="mr-combo-badge">
                        {combo}x COMBO
                    </div>
                )}

                <div className="mr-score-area">
                    <div className="mr-score-label">Puntaje</div>
                    <div className="mr-score-value">{score.toLocaleString()}</div>
                </div>
            </div>

            {/* Timer + Progress */}
            <div className="mr-timer-row">
                <div className="mr-timer-dot" />
                <span className="mr-timer-text">{formatTime(timeLeft)}</span>
                <div className="mr-timer-bar">
                    <div
                        className="mr-timer-fill"
                        style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                    />
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px', whiteSpace: 'nowrap' }}>
                    {matchedPairIds.size}/{totalPairs}
                </span>
            </div>

            {/* Stimulus Display (config1) — top area showing the word/image/audio */}
            <div className="mr-word-display">
                {config1.playAudio && currentCard?.stimulusWord?.audioUrl && (
                    <button className="mr-audio-btn" title="Escuchar pronunciación"
                        onClick={() => playAudio(currentCard.stimulusWord.audioUrl)}>
                        🔊
                    </button>
                )}
                {config1.showText && currentCard && (
                    <span className="mr-word-text">
                        {getWordText(currentCard.stimulusWord, config1) || '...'}
                    </span>
                )}
                {config1.showImage && currentCard?.stimulusWord?.imageUrl && (
                    <img
                        src={currentCard.stimulusWord.imageUrl}
                        alt="Estímulo"
                        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', marginLeft: '12px' }}
                    />
                )}
            </div>

            {/* Response Card (config2) — swipeable area */}
            <div className="mr-card-area">
                {currentCard && (
                    <>
                        {config2.showImage && currentCard.responseWord.imageUrl ? (
                            <GameCard
                                key={cardKey}
                                image={currentCard.responseWord.imageUrl}
                                onSwipe={handleSwipe}
                                disabled={gameState !== 'playing'}
                            />
                        ) : (
                            <div
                                key={cardKey}
                                className="mr-swipe-card mr-card-enter"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'column', gap: '12px', minHeight: '200px',
                                    background: 'white', borderRadius: '20px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '2rem'
                                }}
                            >
                                {config2.showText && (
                                    <span style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>
                                        {getWordText(currentCard.responseWord, config2)}
                                    </span>
                                )}
                                {config2.playAudio && currentCard.responseWord.audioUrl && (
                                    <button
                                        onClick={() => playAudio(currentCard.responseWord.audioUrl)}
                                        style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >🔊</button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Speed indicator */}
                <div className="mr-speed-indicator">
                    ⚡ {Math.round((1 - (speed - MIN_SPEED) / (BASE_SPEED - MIN_SPEED)) * 100)}%
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mr-action-buttons">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button className="mr-btn-incorrect" onClick={handleIncorrectBtn}>
                        ✕
                    </button>
                    <span className="mr-btn-label incorrect">Incorrecto</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button className="mr-btn-correct" onClick={handleCorrectBtn}>
                        ✓
                    </button>
                    <span className="mr-btn-label correct">Correcto</span>
                </div>
            </div>

            {/* Mode label */}
            <div className="mr-mode-label">Modo Ritmo Rápido</div>

            {/* Feedback Flash */}
            {feedback && (
                <div className="mr-feedback-flash">{feedback}</div>
            )}
        </div>
    );
};

export default MemoramaGameView;