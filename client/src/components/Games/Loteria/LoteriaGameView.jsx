// client/src/components/Games/Loteria/LoteriaGameView.jsx
// Fase 2 — Juego: Baraja (izquierda) + Tabla 3×3 (derecha)
// Estilo visual basado en la referencia de Lotería digital
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import LoteriService from '../../../services/LoteriService';
import LoteriaFinalView from './LoteriaFinalView';
import './Loteria.css';

// ─── Mock data de 9 palabras (desarrollo sin API) ────────────────────────────
const MOCK_WORDS = [
    { id: 1, mazahuaWord: "nzäthi", spanishWord: "El Sol", imageUrl: null, audioUrl: null },
    { id: 2, mazahuaWord: "ndeje", spanishWord: "La Luna", imageUrl: null, audioUrl: null },
    { id: 3, mazahuaWord: "dehe", spanishWord: "El Agua", imageUrl: null, audioUrl: null },
    { id: 4, mazahuaWord: "yju", spanishWord: "El Árbol", imageUrl: null, audioUrl: null },
    { id: 5, mazahuaWord: "mfeni", spanishWord: "El Gallo", imageUrl: null, audioUrl: null },
    { id: 6, mazahuaWord: "ngümi", spanishWord: "La Rosa", imageUrl: null, audioUrl: null },
    { id: 7, mazahuaWord: "zithu", spanishWord: "La Flor", imageUrl: null, audioUrl: null },
    { id: 8, mazahuaWord: "pjäri", spanishWord: "El Viento", imageUrl: null, audioUrl: null },
    { id: 9, mazahuaWord: "nzöni", spanishWord: "La Montaña", imageUrl: null, audioUrl: null },
];

const WORD_EMOJIS = { 1: '☀️', 2: '🌙', 3: '💧', 4: '🌳', 5: '🐓', 6: '🌹', 7: '🌸', 8: '💨', 9: '⛰️' };
const CARD_SUITS = ['♠', '♣', '♦', '♥'];
const CARD_RANKS = ['A', 'Q', 'K', 'J'];

const CARD_INTERVAL_MS = 5000;
const PENALTY_PTS = 5;
const CORRECT_PTS = 10;

function randomSuit() { return CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)]; }
function randomRank() { return CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)]; }

function buildGameData(words, gameConfigs) {
    const cfg0 = gameConfigs[0] || { showText: true, showImage: false, playAudio: false, isMazahua: false };
    const cfg1 = gameConfigs[1] || { showText: true, showImage: false, playAudio: false, isMazahua: false };

    const pile = [...words].sort(() => Math.random() - 0.5).map((w) => ({
        wordId: w.id,
        text: cfg0.isMazahua ? w.mazahuaWord : w.spanishWord,
        altText: cfg0.isMazahua ? w.spanishWord : w.mazahuaWord,
        imageUrl: cfg0.showImage ? w.imageUrl : null,
        audioUrl: cfg0.playAudio ? w.audioUrl : null,
        showText: cfg0.showText,
        showImage: cfg0.showImage,
        playAudio: cfg0.playAudio,
        isMazahua: cfg0.isMazahua,
        emoji: WORD_EMOJIS[w.id] || '🃏',
    }));

    const board = [...words].sort(() => Math.random() - 0.5).map((w) => ({
        wordId: w.id,
        text: cfg1.isMazahua ? w.mazahuaWord : w.spanishWord,
        imageUrl: cfg1.showImage ? w.imageUrl : null,
        audioUrl: cfg1.playAudio ? w.audioUrl : null,
        showText: cfg1.showText,
        showImage: cfg1.showImage,
        playAudio: cfg1.playAudio,
        isMazahua: cfg1.isMazahua,
        emoji: WORD_EMOJIS[w.id] || '🃏',
        suit: randomSuit(),
        rank: randomRank(),
    }));

    return { pile, board };
}

// ─────────────────────────────────────────────────────────────────────────────
const LoteriaGameView = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const { currentGameData, clearGameData } = useGame();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [activityTitle, setActivityTitle] = useState('Lotería');
    const [activityXP, setActivityXP] = useState(100);

    const [pile, setPile] = useState([]);
    const [board, setBoard] = useState([]);

    const [pileIndex, setPileIndex] = useState(-1);
    const [revealedIds, setRevealedIds] = useState(new Set());
    const [matchedIds, setMatchedIds] = useState(new Set());
    const [wrongIds, setWrongIds] = useState(new Set());
    const [highlightId, setHighlightId] = useState(null);
    const [score, setScore] = useState(0);
    const [penaltyCount, setPenaltyCount] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [gameState, setGameState] = useState('loading');
    const [elapsed, setElapsed] = useState(0);

    const timerRef = useRef(null);
    const pileTimerRef = useRef(null);
    const feedbackTimeout = useRef(null);
    const pileIndexRef = useRef(-1);
    const revealedIdsRef = useRef(new Set());
    const matchedIdsRef = useRef(new Set());
    const pileRef = useRef([]);

    pileIndexRef.current = pileIndex;
    revealedIdsRef.current = revealedIds;
    matchedIdsRef.current = matchedIds;
    pileRef.current = pile;

    // ─── Init ─────────────────────────────────────────────────────────────
    useEffect(() => {
        initGame();
        return () => {
            clearInterval(timerRef.current);
            clearInterval(pileTimerRef.current);
            clearTimeout(feedbackTimeout.current);
        };
    }, [activityId]); // eslint-disable-line

    async function initGame() {
        setLoading(true);
        setLoadError(null);

        let data = currentGameData || null;
        if (!data) {
            const result = await LoteriService.startGame(parseInt(activityId));
            if (result.success && result.data) { data = result.data; }
        }

        if (data && (data.words?.length || data.wordIds?.length)) {
            loadFromApiData(data);
            if (clearGameData) clearGameData();
        } else {
            loadMockData();
        }
        setLoading(false);
    }

    function loadMockData() {
        const cfgs = [
            { showText: true, showImage: false, playAudio: false, isMazahua: false },
            { showText: true, showImage: false, playAudio: false, isMazahua: false },
        ];
        const { pile: p, board: b } = buildGameData(MOCK_WORDS, cfgs);
        setPile(p); setBoard(b);
        setActivityTitle('¡Lotería!');
        setActivityXP(100);
        setGameState('playing');
    }

    function loadFromApiData(data) {
        const words = data.words || MOCK_WORDS;
        const { pile: p, board: b } = buildGameData(words, data.gameConfigs || []);
        setPile(p); setBoard(b);
        setActivityTitle(data.title || '¡Lotería!');
        setActivityXP(data.experience || 100);
        setGameState('playing');
    }

    // ─── Cronómetro ──────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    // ─── Auto-reveal ─────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState !== 'playing' || pile.length === 0) return;
        revealNext();
        pileTimerRef.current = setInterval(revealNext, CARD_INTERVAL_MS);
        return () => clearInterval(pileTimerRef.current);
    }, [gameState, pile.length]); // eslint-disable-line

    function revealNext() {
        const next = pileIndexRef.current + 1;
        if (next >= pileRef.current.length) {
            clearInterval(pileTimerRef.current);
            return;
        }
        const card = pileRef.current[next];
        setPileIndex(next);
        setRevealedIds(prev => {
            const n = new Set(prev); n.add(card.wordId);
            revealedIdsRef.current = n; return n;
        });
        setHighlightId(card.wordId);
        setTimeout(() => setHighlightId(null), 1400);
        if (card.playAudio && card.audioUrl) {
            new Audio(card.audioUrl).play().catch(() => { });
        }
    }

    // ─── Fin del juego ────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === 'playing' && board.length > 0 && matchedIds.size >= board.length) {
            clearInterval(timerRef.current);
            clearInterval(pileTimerRef.current);
            setTimeout(() => setGameState('finished'), 700);
        }
    }, [matchedIds, board.length, gameState]);

    // ─── Click en carta del tablero ───────────────────────────────────────
    const handleCardClick = useCallback((wordId) => {
        if (gameState !== 'playing') return;
        if (matchedIdsRef.current.has(wordId)) return;
        clearTimeout(feedbackTimeout.current);

        if (revealedIdsRef.current.has(wordId)) {
            setMatchedIds(prev => {
                const n = new Set(prev); n.add(wordId);
                matchedIdsRef.current = n; return n;
            });
            setScore(p => p + CORRECT_PTS);
            setFeedback('correct');
        } else {
            setWrongIds(prev => new Set([...prev, wordId]));
            setPenaltyCount(p => p + 1);
            setScore(p => Math.max(0, p - PENALTY_PTS));
            setFeedback('incorrect');
            setTimeout(() => {
                setWrongIds(prev => { const n = new Set(prev); n.delete(wordId); return n; });
            }, 700);
        }
        feedbackTimeout.current = setTimeout(() => setFeedback(null), 900);
    }, [gameState]);

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    // ─── Render: Loading ──────────────────────────────────────────────────
    if (loading) return (
        <div className="game-loading-container">
            <div className="lot-spinner" />
            <p style={{ color: '#1E3A8A', fontFamily: 'Poppins,sans-serif', marginTop: '1rem' }}>
                Cargando Lotería...
            </p>
        </div>
    );

    if (gameState === 'error') return (
        <div className="game-error-container">
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', textAlign: 'center', maxWidth: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
                <p style={{ fontSize: '48px', marginBottom: '0.5rem' }}>😕</p>
                <h2 style={{ color: '#E84C0A', fontFamily: 'Poppins,sans-serif' }}>Actividad no encontrada</h2>
                <p style={{ color: '#374151', margin: '0.5rem 0 1.5rem' }}>{loadError}</p>
                <button onClick={() => navigate('/games/loteria')} style={{ background: '#1E3A8A', color: '#fff', padding: '0.75rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontWeight: 700 }}>
                    Volver
                </button>
            </div>
        </div>
    );

    if (gameState === 'finished') return (
        <LoteriaFinalView
            totalCards={board.length}
            matchedCards={matchedIds.size}
            score={score}
            penaltyCount={penaltyCount}
            elapsed={elapsed}
            experience={activityXP}
            onRetry={() => window.location.reload()}
            onExit={() => navigate('/games/loteria')}
        />
    );

    const currentCard = pileIndex >= 0 && pileIndex < pile.length ? pile[pileIndex] : null;

    return (
        <div className="lot-container">

            {/* ── Barra superior ── */}
            <div className="lot-topbar">
                <div className="lot-logo">
                    <div className="lot-logo-icon">🎰</div>
                    <span className="lot-logo-text">¡Lotería!</span>
                </div>

                <div className="lot-topbar-right">
                    <div className="lot-badge lot-badge-points">
                        ⭐ Puntos: {score}
                    </div>
                    {penaltyCount > 0 && (
                        <div className="lot-badge lot-badge-penalty">
                            ❌ -{penaltyCount * PENALTY_PTS}
                        </div>
                    )}
                    <div className="lot-badge lot-badge-timer">
                        ⏱ {formatTime(elapsed)}
                    </div>
                    <button className="lot-topbar-icon-btn" onClick={() => navigate('/games/loteria')} title="Salir">
                        ✕
                    </button>
                </div>
            </div>

            {/* ── Área principal ── */}
            <div className="lot-main">

                {/* Columna izquierda — Baraja */}
                <div className="lot-baraja-col">
                    <span className="lot-baraja-label">Baraja</span>

                    {currentCard ? (
                        <div className="lot-baraja-card" key={pileIndex}>
                            <div className="lot-baraja-card-image-area">
                                {currentCard.showImage && currentCard.imageUrl ? (
                                    <img
                                        src={currentCard.imageUrl}
                                        alt={currentCard.text}
                                        className="lot-baraja-card-image"
                                    />
                                ) : (
                                    <span className="lot-baraja-card-emoji">{currentCard.emoji}</span>
                                )}
                            </div>
                            <div className="lot-baraja-card-footer">
                                <div className="lot-baraja-card-name">{currentCard.text}</div>
                                {currentCard.isMazahua && (
                                    <div className="lot-baraja-card-subtitle">"{currentCard.altText}"</div>
                                )}
                                {currentCard.playAudio && currentCard.audioUrl && (
                                    <button
                                        className="lot-audio-btn"
                                        style={{ margin: '8px auto 0', display: 'flex' }}
                                        onClick={() => new Audio(currentCard.audioUrl).play().catch(() => { })}
                                        title="Reproducir audio"
                                    >
                                        🔊
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="lot-baraja-waiting">
                            <span className="lot-baraja-waiting-icon">🎰</span>
                            <span className="lot-baraja-waiting-text">Iniciando...</span>
                        </div>
                    )}

                    <div className="lot-find-btn">
                        {currentCard
                            ? `¡Busca esta carta en tu tabla!`
                            : 'Las cartas aparecerán pronto'}
                    </div>

                    <span className="lot-pile-counter">
                        Carta {Math.max(pileIndex + 1, 0)} de {pile.length}
                    </span>
                </div>

                {/* Columna derecha — Tabla */}
                <div className="lot-tabla-col">
                    <span className="lot-tabla-pill">TABLA #{String(activityId || '01').padStart(2, '0')}</span>

                    <div className="lot-tabla-board">
                        <div className="lot-board-grid">
                            {board.map((card) => {
                                const isMatched = matchedIds.has(card.wordId);
                                const isWrong = wrongIds.has(card.wordId);
                                const isHighlighted = highlightId === card.wordId && !isMatched;

                                return (
                                    <div
                                        key={card.wordId}
                                        className={[
                                            'lot-board-card',
                                            isMatched ? 'matched' : '',
                                            isWrong ? 'wrong' : '',
                                            isHighlighted ? 'highlighted' : '',
                                        ].join(' ').trim()}
                                        onClick={() => handleCardClick(card.wordId)}
                                        title={card.text}
                                    >
                                        {/* Contenido de la carta */}
                                        {card.showImage && card.imageUrl ? (
                                            <img
                                                src={card.imageUrl}
                                                alt={card.text}
                                                className="lot-board-card-image"
                                            />
                                        ) : (
                                            <span className="lot-board-card-emoji">{card.emoji}</span>
                                        )}

                                        {card.showText && (
                                            <span className="lot-board-card-label">{card.text}</span>
                                        )}

                                        {/* Overlay de checkmark cuando está seleccionada */}
                                        {isMatched && (
                                            <div className="lot-board-card-check">
                                                <div className="lot-board-card-check-circle">✓</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <span style={{ fontSize: '12px', color: 'rgba(30,58,138,0.6)', fontWeight: 600 }}>
                        Seleccionadas: {matchedIds.size} / {board.length}
                    </span>
                </div>
            </div>

            {/* ── Botón ¡Lotería! ── */}
            <div className="lot-loteria-btn-row">
                <button className="lot-loteria-btn" disabled>
                    🎊 ¡Lotería!
                </button>
            </div>

            {/* Feedback flash */}
            {feedback && (
                <div className={`lot-feedback-banner ${feedback}`}>
                    {feedback === 'correct'
                        ? `¡Lotería! +${CORRECT_PTS} pts 🎉`
                        : `¡Aún no ha salido! -${PENALTY_PTS} pts 😅`}
                </div>
            )}
        </div>
    );
};

export default LoteriaGameView;
