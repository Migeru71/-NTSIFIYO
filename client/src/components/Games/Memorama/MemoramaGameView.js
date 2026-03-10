// client/src/components/Games/Memorama/MemoramaGameView.js
// Fase 2 — Juego: Tablero de cartas para emparejar (Memorama clásico)
// POST /api/activities/start/game/{gameId} → wordIds + gameConfigs → construir pares de cartas
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemoramaService from '../../../services/MemoramaService';
import mockMemorama, { mockWordDictionary } from '../../../data/mockMemorama';
import MemoramaFinalView from './MemoramaFinalView';
import './Memorama.css';

// Construir cartas a partir de wordIds y gameConfigs
function buildCards(wordIds, gameConfigs, wordDict) {
    const cfg0 = gameConfigs[0] || { showText: true, showImage: false, isMazahua: true };
    const cfg1 = gameConfigs[1] || { showText: true, showImage: false, isMazahua: false };

    const cards = [];
    wordIds.forEach((wordId) => {
        const word = wordDict[wordId] || {
            id: wordId, mazahua: `Palabra ${wordId}`, spanish: `Word ${wordId}`, emoji: '❓'
        };

        // Carta A — lado Mazahua / texto principal (cfg0)
        cards.push({
            uid: `${wordId}-A`,
            wordId,
            type: 'A',
            showText: cfg0.showText,
            showImage: cfg0.showImage,
            isMazahua: cfg0.isMazahua,
            text: cfg0.isMazahua ? word.mazahua : word.spanish,
            emoji: cfg0.showImage ? word.emoji : null,
        });

        // Carta B — lado Español / imagen (cfg1)
        cards.push({
            uid: `${wordId}-B`,
            wordId,
            type: 'B',
            showText: cfg1.showText,
            showImage: cfg1.showImage,
            isMazahua: cfg1.isMazahua,
            text: cfg1.isMazahua ? word.mazahua : word.spanish,
            emoji: cfg1.showImage ? word.emoji : null,
        });
    });

    // Barajar
    return cards.sort(() => Math.random() - 0.5);
}

const MemoramaGameView = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [activityTitle, setActivityTitle] = useState('Memorama');
    const [activityXP, setActivityXP] = useState(100);

    // Estado del tablero
    const [cards, setCards] = useState([]);
    const [flippedUids, setFlippedUids] = useState([]); // máx 2 uids seleccionados
    const [matchedWordIds, setMatchedWordIds] = useState(new Set());
    const [wrongUids, setWrongUids] = useState([]);     // animación de error
    const [lockBoard, setLockBoard] = useState(false);  // bloquear clics durante verificación
    const [attempts, setAttempts] = useState(0);        // cuántos pares se intentaron
    const [feedback, setFeedback] = useState(null);     // 'correct' | 'incorrect' | null

    const [gameState, setGameState] = useState('loading'); // loading | playing | finished | error
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef(null);
    const feedbackTimeout = useRef(null);

    const totalPairs = cards.length / 2;

    // ─── Cargar juego ────────────────────────────────────────────────────────
    useEffect(() => {
        initGame();
        return () => {
            clearInterval(timerRef.current);
            clearTimeout(feedbackTimeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityId]);

    async function initGame() {
        setLoading(true);
        setLoadError(null);

        const gameId = parseInt(activityId);
        const result = await MemoramaService.startGame(gameId);

        if (result.success && result.data?.wordIds?.length) {
            loadFromApiData(result.data);
        } else {
            const fallback = mockMemorama.find(a => a.id === gameId) || mockMemorama[0];
            if (fallback) {
                loadFromMockData(fallback);
            } else {
                setLoadError('No se encontró la actividad.');
                setGameState('error');
            }
        }
        setLoading(false);
    }

    function loadFromApiData(data) {
        const built = buildCards(data.wordIds, data.gameConfigs || [], mockWordDictionary);
        setCards(built);
        setActivityXP(data.experience || 100);
        setGameState('playing');
    }

    function loadFromMockData(activity) {
        const built = buildCards(activity.wordIds, activity.gameConfigs || [], mockWordDictionary);
        setCards(built);
        setActivityTitle(activity.title || activity.name || 'Memorama');
        setActivityXP(activity.experience || activity.recommendedXP || 100);
        setGameState('playing');
    }

    // ─── Cronómetro ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    // ─── Seleccionar carta ───────────────────────────────────────────────────
    const handleCardClick = useCallback((uid, wordId) => {
        if (lockBoard) return;
        if (matchedWordIds.has(wordId)) return;          // ya emparejada
        if (flippedUids.includes(uid)) return;           // ya seleccionada
        if (flippedUids.length === 2) return;            // ya hay 2 seleccionadas

        const newFlipped = [...flippedUids, uid];
        setFlippedUids(newFlipped);

        if (newFlipped.length === 2) {
            // Buscar wordIds de las dos cartas
            const [uid1, uid2] = newFlipped;
            const wid1 = uid1.split('-')[0];
            const wid2 = uid2.split('-')[0];

            setAttempts(p => p + 1);
            setLockBoard(true);

            if (wid1 === wid2) {
                // ¡Par! Marcar como emparejadas
                setTimeout(() => {
                    setMatchedWordIds(prev => {
                        const next = new Set(prev);
                        next.add(parseInt(wid1));
                        return next;
                    });
                    setFlippedUids([]);
                    setFeedback('correct');
                    feedbackTimeout.current = setTimeout(() => setFeedback(null), 800);
                    setLockBoard(false);
                }, 300);
            } else {
                // No coincide — voltear de vuelta
                setWrongUids(newFlipped);
                setFeedback('incorrect');
                setTimeout(() => {
                    setFlippedUids([]);
                    setWrongUids([]);
                    setFeedback(null);
                    setLockBoard(false);
                }, 900);
            }
        }
    }, [lockBoard, matchedWordIds, flippedUids]);

    // ─── Fin del juego ───────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === 'playing' && totalPairs > 0 && matchedWordIds.size === totalPairs) {
            clearInterval(timerRef.current);
            // Pequeño delay para ver la última carta
            setTimeout(() => setGameState('finished'), 700);
        }
    }, [matchedWordIds, totalPairs, gameState]);

    // ─── Determinar columnas del grid ────────────────────────────────────────
    const boardCols = () => {
        if (cards.length <= 8) return 'cols-4';
        return 'cols-8';

    };

    // ─── Render: Loading ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="game-loading-container">
            <div className="spinner" />
            <p style={{ color: '#1E3A8A', fontFamily: 'Poppins, sans-serif', marginTop: '1rem' }}>
                Preparando el memorama...
            </p>
        </div>
    );

    if (gameState === 'error') return (
        <div className="game-error-container">
            <div style={{
                background: 'white', padding: '2rem', borderRadius: '16px', textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)', maxWidth: '380px'
            }}>
                <p style={{ fontSize: '48px', marginBottom: '1rem' }}>😕</p>
                <h2 style={{ color: '#E65100', fontFamily: 'Poppins, sans-serif' }}>Actividad no encontrada</h2>
                <p style={{ color: '#374151', margin: '0.5rem 0 1.5rem' }}>{loadError}</p>
                <button onClick={() => navigate('/games/memorama')} style={{
                    background: '#1E3A8A', color: 'white', padding: '0.75rem 1.5rem',
                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif', fontWeight: '600'
                }}>Volver</button>
            </div>
        </div>
    );

    if (gameState === 'finished') return (
        <MemoramaFinalView
            totalPairs={totalPairs}
            matchedPairs={matchedWordIds.size}
            attempts={attempts}
            elapsed={elapsed}
            experience={activityXP}
            onRetry={() => window.location.reload()}
            onExit={() => navigate('/games/memorama')}
        />
    );


    const progressPercent = totalPairs > 0
        ? (matchedWordIds.size / totalPairs) * 100 : 0;

    return (
        <div className="mem-container">
            {/* Barra superior */}
            <div className="mem-top-bar">
                <button className="mem-back-btn" onClick={() => navigate('/games/memorama')} title="Salir">‹</button>
                <span className="mem-title">{activityTitle}</span>
                <div className="mem-timer-badge">⏱ {formatTime(elapsed)}</div>
            </div>


            {/* Barra de progreso */}
            <div className="mem-progress-row">
                <div className="mem-progress-bar-bg">
                    <div className="mem-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="mem-progress-label">
                    {matchedWordIds.size}/{totalPairs} pares
                </span>
            </div>

            {/* Tablero */}
            <div className={`mem-board ${boardCols()}`}>
                {cards.map(card => {
                    const isFlipped = flippedUids.includes(card.uid);
                    const isMatched = matchedWordIds.has(card.wordId);
                    const isWrong = wrongUids.includes(card.uid);
                    const isSelected = isFlipped && !isMatched && !isWrong;


                    return (
                        <div
                            key={card.uid}
                            className={[
                                'mem-card',
                                isFlipped || isMatched ? 'flipped' : '',
                                isMatched ? 'matched' : '',
                                isSelected ? 'selected' : '',
                                isWrong ? 'wrong' : '',
                            ].join(' ')}
                            onClick={() => handleCardClick(card.uid, card.wordId)}
                        >
                            <div className="mem-card-inner">
                                {/* Dorso */}
                                <div className="mem-card-front">
                                    <span className="mem-card-front-icon">?</span>
                                </div>
                                {/* Frente */}
                                <div className="mem-card-back">
                                    {card.emoji && (
                                        <span className="mem-card-emoji">{card.emoji}</span>
                                    )}
                                    {card.showText && card.text && (
                                        <span className={`mem-card-text ${card.isMazahua ? 'mazahua' : ''}`}>
                                            {card.text}
                                        </span>
                                    )}
                                    {/* Si showImage pero no hay emoji (en producción habría URL) */}
                                    {card.showImage && !card.emoji && (
                                        <span style={{ fontSize: '28px' }}>🖼️</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Instrucción */}
            <p className="mem-instruction">
                ¡Encuentra las parejas de cartas! — Intentos: {attempts}
            </p>


            {/* Feedback flash */}
            {feedback && (
                <div className={`mem-feedback-banner ${feedback}`}>
                    {feedback === 'correct' ? '¡Par encontrado! 🎉' : 'Inténtalo de nuevo 😅'}
                </div>
            )}

        </div>
    );
};

export default MemoramaGameView;
