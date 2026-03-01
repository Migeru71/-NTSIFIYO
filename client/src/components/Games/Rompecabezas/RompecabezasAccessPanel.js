// client/src/components/Games/Rompecabezas/RompecabezasAccessPanel.js
// Panel de acceso al Rompecabezas — obtiene actividades de la API
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RompecabezasService from '../../../services/RompecabezasService';
import mockRompecabezas from '../../../data/mockRompecabezas';
import '../GameAccessPanel.css';

function RompecabezasAccessPanel() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Detectar rol desde localStorage
    const getUserRole = () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData && userData.role === 'TEACHER') return 'teacher';
        } catch { }
        return 'student';
    };

    const userRole = getUserRole();

    useEffect(() => {
        loadActivities();
    }, []);

    async function loadActivities() {
        setLoading(true);
        setError(null);

        const result = await RompecabezasService.getActivities();

        if (result.success && result.data.length > 0) {
            // Mapear DTO del servidor al formato interno
            setActivities(result.data.map(item => ({
                id: item.id,
                name: item.title,
                description: item.description,
                difficulty: mapDifficulty(item.difficult),
                experience: item.experience,
                totalQuestions: item.totalQuestions,
                gameType: item.gameType,
                gameConfigs: item.assignActivityGameConfigDTO || [],
                teacher: item.teacherDTO
                    ? `${item.teacherDTO.firstName} ${item.teacherDTO.lastName}`
                    : null
            })));
        } else {
            // Fallback a datos mock si la API falla o no devuelve datos
            console.warn('API no disponible, usando datos de ejemplo:', result.error);
            setActivities(mockRompecabezas.map(a => ({
                id: a.id,
                name: a.name,
                description: a.description,
                difficulty: a.difficulty,
                experience: a.recommendedXP,
                totalQuestions: a.totalQuestions || a.questions?.length || 5,
                gameType: a.gameType,
                gameConfigs: a.gameConfigs || [],
                teacher: null
            })));
        }

        setLoading(false);
    }

    /** Convierte la dificultad del servidor ('EASY', 'MEDIUM', 'HARD') al label local */
    function mapDifficulty(difficult) {
        const map = { 'EASY': 'fácil', 'MEDIUM': 'medio', 'HARD': 'difícil' };
        return map[difficult] || 'fácil';
    }

    function handlePlayGame(activityId) {
        navigate('/games/rompecabezas/jugar/' + activityId);
    }

    function getDifficultyColor(difficulty) {
        const colors = { 'fácil': '#22c55e', 'medio': '#f59e0b', 'difícil': '#ef4444' };
        return colors[difficulty] || '#6b7280';
    }

    function getDifficultyLabel(difficulty) {
        const labels = { 'fácil': '🟢 Fácil', 'medio': '🟡 Medio', 'difícil': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }

    return (
        <div className="game-access-panel">

            {/* Encabezado */}
            <div className="gap-header">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>🧩</span>
                </div>
                <h1>Rompecabezas</h1>
                <p>Completa la frase eligiendo la pieza correcta</p>
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
                    <p>Diseña actividades personalizadas de Rompecabezas para tus alumnos.</p>
                    <button
                        className="gap-btn gap-btn-primary"
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

                    {/* Error banner (no bloquea — ya hay fallback a mock) */}
                    {error && (
                        <div style={{
                            background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: '12px', padding: '12px 16px',
                            marginBottom: '16px', fontSize: '13px', color: '#B91C1C'
                        }}>
                            ⚠️ {error} — Mostrando datos de ejemplo.
                        </div>
                    )}

                    {loading ? (
                        <div className="gap-loading">
                            <div style={{
                                width: '40px', height: '40px', border: '4px solid #e5e7eb',
                                borderTopColor: '#E65100', borderRadius: '50%',
                                animation: 'spin 1s linear infinite', margin: '0 auto 16px'
                            }} />
                            <p>Cargando actividades...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="gap-no-activities">
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🧩</span>
                            <p style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>No hay actividades disponibles</p>
                            <p>Pide a tu maestro que cree una actividad para ti</p>
                        </div>
                    ) : (
                        <div className="gap-activities-grid">
                            {activities.map((activity) => (
                                <div key={activity.id} className="gap-activity-card" style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div className="gap-card-icon">🧩</div>
                                        <div>
                                            <h3>{activity.name}</h3>
                                            <span style={{
                                                display: 'inline-block', padding: '2px 8px', borderRadius: '12px',
                                                fontSize: '11px', fontWeight: '600',
                                                background: getDifficultyColor(activity.difficulty) + '20',
                                                color: getDifficultyColor(activity.difficulty), marginTop: '4px'
                                            }}>
                                                {getDifficultyLabel(activity.difficulty)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="gap-card-description">{activity.description}</p>
                                    <div className="gap-card-stats">
                                        <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                                        <span>{'🧩 ' + (activity.totalQuestions || 5) + ' frases'}</span>
                                        {activity.teacher && <span>{'👤 ' + activity.teacher}</span>}
                                    </div>
                                    <button
                                        className="gap-btn gap-btn-play"
                                        onClick={() => handlePlayGame(activity.id)}
                                    >
                                        ▶️ ¡Jugar Ahora!
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="gap-footer">
                <small>
                    💡 Tip: {userRole === 'teacher'
                        ? 'Crea actividades y tus alumnos aprenderán completando frases'
                        : 'Elige la pieza correcta para completar la frase. ¡5 frases por lección!'}
                </small>
            </div>
        </div>
    );
}

export default RompecabezasAccessPanel;
