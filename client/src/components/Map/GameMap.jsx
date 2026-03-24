import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CATEGORIES, GAME_TOPICS } from '../../utils/gameCategories';
import ActivityApiService from '../../services/ActivityApiService';
import { useGame } from '../../context/GameContext';
import './GameMap.css';

// Approximate coordinates to spread the 8 categories around the map
const CATEGORY_POSITIONS = {
    'SCHOOL': { top: '30%', left: '25%', icon: '🏫' },
    'COMMUNITY': { top: '25%', left: '60%', icon: '🏘️' },
    'KITCHEN': { top: '45%', left: '50%', icon: '🍳' },
    'FOREST': { top: '20%', left: '15%', icon: '🌲' },
    'FARM': { top: '55%', left: '30%', icon: '🐄' },
    'MARKET': { top: '48%', left: '70%', icon: '🏪' },
    'CLINIC': { top: '70%', left: '80%', icon: '🏥' },
    'PARK': { top: '75%', left: '50%', icon: '⛲' }
};

const BASE_PATHS = {
    'QUESTIONNAIRE': '/games/quiz',
    'FAST_MEMORY': '/games/memoria_rapida',
    'INTRUDER': '/games/intruso',
    'PUZZLE': '/games/rompecabezas',
    'MEMORY_GAME': '/games/memorama',
    'LOTTERY': '/games/loteria'
};

function GameMap() {
    const navigate = useNavigate();
    const { saveGameData } = useGame();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTopic, setActiveTopic] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startingGameId, setStartingGameId] = useState(null);

    // Get topics for the currently selected category
    const categoryTopics = selectedCategory 
        ? GAME_TOPICS.filter(t => t.categoryId === selectedCategory.id)
        : [];

    // When a category is opened, automatically select the first topic
    useEffect(() => {
        if (selectedCategory && categoryTopics.length > 0) {
            setActiveTopic(categoryTopics[0].id);
        }
    }, [selectedCategory]);

    // When the active topic changes, fetch games
    useEffect(() => {
        if (!activeTopic) return;
        
        async function fetchGames() {
            setLoading(true);
            const result = await ActivityApiService.getGamesByTopic(activeTopic, 0, 0);
            if (result.success && result.data && result.data.content) {
                setGames(result.data.content);
            } else {
                setGames([]);
            }
            setLoading(false);
        }
        
        fetchGames();
    }, [activeTopic]);

    // Preload media
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
            } catch (err) {
                console.error("Failed to fetch asset", url, err);
                return url;
            }
        };

        if (data.words) {
            for (let w of data.words) {
                if (w.imageUrl) w.imageUrl = await fetchAsBlobUrl(w.imageUrl);
                if (w.audioUrl) w.audioUrl = await fetchAsBlobUrl(w.audioUrl);
            }
        }
        if (data.questions) {
            for (let q of data.questions) {
                if (q.word) {
                    if (q.word.imageUrl) q.word.imageUrl = await fetchAsBlobUrl(q.word.imageUrl);
                    if (q.word.audioUrl) q.word.audioUrl = await fetchAsBlobUrl(q.word.audioUrl);
                }
                if (q.responseList) {
                    for (let r of q.responseList) {
                        if (r.word) {
                            if (r.word.imageUrl) r.word.imageUrl = await fetchAsBlobUrl(r.word.imageUrl);
                            if (r.word.audioUrl) r.word.audioUrl = await fetchAsBlobUrl(r.word.audioUrl);
                        }
                    }
                }
            }
        }
    }

    const handlePlayGame = async (gameId) => {
        setStartingGameId(gameId);
        try {
            const result = await ActivityApiService.startGame(gameId);
            if (result.success && result.data) {
                const { gameType } = result.data;
                const basePath = BASE_PATHS[gameType];
                
                if (!basePath) {
                    alert('Tipo de juego desconocido: ' + gameType);
                    return;
                }

                await preloadAssets(result.data);
                saveGameData(result.data);
                navigate(`${basePath}/jugar/${gameId}`);
            } else {
                alert(`Error al iniciar el juego: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert('Error al iniciar el juego');
        } finally {
            setStartingGameId(null);
        }
    };

    function getDifficultyLabel(diff) {
        const map = { EASY: 'Fácil', MEDIUM: 'Medio', HARD: 'Difícil' };
        return map[diff] || diff;
    }

    return (
        <div className="game-map-container">
            {GAME_CATEGORIES.map(cat => {
                const pos = CATEGORY_POSITIONS[cat.id] || { top: '50%', left: '50%', icon: '📍' };
                return (
                    <div 
                        key={cat.id} 
                        className="map-point"
                        style={{ top: pos.top, left: pos.left }}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        <div className="map-point-icon">{pos.icon}</div>
                        <div className="map-point-label">{cat.label}</div>
                    </div>
                );
            })}

            {/* Popup / Modal */}
            {selectedCategory && (
                <div className="map-popup-overlay" onClick={() => setSelectedCategory(null)}>
                    <div className="map-popup-content" onClick={e => e.stopPropagation()}>
                        <button className="map-popup-close" onClick={() => setSelectedCategory(null)}>✕</button>
                        
                        <div className="map-popup-header">
                            <h2 className="map-popup-title">{selectedCategory.label}</h2>
                            <div className="map-tabs-container">
                                {categoryTopics.map(topic => (
                                    <div 
                                        key={topic.id}
                                        className={`map-tab ${activeTopic === topic.id ? 'active' : ''}`}
                                        onClick={() => setActiveTopic(topic.id)}
                                    >
                                        {topic.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="map-popup-body">
                            {loading ? (
                                <div className="map-loading">Cargando actividades...</div>
                            ) : games.length === 0 ? (
                                <div className="map-empty">No hay actividades disponibles para este tema.</div>
                            ) : (
                                <div className="map-game-list">
                                    {games.map(game => (
                                        <div key={game.id} className="map-game-card">
                                            <div className="map-game-info">
                                                <h3 className="map-game-title">{game.title}</h3>
                                                <p className="map-game-desc">{game.description}</p>
                                                <span className={`map-game-difficulty diff-${game.difficult}`}>
                                                    {getDifficultyLabel(game.difficult)}
                                                </span>
                                            </div>
                                            <div className="map-game-actions">
                                                <div className="map-game-questions">
                                                    🎯 {game.totalQuestions || 0} ítems
                                                </div>
                                                <button 
                                                    className="map-game-btn"
                                                    disabled={startingGameId === game.id}
                                                    onClick={() => handlePlayGame(game.id)}
                                                >
                                                    {startingGameId === game.id ? 'Cargando...' : '▶ Comenzar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameMap;
