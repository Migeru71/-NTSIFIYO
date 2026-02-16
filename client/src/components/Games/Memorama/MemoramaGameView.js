// client/src/components/Games/Memorama/MemoramaGameView.js
import React, { useState, useEffect } from 'react';
import ActivityService from '../../../services/ActivityService';
import ExperienceService from '../../../services/ExperienceService';
import GameCard from './GameCard';
import ResultadoJuegoView from './ResultadoJuegoView';
import './Memorama.css';
import { useParams } from 'react-router-dom';

const MemoramaGameView = ({ studentId = 'student_001' }) => {
    const { activityId } = useParams();

    const [activity, setActivity] = useState(null);
    const [gameState, setGameState] = useState('loading');

    console.log("ID recuperado de la URL:", activityId);

    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState(new Set());
    const [matched, setMatched] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(300);
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(null);
    const [gameResult, setGameResult] = useState(null);

    useEffect(() => {
        const loadActivity = async () => {
            const idToSearch = parseInt(activityId);
            const response = await ActivityService.getActivityForPlay(idToSearch);

            if (!response.success) {
                setError(response.error);
                setGameState('error');
            } else {
                setActivity(response.activity);
                initializeGame(response.activity);
                setGameState('playing');
            }
        };

        if (activityId) {
            loadActivity();
        }
    }, [activityId]);

    const initializeGame = (activity) => {
        const cardPairs = activity.pairs.map((pair, index) => [
            { id: `image-${index}`, type: 'image', content: pair.image, pairId: index, label: pair.spanish },
            { id: `word-${index}`, type: 'word', content: pair.mazahua, pairId: index, label: pair.mazahua }
        ]);

        const allCards = cardPairs.flat();
        const shuffled = allCards.sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlipped(new Set());
        setMatched(new Set());
        setTimeLeft(300);
        setAttempts(0);
    };

    useEffect(() => {
        if (gameState !== 'playing') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleGameOver(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    const handleCardClick = (cardId) => {
        if (flipped.has(cardId) || matched.has(cardId)) return;

        const newFlipped = new Set(flipped);
        newFlipped.add(cardId);
        setFlipped(newFlipped);

        if (newFlipped.size === 2) {
            checkMatch(newFlipped);
        }
    };

    const checkMatch = (flippedCards) => {
        const flippedArray = Array.from(flippedCards);
        const [card1, card2] = flippedArray.map(id => cards.find(c => c.id === id));

        const isMatch = card1.pairId === card2.pairId;
        setAttempts(prev => prev + 1);

        setTimeout(() => {
            if (isMatch) {
                const newMatched = new Set(matched);
                newMatched.add(card1.id);
                newMatched.add(card2.id);
                setMatched(newMatched);
                setFlipped(new Set());

                if (newMatched.size === cards.length) handleGameOver(true);
            } else {
                setFlipped(new Set());
            }
        }, 1000);
    };

    const handleGameOver = async (won) => {
        setGameState('completed');

        const gameStats = {
            totalTime: 300 - timeLeft,
            totalAttempts: attempts,
            correctMatches: matched.size / 2,
            totalPairs: cards.length / 2,
            won
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

    return (
        <div className="memorama-game-container">
            <div className="game-header">
                <h1>{activity.name}</h1>
                <div className="game-info">
                    <div className="info-item">
                        <span className="label">Tiempo:</span>
                        <span className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>{formatTime(timeLeft)}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Intentos:</span>
                        <span className="attempts">{attempts}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Parejas:</span>
                        <span className="progress">{`${matched.size / 2} / ${cards.length / 2}`}</span>
                    </div>
                </div>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(matched.size / cards.length) * 100}%` }}
                    />
                </div>
            </div>
            <div className="game-board">
                {cards.map(card => (
                    <GameCard
                        key={card.id}
                        card={card}
                        isFlipped={flipped.has(card.id)}
                        isMatched={matched.has(card.id)}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
            <div className="game-instructions">
                <p>{`🎮 Empareja las imágenes con sus palabras en Mazahua. Tienes ${formatTime(timeLeft)} y ${attempts} intentos.`}</p>
            </div>
        </div>
    );
};

export default MemoramaGameView;