// client/src/components/Games/Intruso/IntrusoGameView.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import IntrusoFinalView from './IntrusoFinalView';
import './Intruso.css';

const GAME_DURATION = 45; // 45 seconds

const IntrusoGameView = () => {
    const navigate = useNavigate();
    const { currentGameData } = useGame();

    const [activity, setActivity] = useState(null);
    const [gameConfigs, setGameConfigs] = useState([{}, {}]);
    const [loading, setLoading] = useState(true);
    const [gameState, setGameState] = useState('loading');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [feedback, setFeedback] = useState(null);

    const [correctCount, setCorrectCount] = useState(0);
    const [combo, setCombo] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        setLoading(true);

        if (!currentGameData) {
            console.error("No hay datos de juego activos en el contexto.");
            setLoading(false);
            return;
        }

        // Read gameConfigs
        if (currentGameData.gameConfigs && currentGameData.gameConfigs.length >= 2) {
            const sorted = [...currentGameData.gameConfigs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setGameConfigs(sorted);
        }

        if (currentGameData.questions && currentGameData.questions.length > 0) {
            // Shuffle responseList for each question so options appear in random order
            const shuffled = {
                ...currentGameData,
                questions: currentGameData.questions.map(q => ({
                    ...q,
                    responseList: [...(q.responseList || [])].sort(() => Math.random() - 0.5)
                }))
            };
            setActivity(shuffled);
            setGameState('playing');
        } else {
            console.error("La actividad de Intruso no tiene preguntas.");
        }
        setLoading(false);
    }, [currentGameData]);

    // Timer Logic
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setGameState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, timeLeft]);

    // Helper: get display text based on config
    const getWordText = (word, config) => {
        if (!word) return null;
        return config.isMazahua ? word.mazahuaWord : word.spanishWord;
    };

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => { });
        }
    };

    const handleAnswer = (answer) => {
        if (feedback) return;

        const isCorrect = answer.isCorrect;

        if (isCorrect) {
            const points = 100 + (combo * 10);
            setScore(prev => prev + points);
            setCorrectCount(prev => prev + 1);
            setCombo(prev => prev + 1);
            setFeedback({ type: 'correct', message: '¡Bien hecho!' });
        } else {
            setCombo(0);
            setFeedback({ type: 'incorrect', message: 'Ese si pertenece al grupo...' });
        }

        setTimeout(() => {
            setFeedback(null);
            if (activity.questions && currentQuestionIndex < activity.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // All questions answered — finish the game
                clearInterval(timerRef.current);
                setGameState('finished');
            }
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="intruso-container"><div className="spinner"></div></div>;

    if (gameState === 'finished') {
        return <IntrusoFinalView
            score={score}
            stats={{
                correct: correctCount,
                time: GAME_DURATION - timeLeft,
                totalQuestions: correctCount + (score > 0 ? 0 : 1)
            }}
            onRetry={() => window.location.reload()}
            onExit={() => navigate('/estudiante/actividades')}
        />;
    }

    if (!activity || !activity.questions) return <div>Error: Actividad inválida</div>;

    const currentQuestion = activity.questions[currentQuestionIndex];
    const config1 = gameConfigs[0] || {};
    const config2 = gameConfigs[1] || {};

    return (
        <div className="intruso-container">
            {/* Top Bar */}
            <div className="intruso-top-bar">
                <button className="intruso-pause-btn" onClick={() => navigate(-1)}>
                    ⏸
                </button>
                <div className="intruso-score-badge">
                    <span>⭐</span> {score}
                </div>
            </div>

            {/* Timer */}
            <div className="intruso-timer-container">
                <div className="intruso-timer-labels">
                    <span>Tiempo Restante</span>
                    <span>{formatTime(timeLeft)}</span>
                </div>
                <div className="intruso-timer-bar-bg">
                    <div
                        className="intruso-timer-fill"
                        style={{
                            width: `${(timeLeft / GAME_DURATION) * 100}%`,
                            background: timeLeft < 10 ? '#EF4444' : '#E65100'
                        }}
                    />
                </div>
            </div>

            {/* Question header — config1 */}
            <div className="intruso-question-header animate-pop" key={`header-${currentQuestionIndex}`}>
                <div className="intruso-category-pill">
                    🔍 Encuentra al Intruso
                </div>

                {config1.showImage && currentQuestion.word?.imageUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <img src={currentQuestion.word.imageUrl} alt="Pregunta"
                            style={{ maxWidth: '120px', maxHeight: '90px', borderRadius: '12px', objectFit: 'cover' }} />
                    </div>
                )}

                {config1.playAudio && currentQuestion.word?.audioUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <button onClick={() => playAudio(currentQuestion.word.audioUrl)}
                            style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>🔊</button>
                    </div>
                )}

                {config1.showText && (
                    <h2 className="intruso-title">
                        {currentQuestion.question}
                    </h2>
                )}
            </div>

            {/* Grid — config2 */}
            <div className="intruso-grid">
                {currentQuestion.responseList.map((option, idx) => (
                    <div
                        key={idx}
                        className={`intruso-option-card animate-pop 
                            ${feedback && option.isCorrect && feedback.type === 'correct' ? 'correct' : ''}
                            ${feedback && !option.isCorrect && feedback.type === 'incorrect' ? 'incorrect' : ''} 
                        `}
                        onClick={() => handleAnswer(option)}
                        style={{ animationDelay: `${idx * 0.1}s`, pointerEvents: feedback ? 'none' : 'auto' }}
                    >
                        {config2.showImage && option.word?.imageUrl ? (
                            <div className="intruso-option-icon">
                                <img src={option.word.imageUrl} alt=""
                                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div className="intruso-option-icon">❔</div>
                        )}

                        {config2.showText && (
                            <span className="intruso-option-text">
                                {config2.isMazahua && option.word
                                    ? option.word.mazahuaWord
                                    : (option.answerText || (option.word ? option.word.spanishWord : ''))}
                            </span>
                        )}

                        {config2.playAudio && option.word?.audioUrl && (
                            <button
                                onClick={(e) => { e.stopPropagation(); playAudio(option.word.audioUrl); }}
                                style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}
                            >🔊</button>
                        )}
                    </div>
                ))}
            </div>

            {/* Feedback Overlay */}
            {feedback && (
                <div className="intruso-feedback">
                    <div className={`intruso-instruction-pill ${feedback.type === 'correct' ? 'success' : 'error'}`}
                        style={{ color: feedback.type === 'correct' ? '#10B981' : '#EF4444', fontSize: '24px', padding: '1rem 3rem' }}>
                        {feedback.type === 'correct' ? 'Correcto! 🎉' : 'Ops... ❌'}
                    </div>
                </div>
            )}

        </div>
    );
};

export default IntrusoGameView;
