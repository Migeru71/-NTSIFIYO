import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import GameService from '../../../services/GameService';
import GameSummary from '../GamePanel/GameSummary';
import { generateMaze, getMazeDimensions } from '../../../utils/mazeGenerator';
import LaberintoBoard from './LaberintoBoard';
import LaberintoControls from './LaberintoControls';
import '../../../styles/components/games/GameBase.css';
import './Laberinto.css';


function buildGameData(words, gameConfigs, count = 8) {
    const cfg0 = gameConfigs?.[0] || { showText: true, showImage: false, playAudio: false, isMazahua: false };
    const cfg1 = gameConfigs?.[1] || { showText: true, showImage: false, playAudio: false, isMazahua: false };

    const selectedWords = [...words].sort(() => Math.random() - 0.5).slice(0, count);

    const itemsA = selectedWords.map(w => ({
        id: `a_${w.id}`,
        pairId: w.id,
        text: cfg0.isMazahua ? w.mazahuaWord : w.spanishWord,
        imageUrl: cfg0.showImage ? (w.imageUrl || null) : null,
        audioUrl: cfg0.playAudio ? (w.audioUrl || null) : null,
        showText: cfg0.showText,
        showImage: cfg0.showImage,
        playAudio: cfg0.playAudio,
        emoji: w.emoji || '🃏',
    }));

    const itemsB = selectedWords.map(w => ({
        id: `b_${w.id}`,
        pairId: w.id,
        text: cfg1.isMazahua ? w.mazahuaWord : w.spanishWord,
        imageUrl: cfg1.showImage ? (w.imageUrl || null) : null,
        audioUrl: cfg1.playAudio ? (w.audioUrl || null) : null,
        showText: cfg1.showText,
        showImage: cfg1.showImage,
        playAudio: cfg1.playAudio,
        emoji: w.emoji || '🃏',
    }));

    return { itemsA, itemsB, wordList: selectedWords };
}

const LaberintoGameView = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const { currentGameData, clearGameData } = useGame();

    const [loading, setLoading] = useState(true);
    const [activityTitle, setActivityTitle] = useState('Laberinto');
    const [gameState, setGameState] = useState('loading');

    const [grid, setGrid] = useState([]);
    const [entrances, setEntrances] = useState([]);
    const [exits, setExits] = useState([]);
    const [wordList, setWordList] = useState([]);

    const [avatarPos, setAvatarPos] = useState({ x: 0, y: 0 });
    const [activeItem, setActiveItem] = useState(null);
    const [pathTraced, setPathTraced] = useState([]);
    const [completedPairs, setCompletedPairs] = useState(new Set());
    const [responseLogs, setResponseLogs] = useState([]);

    const [elapsed, setElapsed] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);

    const timerRef = useRef(null);
    const difficulty = currentGameData?.difficulty || 'Medio';

    useEffect(() => {
        initGame();
        return () => clearInterval(timerRef.current);
    }, [activityId]); // eslint-disable-line

    async function preloadAssets(data) {
        const cache = new Map();
        const fetchAsBlobUrl = async (url) => {
            if (!url) return null;
            if (cache.has(url)) return cache.get(url);
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                cache.set(url, blobUrl);
                return blobUrl;
            } catch {
                return url;
            }
        };
        if (data.words) {
            for (const w of data.words) {
                if (w.imageUrl) w.imageUrl = await fetchAsBlobUrl(w.imageUrl);
                if (w.audioUrl) w.audioUrl = await fetchAsBlobUrl(w.audioUrl);
            }
        }
    }

    async function initGame() {
        setLoading(true);

        let data = currentGameData || null;
        if (!data) {
            const result = await GameService.startGame(parseInt(activityId));
            if (result.success && result.data) {
                await preloadAssets(result.data);
                data = result.data;
            }
        }

        if (data?.words?.length) {
            loadFromApiData(data);
            if (clearGameData) clearGameData();
        } else {
            setGameState('error');
        }
        setLoading(false);
    }

    function getRandomRows(height, count) {
        return Array.from({ length: height }, (_, i) => i)
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    }

    function generateBoardAndItems(itemsA, itemsB) {
        const { width, height } = getMazeDimensions(difficulty);
        const newGrid = generateMaze(width, height);

        const rowsLeft = getRandomRows(height, itemsA.length);
        const rowsRight = getRandomRows(height, itemsB.length);

        // Shuffle items independently so rows don't mirror each other
        const shuffledA = [...itemsA].sort(() => Math.random() - 0.5);
        const shuffledB = [...itemsB].sort(() => Math.random() - 0.5);

        setGrid(newGrid);
        setEntrances(shuffledA.map((item, i) => ({ ...item, row: rowsLeft[i] })));
        setExits(shuffledB.map((item, i) => ({ ...item, row: rowsRight[i] })));
        setAvatarPos({ x: Math.floor(width / 2), y: Math.floor(height / 2) });
    }

    function loadFromApiData(data) {
        const { height } = getMazeDimensions(difficulty);
        const count = Math.min(8, height);
        const { itemsA, itemsB, wordList: wList } = buildGameData(data.words, data.gameConfigs || [], count);
        setWordList(wList);
        generateBoardAndItems(itemsA, itemsB);
        setActivityTitle(data.title || '¡Laberinto!');
        setGameState('playing');
        setTimeLeft(data.timeLimit || 120);
    }

    // Timer — single interval per gameState, no timeLeft in deps
    useEffect(() => {
        if (gameState !== 'playing') return;
        timerRef.current = setInterval(() => {
            setElapsed(p => p + 1);
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    // Detect time expiry
    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing') {
            clearInterval(timerRef.current);
            finishGame(completedPairs);
        }
    }, [timeLeft]); // eslint-disable-line

    function finishGame(pairsSnapshot) {
        clearInterval(timerRef.current);
        const logs = wordList.map(w => ({
            questionId: null,
            answerId: w.id,
            isCorrect: pairsSnapshot.has(w.id),
            wordText: w.spanishWord || w.mazahuaWord
        }));
        setResponseLogs(logs);
        setGameState('finished');
    }

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const handleMove = useCallback((dx, dy) => {
        if (gameState !== 'playing') return;
        setAvatarPos(prev => {
            const cell = grid[prev.y]?.[prev.x];
            if (!cell) return prev;

            let nx = prev.x;
            let ny = prev.y;

            if (dx === 0 && dy === -1 && !cell.top) ny -= 1;
            else if (dx === 1 && dy === 0 && !cell.right) nx += 1;
            else if (dx === 0 && dy === 1 && !cell.bottom) ny += 1;
            else if (dx === -1 && dy === 0 && !cell.left) nx -= 1;

            if (nx === prev.x && ny === prev.y) return prev;

            const newPos = { x: nx, y: ny };

            if (activeItem) {
                setPathTraced(prevPath => {
                    const newPath = [...prevPath];
                    if (newPath.length > 1 && newPath[newPath.length - 2].x === nx && newPath[newPath.length - 2].y === ny) {
                        newPath.pop();
                    } else {
                        newPath.push(newPos);
                    }
                    return newPath;
                });
            }

            return newPos;
        });
    }, [gameState, grid, activeItem]);

    // Detect arrival at right border while carrying an item
    useEffect(() => {
        if (!activeItem) return;
        const mazeWidth = grid[0]?.length;
        if (!mazeWidth || avatarPos.x !== mazeWidth - 1) return;

        const exitHit = exits.find(e => e.row === avatarPos.y && !completedPairs.has(e.pairId));
        if (!exitHit) return;

        if (exitHit.pairId === activeItem.pairId) {
            const newPairs = new Set([...completedPairs, activeItem.pairId]);
            setCompletedPairs(newPairs);
            setActiveItem(null);
            setPathTraced([]);
            if (newPairs.size >= wordList.length) {
                setTimeout(() => finishGame(newPairs), 500);
            }
        } else {
            setActiveItem(null);
            setPathTraced([]);
        }
    }, [avatarPos]); // eslint-disable-line

    const handleSelect = () => {
        if (activeItem) return;
        if (avatarPos.x !== 0) return;
        const entrance = entrances.find(e => e.row === avatarPos.y && !completedPairs.has(e.pairId));
        if (entrance) {
            setActiveItem(entrance);
            setPathTraced([{ x: avatarPos.x, y: avatarPos.y }]);
        }
    };

    const isSelectEnabled = !activeItem && avatarPos.x === 0 &&
        entrances.some(e => e.row === avatarPos.y && !completedPairs.has(e.pairId));

    if (loading) return <div className="game-loading-container">Cargando Laberinto...</div>;

    if (gameState === 'error') return (
        <div className="game-error-container">
            <h2>Error al cargar el laberinto</h2>
            <button onClick={() => navigate('/games')}>Volver</button>
        </div>
    );

    if (gameState === 'finished') {
        return (
            <GameSummary
                activityId={activityId}
                gameId={8}
                startDate={new Date().toISOString()}
                correctAnswers={completedPairs.size}
                totalQuestions={wordList.length}
                responseLogs={responseLogs}
                onExit={() => navigate('/games')}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="game-container">
            <div className="game-top-bar">
                <button className="game-top-bar__back-btn" onClick={() => navigate('/games')} title="Salir">‹</button>
                <span className="game-top-bar__title">{activityTitle}</span>
                <div className="game-top-bar__timer">⏱ {formatTime(timeLeft)}</div>
            </div>

            <div className="laberinto-main">
                <LaberintoBoard
                    grid={grid}
                    entrances={entrances}
                    exits={exits}
                    avatarPos={avatarPos}
                    activeItem={activeItem}
                    pathTraced={pathTraced}
                    completedPairs={completedPairs}
                />
            </div>

            <LaberintoControls
                onMove={handleMove}
                onSelect={handleSelect}
                isSelectEnabled={isSelectEnabled}
            />
        </div>
    );
};

export default LaberintoGameView;
