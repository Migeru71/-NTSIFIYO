// client/src/components/Games/Quiz/QuizAccessPanel.js
// Panel de acceso a Quiz — rol determinado por la sesión del usuario
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockQuiz from '../../../data/mockQuiz';
import '../GameAccessPanel.css';

function QuizAccessPanel() {
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

    const loadActivities = () => {
        setLoading(true);
        setTimeout(() => {
            setActivities(mockQuiz.getAllActivities());
            setLoading(false);
        }, 300);
    };

    const handlePlayQuiz = (activityId) => {
        navigate('/games/quiz/jugar/' + activityId);
    };

    const handleCreateQuiz = () => {
        navigate('/games/quiz/crear');
    };

    const handleEditQuiz = (activityId) => {
        navigate('/games/quiz/editar/' + activityId);
    };

    const handleDeleteQuiz = (activityId, activityName) => {
        if (window.confirm('¿Eliminar "' + activityName + '"? Esta acción no se puede deshacer.')) {
            const result = mockQuiz.deleteActivity(activityId);
            if (result.success) {
                loadActivities();
            }
        }
    };

    const getDifficultyColor = (difficulty) => ({
        'fácil': '#22c55e', 'medio': '#f59e0b', 'difícil': '#ef4444'
    }[difficulty] || '#6b7280');

    const getDifficultyLabel = (difficulty) => ({
        'fácil': '🟢 Fácil', 'medio': '🟡 Medio', 'difícil': '🔴 Difícil'
    }[difficulty] || difficulty);

    return (
        <div className="game-access-panel">

            {/* Encabezado */}
            <div className="gap-header">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>❓</span>
                </div>
                <h1>Centro de Quiz</h1>
                <p>Pon a prueba tus conocimientos de Mazahua</p>
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
                    <h2>Crear Nuevo Quiz</h2>
                    <p>Diseña cuestionarios interactivos para evaluar a tus alumnos.</p>
                    <button
                        className="gap-btn gap-btn-primary"
                        onClick={handleCreateQuiz}
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                    >
                        🚀 Crear Quiz
                    </button>
                </div>
            )}

            {/* Actividades disponibles */}
            <div className="gap-role-content">
                <div>
                    <h2 className="gap-section-title">🎮 Quizzes Disponibles</h2>
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
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>📚</span>
                            <p style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>No hay quizzes disponibles</p>
                            <p>Pide a tu maestro que cree un quiz</p>
                        </div>
                    ) : (
                        <div className="gap-activities-grid">
                            {activities.map((activity) => (
                                <div key={activity.id} className="gap-activity-card" style={{ position: 'relative' }}>
                                    {/* Botones editar/eliminar (solo maestro) */}
                                    {userRole === 'teacher' && (
                                        <div className="gap-teacher-actions">
                                            <button
                                                className="gap-btn-edit"
                                                onClick={(e) => { e.stopPropagation(); handleEditQuiz(activity.id); }}
                                                title="Editar"
                                            >✏️</button>
                                            <button
                                                className="gap-btn-delete"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(activity.id, activity.name); }}
                                                title="Eliminar"
                                            >🗑️</button>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div className="gap-card-icon">❓</div>
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
                                    <p className="gap-card-description">{activity.description}</p>
                                    <div className="gap-card-stats">
                                        <span>{'❓ ' + (activity.questions?.length || 0) + ' preguntas'}</span>
                                        <span>{'⭐ ' + activity.recommendedXP + ' XP'}</span>
                                    </div>
                                    <button className="gap-btn gap-btn-play" onClick={() => handlePlayQuiz(activity.id)}>
                                        ▶️ ¡Comenzar Quiz!
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
                        ? 'Crea quizzes personalizados y evalúa a tus alumnos'
                        : 'Los quizzes tienen múltiples opciones de respuesta'}
                </small>
            </div>
        </div>
    );
}

export default QuizAccessPanel;
