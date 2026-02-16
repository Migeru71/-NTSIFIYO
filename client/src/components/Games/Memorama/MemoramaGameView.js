// client/src/components/Games/Memorama/MemoramaGameView.js
// Memoria Rápida — Juego de deslizar tarjetas (word ↔ image match)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ActivityService from '../../../services/ActivityService';
import ExperienceService from '../../../services/ExperienceService';
import GameCard from './GameCard';
import ResultadoJuegoView from './ResultadoJuegoView';
import './Memorama.css';
import { useParams } from 'react-router-dom';

const GAME_DURATION = 60; // segundos
const BASE_SPEED = 3500;  // ms entre tarjetas (nivel 1)
const MIN_SPEED = 1200;   // ms mínimo
const SPEED_DECREASE = 150; // ms que se resta por tarjeta correcta

const MemoramaGameView = ({ studentId = 'student_001' }) => {
    const { activityId } = useParams();

    const [activity, setActivity] = useState(null);
    const [gameState, setGameState] = useState('loading'); // loading | countdown | playing | paused | completed
    const [error, setError] = useState(null);

    // Game state
    const [currentCard, setCurrentCard] = useState(null); // { word, image, matches }
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [speed, setSpeed] = useState(BASE_SPEED);
    const [feedback, setFeedback] = useState(null); // '✅' | '❌' | null
    const [cardKey, setCardKey] = useState(0); // force re-mount
    const [gameResult, setGameResult] = useState(null);
    const [countdown, setCountdown] = useState(3);

    const pairsRef = useRef([]);
    const autoTimerRef = useRef(null);

    // Refs that mirror state — so timer closure can read current values
    const scoreRef = useRef(0);
    const correctRef = useRef(0);
    const totalRef = useRef(0);
    const maxComboRef = useRef(0);
    const gameStateRef = useRef('loading');

    // Keep refs in sync with state
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { correctRef.current = correctCount; }, [correctCount]);
    useEffect(() => { totalRef.current = totalCards; }, [totalCards]);
    useEffect(() => { maxComboRef.current = maxCombo; }, [maxCombo]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

    // Load activity
    useEffect(() => {
        const loadActivity = async () => {
            const idToSearch = parseInt(activityId);
            const response = await ActivityService.getActivityForPlay(idToSearch);

            if (!response.success) {
                setError(response.error);
                setGameState('error');
            } else {
                setActivity(response.activity);
                pairsRef.current = response.activity.pairs;
                setGameState('countdown');
            }
        };

        if (activityId) loadActivity();
    }, [activityId]);

    // Countdown 3..2..1
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
                    // Use setTimeout to avoid setState-inside-setState issues
                    setTimeout(() => handleGameOverFromTimer(), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    // Auto-skip card if user doesn't respond in time
    useEffect(() => {
        if (gameState !== 'playing' || !currentCard) return;
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = setTimeout(() => {
            // Auto-skip as wrong
            processAnswer(false);
        }, speed);
        return () => clearTimeout(autoTimerRef.current);
    }, [currentCard, gameState, speed]);

    // Generate a random card (50% match, 50% mismatch)
    const generateNextCard = useCallback(() => {
        const pairs = pairsRef.current;
        if (!pairs || pairs.length === 0) return;

        const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
        const shouldMatch = Math.random() < 0.5;

        let displayWord, displayImage, matches;

        if (shouldMatch) {
            displayWord = randomPair.mazahua;
            displayImage = randomPair.image;
            matches = true;
        } else {
            // Pick a different pair's image
            let otherPair;
            do {
                otherPair = pairs[Math.floor(Math.random() * pairs.length)];
            } while (otherPair.id === randomPair.id && pairs.length > 1);

            displayWord = randomPair.mazahua;
            displayImage = otherPair.image;
            matches = false;
        }

        setCurrentCard({ word: displayWord, image: displayImage, matches });
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
        } else {
            setCombo(0);
            setFeedback('❌');
        }

        // Clear feedback after flash
        setTimeout(() => setFeedback(null), 400);

        // Generate next card after brief delay
        setTimeout(() => generateNextCard(), 350);
    }, [currentCard, combo, generateNextCard]);

    // Handle swipe from GameCard
    const handleSwipe = useCallback((direction) => {
        processAnswer(direction === 'right');
    }, [processAnswer]);

    // Handle button clicks
    const handleCorrectBtn = () => processAnswer(true);
    const handleIncorrectBtn = () => processAnswer(false);

    // Game over — called from timer, reads refs for current values
    const handleGameOverFromTimer = async () => {
        if (gameStateRef.current === 'completed') return; // guard against double-call
        setGameState('completed');
        clearTimeout(autoTimerRef.current);

        const gameStats = {
            totalTime: GAME_DURATION,
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
            await ActivityService.saveGameResult({
                activityId: parseInt(activityId),
                studentId,
                ...result.result
            });
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

    // Countdown screen
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

    // Paused overlay
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

    // PLAYING state
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

            {/* Timer */}
            <div className="mr-timer-row">
                <div className="mr-timer-dot" />
                <span className="mr-timer-text">{formatTime(timeLeft)}</span>
                <div className="mr-timer-bar">
                    <div
                        className="mr-timer-fill"
                        style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                    />
                </div>
            </div>

            {/* Word Display */}
            <div className="mr-word-display">
                <button className="mr-audio-btn" title="Escuchar pronunciación">
                    🔊
                </button>
                <span className="mr-word-text">
                    {currentCard ? currentCard.word : '...'}
                </span>
            </div>

            {/* Swipeable Card */}
            <div className="mr-card-area">
                {currentCard && (
                    <GameCard
                        key={cardKey}
                        image={currentCard.image}
                        onSwipe={handleSwipe}
                        disabled={gameState !== 'playing'}
                    />
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