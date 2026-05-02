// client/src/components/Games/MemoriaRapida/MemoriaRapidaGameView.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import MemoriaRapidaCard from './MemoriaRapidaCard';
import GameSummary from '../GamePanel/GameSummary';
import GameCard from '../GameCard/GameCard';
import IconSuccess from '../../../assets/svgs/success_game.svg';
import IconError from '../../../assets/svgs/error_cross.svg';
import '../../../styles/components/games/GameBase.css';

const GAME_DURATION = 60; // segundos
const BASE_SPEED = 3500;  // ms entre tarjetas
const MIN_SPEED = 1200;   // ms mínimo
const SPEED_DECREASE = 150;

const MemoriaRapidaGameView = ({ studentId = 'student_001' }) => {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const returnToMap = location.state?.returnToMap;
    
    const { currentGameData } = useGame();

    const [gameState, setGameState] = useState('loading'); // loading | countdown | playing | paused | completed
    const [error, setError] = useState(null);

    const [topWords, setTopWords] = useState([]);
    const [currentTopIndex, setCurrentTopIndex] = useState(0);
    const [bottomCardProps, setBottomCardProps] = useState(null);
    const [currentMatch, setCurrentMatch] = useState(false);

    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [speed, setSpeed] = useState(BASE_SPEED);
    const [feedback, setFeedback] = useState(null); // '✅' | '❌' | null
    const [cardKey, setCardKey] = useState(0); 
    const [countdown, setCountdown] = useState(3);
    const [responseLogs, setResponseLogs] = useState([]);
    const [startDate, setStartDate] = useState(null);

    const autoTimerRef = useRef(null);

    // Refs for timer closure
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

    // Initialize game
    useEffect(() => {
        if (!currentGameData) {
            setError('No hay datos de juego activos en el contexto.');
            setGameState('error');
            return;
        }

        if (currentGameData.words && currentGameData.words.length > 0) {
            const shuffledWords = [...currentGameData.words].sort(() => Math.random() - 0.5);
            setTopWords(shuffledWords);
            setCurrentTopIndex(0);
            setStartDate(new Date().toISOString());
            setGameState('countdown');
        } else {
            setError('La actividad no tiene palabras.');
            setGameState('error');
        }
    }, [currentGameData]);

    // Countdown 3..2..1
    useEffect(() => {
        if (gameState !== 'countdown') return;
        if (countdown <= 0) {
            setGameState('playing');
            generateNextCard(0);
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
                    setTimeout(() => handleGameOverFromTimer(), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    // Auto-skip card
    useEffect(() => {
        if (gameState !== 'playing' || !bottomCardProps) return;
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = setTimeout(() => {
            processAnswer(false);
        }, speed);
        return () => clearTimeout(autoTimerRef.current);
    }, [bottomCardProps, gameState, speed]);

    const buildCardProps = (word, cfg) => {
        return {
            text: cfg.showText ? (cfg.isMazahua ? word.mazahuaWord : word.spanishWord) : null,
            imageUrl: cfg.showImage ? word.imageUrl : null,
            audioUrl: cfg.playAudio ? word.audioUrl : null,
        };
    };

    const generateNextCard = useCallback((topIndex) => {
        if (topIndex >= topWords.length) {
            // No more words -> end game
            setTimeout(() => handleGameOverFromTimer(), 0);
            return;
        }

        const topWord = topWords[topIndex];
        const shouldMatch = Math.random() < 0.7; // 70% match probability

        let bottomWord;
        if (shouldMatch || topWords.length === 1) {
            bottomWord = topWord;
            setCurrentMatch(true);
        } else {
            let otherWord;
            do {
                otherWord = topWords[Math.floor(Math.random() * topWords.length)];
            } while (otherWord.id === topWord.id);
            bottomWord = otherWord;
            setCurrentMatch(false);
        }

        const configs = currentGameData?.gameConfigs || [];
        const cfg1 = configs[1] || { showText: false, showImage: true, playAudio: false, isMazahua: false };

        setBottomCardProps(buildCardProps(bottomWord, cfg1));
        setCardKey(prev => prev + 1);
    }, [topWords, currentGameData]);

    const processAnswer = useCallback((userSaysMatch) => {
        if (gameStateRef.current !== 'playing') return;

        clearTimeout(autoTimerRef.current);
        const isCorrect = userSaysMatch === currentMatch;
        const currentTopWord = topWords[currentTopIndex];
        
        setResponseLogs(prev => [...prev, { 
            questionId: null, 
            answerId: currentTopWord.id, 
            isCorrect,
            wordText: currentTopWord.mazahuaWord || currentTopWord.spanishWord
        }]);

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
            setFeedback('correct');
        } else {
            setCombo(0);
            setFeedback('incorrect');
        }

        setTimeout(() => setFeedback(null), 400);

        const nextIndex = currentTopIndex + 1;
        setCurrentTopIndex(nextIndex);
        setTimeout(() => generateNextCard(nextIndex), 350);
    }, [currentTopIndex, currentMatch, combo, topWords, generateNextCard]);

    const handleSwipe = useCallback((direction) => {
        processAnswer(direction === 'right');
    }, [processAnswer]);

    const handleCorrectBtn = () => processAnswer(true);
    const handleIncorrectBtn = () => processAnswer(false);

    const handleGameOverFromTimer = () => {
        if (gameStateRef.current === 'completed') return;
        setGameState('completed');
        clearTimeout(autoTimerRef.current);
    };

    const togglePause = () => {
        setGameState(prev => prev === 'paused' ? 'playing' : 'paused');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (gameState === 'error') {
        return (
            <div className="game-error-container">
                <div className="error-box">
                    <h2><img src={IconError} alt="Error" className="inline w-8 h-8 align-middle mr-2" />Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-secondary" onClick={() => window.history.back()}>
                        Volver Atrás
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'loading') {
        return (
            <div className="game-loading-container">
                <div className="spinner" />
                <p>Cargando actividad...</p>
            </div>
        );
    }

    if (gameState === 'completed') {
        const urlParams = new URLSearchParams(window.location.search);
        const gameIdParam = urlParams.get('gameId');

        return <GameSummary
                activityId={activityId}
                gameId={gameIdParam || 4}
                startDate={startDate}
                correctAnswers={correctCount}
                totalQuestions={totalCards}
                responseLogs={responseLogs}
                onExit={() => returnToMap ? navigate('/estudiante/mapa') : navigate('/estudiante/actividades')}
                onRetry={initGame}
            />
    }

    if (gameState === 'countdown') {
        return (
            <div className="game-container" style={{ justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '1rem' }}>
                        Memoria Rápida
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
            <div className="game-container" style={{ justifyContent: 'center' }}>
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

    const configs = currentGameData?.gameConfigs || [];
    const cfg0 = configs[0] || { showText: true, showImage: false, playAudio: false, isMazahua: true };
    const currentTopWord = topWords[currentTopIndex];
    const topCardProps = currentTopWord ? buildCardProps(currentTopWord, cfg0) : {};

    return (
        <div className="game-container">
            {/* Top Bar */}
            <div className="game-top-bar">
                <button className="game-top-bar__back-btn" onClick={togglePause}>⏸</button>

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

            {/* Top Card / Word Display */}
            <div className="mr-word-display" style={{ padding: '0', background: 'transparent', boxShadow: 'none' }}>
                {currentTopWord && (
                    <div style={{ maxWidth: '250px', margin: '0 auto', transform: 'scale(0.85)' }}>
                        <GameCard {...topCardProps} disabled={true} />
                    </div>
                )}
            </div>

            {/* Swipeable Card */}
            <div className="mr-card-area">
                {bottomCardProps && (
                    <MemoriaRapidaCard
                        key={cardKey}
                        cardProps={bottomCardProps}
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
                <div className="mr-feedback-flash">
                    {feedback === 'correct' ? <img src={IconSuccess} alt="Correcto" className="w-24 h-24" /> : <img src={IconError} alt="Incorrecto" className="w-24 h-24" />}
                </div>
            )}
        </div>
    );
};

export default MemoriaRapidaGameView;