// client/src/components/Games/Rompecabezas/RompecabezasAccessPanel.js
// Panel de acceso al Rompecabezas — rol determinado por la sesión del usuario
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockRompecabezas from '../../../data/mockRompecabezas';
import '../GameAccessPanel.css';

function RompecabezasAccessPanel() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

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

    function loadActivities() {
        setLoading(true);
        setTimeout(() => {
            setActivities(mockRompecabezas);
            setLoading(false);
        }, 300);
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
                                        <span>{'⭐ ' + activity.recommendedXP + ' XP'}</span>
                                        <span>{'🧩 ' + (activity.questions ? activity.questions.length : 0) + ' frases'}</span>
                                        <span>{'⏱️ ~' + (activity.questions ? activity.questions.length * 20 : 60) + 's'}</span>
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
