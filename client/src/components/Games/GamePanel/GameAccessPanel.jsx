// client/src/components/Games/GameAccessPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityApiService from '../../../services/ActivityApiService';
import { useAuth } from '../../../context/AuthContext';
import { useGame } from '../../../context/GameContext';
import Roles from '../../../utils/roles';
import '../../../styles/components/games/gamePanel/GameAccessPanel.css';

function GameAccessPanel({
    gameType,
    icon,
    title,
    subtitle,
    gameBasePath,
    cardIcon,
    tipTeacher = "Crea actividades personalizadas y tus alumnos podrán jugarlas",
    tipStudent = "Juega rápido y acumula puntos para subir de nivel"
}) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { saveGameData } = useGame();
    const [activities, setActivities] = useState([]);
    const [pageData, setPageData] = useState({ totalPages: 0, number: 0, first: true, last: true });
    const [loading, setLoading] = useState(true);
    const [startingGame, setStartingGame] = useState(false);

    const userRole = (user && user.userType === Roles.TEACHER) ? 'teacher' : 'student';

    useEffect(() => {
        loadActivities(0);
    }, [gameType]);

    async function loadActivities(page = 0) {
        setLoading(true);
        const result = await ActivityApiService.getActivitiesByGameType(gameType, page);
        if (result.success) {
            setActivities(result.data.content || []);
            setPageData({
                totalPages: result.data.totalPages,
                number: result.data.number,
                first: result.data.first,
                last: result.data.last
            });
        }
        setLoading(false);
    }

    // Preload images and audio by fetching and storing as Blob URLs
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
                return url; // fallback to original
            }
        };

        // Cache words
        if (data.words) {
            for (let w of data.words) {
                if (w.imageUrl) w.imageUrl = await fetchAsBlobUrl(w.imageUrl);
                if (w.audioUrl) w.audioUrl = await fetchAsBlobUrl(w.audioUrl);
            }
        }

        // Cache questions
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

    async function handlePlayGame(activityId) {
        setStartingGame(true);
        try {
            const result = await ActivityApiService.startGame(activityId);
            if (result.success) {
                // Preload all media assets before navigating
                await preloadAssets(result.data);
                // Save in memory (Context)
                saveGameData(result.data);
                // Navigate to the game
                navigate(`${gameBasePath}/jugar/${activityId}`);
            } else {
                alert(`Error al iniciar el juego: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setStartingGame(false);
        }
    }

    function handleCreateActivity() {
        navigate(`${gameBasePath}/crear`);
    }

    function handleEditActivity(activityId) {
        navigate(`${gameBasePath}/editar/${activityId}`);
    }

    function getDifficultyColor(difficulty) {
        const colors = { 'EASY': '#22c55e', 'MEDIUM': '#f59e0b', 'HARD': '#ef4444' };
        return colors[difficulty] || '#6b7280';
    }

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }

    return (
        <div className="game-access-panel" style={{ position: 'relative' }}>
            {/* Encabezado */}
            <div className="gap-header">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{icon}</span>
                </div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            {/* Botón de crear (solo para maestros) */}
            {userRole === 'teacher' && (
                <div className="gap-teacher-section">
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '36px', border: '3px solid #fed7aa'
                    }}>✨</div>
                    <h2>Crear Nueva Actividad</h2>
                    <p>Diseña actividades personalizadas de {title} para tus alumnos.</p>
                    <button
                        className="gap-btn gap-btn-primary"
                        onClick={handleCreateActivity}
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                    >
                        🚀 Abrir Editor de Actividades
                    </button>
                </div>
            )}

            {/* Actividades disponibles */}
            <div className="gap-role-content">
                <div>
                    <h2 className="gap-section-title">🎮 Actividades Disponibles</h2>
                    {loading ? (
                        <div className="gap-loading">
                            <div className="gap-spinner" />
                            <p>Cargando actividades...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="gap-no-activities">
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🎒</span>
                            <p style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>No hay actividades disponibles</p>
                            <p>Pide a tu maestro que cree una actividad para ti</p>
                        </div>
                    ) : (
                        <>
                            <div className="gap-activities-grid">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="gap-activity-card" style={{ position: 'relative' }}>
                                        {/* Botones editar (solo maestro) */}
                                        {userRole === 'teacher' && (
                                            <div className="gap-teacher-actions">
                                                <button
                                                    className="gap-btn-edit"
                                                    onClick={(e) => { e.stopPropagation(); handleEditActivity(activity.id); }}
                                                    title="Editar"
                                                >✏️</button>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <div className="gap-card-icon">{cardIcon}</div>
                                            <div>
                                                <h3 style={{ paddingRight: userRole === 'teacher' ? '80px' : '0' }}>{activity.title}</h3>
                                                <span style={{
                                                    display: 'inline-block', padding: '2px 8px', borderRadius: '12px',
                                                    fontSize: '11px', fontWeight: '600',
                                                    background: getDifficultyColor(activity.difficult) + '20',
                                                    color: getDifficultyColor(activity.difficult), marginTop: '4px'
                                                }}>
                                                    {getDifficultyLabel(activity.difficult)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="gap-card-description">{activity.description}</p>
                                        <div className="gap-card-stats">
                                            <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                                            <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                                            {activity.teacherDTO && (
                                                <span>👤 {activity.teacherDTO.firstName}</span>
                                            )}
                                        </div>
                                        <button
                                            className="gap-btn gap-btn-play"
                                            onClick={() => handlePlayGame(activity.id)}
                                            disabled={startingGame}
                                        >
                                            {startingGame ? 'Cargando...' : '▶️ ¡Jugar Ahora!'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {pageData.totalPages > 1 && (
                                <div className="gap-pagination">
                                    <button
                                        onClick={() => loadActivities(pageData.number - 1)}
                                        disabled={pageData.first}
                                    >Anterior</button>
                                    <span>Página {pageData.number + 1} de {pageData.totalPages}</span>
                                    <button
                                        onClick={() => loadActivities(pageData.number + 1)}
                                        disabled={pageData.last}
                                    >Siguiente</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="gap-footer">
                <small>
                    💡 Tip: {userRole === 'teacher' ? tipTeacher : tipStudent}
                </small>
            </div>
        </div>
    );
}

export default GameAccessPanel;
