// client/src/components/Games/Memorama/MemoramaAccessPanel.js
// Panel de acceso al Memorama — rol determinado por la sesión del usuario
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityService from '../../../services/ActivityService';
import mockGames from '../../../data/mockGames';
import './MemoramaAccessPanel.css';

function MemoramaAccessPanel() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Detectar rol desde localStorage (sin botón toggle)
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

    function loadActivities() {
        setLoading(true);
        setTimeout(() => {
            const allActivities = ActivityService.getAllActivities();
            setActivities(allActivities);
            setLoading(false);
        }, 300);
    }

    function handlePlayGame(activityId) {
        navigate('/games/memorama/jugar/' + activityId);
    }

    function handleCreateActivity() {
        navigate('/games/memorama/crear');
    }

    function handleEditActivity(activityId) {
        navigate('/games/memorama/editar/' + activityId);
    }

    function handleDeleteActivity(activityId, activityName) {
        if (window.confirm('¿Eliminar "' + activityName + '"? Esta acción no se puede deshacer.')) {
            const result = mockGames.deleteActivity(activityId);
            if (result.success) {
                loadActivities();
            }
        }
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
        <div className="memorama-access-panel">

            {/* Encabezado */}
            <div className="panel-header">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>⚡</span>
                </div>
                <h1>Memoria Rápida</h1>
                <p>Desliza a la derecha si coincide, a la izquierda si no</p>
            </div>

            {/* Botón de crear (solo para maestros) */}
            {userRole === 'teacher' && (
                <div className="teacher-section" style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '36px', border: '3px solid #fed7aa'
                    }}>✨</div>
                    <h2>Crear Nueva Actividad</h2>
                    <p>Diseña actividades personalizadas de Memorama para tus alumnos usando el nuevo editor visual.</p>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateActivity}
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                    >
                        🚀 Abrir Editor de Actividades
                    </button>
                </div>
            )}

            {/* Actividades disponibles */}
            <div className="role-content">
                <div className="student-section">
                    <h2>🎮 Actividades Disponibles</h2>
                    {loading ? (
                        <div className="loading-text">
                            <div style={{
                                width: '40px', height: '40px', border: '4px solid #e5e7eb',
                                borderTopColor: '#E65100', borderRadius: '50%',
                                animation: 'spin 1s linear infinite', margin: '0 auto 16px'
                            }} />
                            <p>Cargando actividades...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="no-activities">
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🎒</span>
                            <p style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>No hay actividades disponibles</p>
                            <p>Pide a tu maestro que cree una actividad para ti</p>
                        </div>
                    ) : (
                        <div className="activities-grid">
                            {activities.map((activity) => (
                                <div key={activity.id} className="activity-card" style={{ position: 'relative' }}>
                                    {/* Botones editar/eliminar (solo maestro) */}
                                    {userRole === 'teacher' && (
                                        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditActivity(activity.id); }}
                                                title="Editar"
                                                style={{
                                                    padding: '6px 8px', background: '#fff7ed', border: '1px solid #fed7aa',
                                                    borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                                                }}
                                            >✏️</button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteActivity(activity.id, activity.name); }}
                                                title="Eliminar"
                                                style={{
                                                    padding: '6px 8px', background: '#fef2f2', border: '1px solid #fecaca',
                                                    borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                                                }}
                                            >🗑️</button>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '24px', flexShrink: 0, border: '2px solid #fed7aa'
                                        }}>🎴</div>
                                        <div>
                                            <h3 style={{ paddingRight: userRole === 'teacher' ? '80px' : '0' }}>{activity.name}</h3>
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
                                    <p className="description">{activity.description}</p>
                                    <div className="activity-info">
                                        <span>{'⭐ ' + activity.recommendedXP + ' XP'}</span>
                                        <span>{'🎯 ' + (activity.pairs ? activity.pairs.length : 0) + ' pares'}</span>
                                        <span>{'⏱️ ~' + (activity.pairs ? activity.pairs.length * 30 : 60) + 's'}</span>
                                    </div>
                                    <button className="btn btn-play" onClick={() => handlePlayGame(activity.id)}>
                                        ▶️ ¡Jugar Ahora!
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="panel-footer">
                <small>
                    💡 Tip: {userRole === 'teacher'
                        ? 'Crea actividades personalizadas y tus alumnos podrán jugarlas'
                        : 'Desliza rápido y acumula combos para ganar más XP'}
                </small>
            </div>
        </div>
    );
}

export default MemoramaAccessPanel;