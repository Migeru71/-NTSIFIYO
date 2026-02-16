// client/src/components/Games/Quiz/QuizAccessPanel.js
// Panel de acceso a actividades de Quiz
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockQuiz from '../../../data/mockQuiz';
import './Quiz.css';

function QuizAccessPanel() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('student');

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
        <div className="quiz-access-panel">
            {/* Header */}
            <div className="quiz-panel-header">
                <span style={{ fontSize: '56px', marginBottom: '8px', display: 'block' }}>❓</span>
                <h1>Centro de Quiz</h1>
                <p>Pon a prueba tus conocimientos de Mazahua</p>
            </div>

            {/* Role Selector */}
            <div className="role-selector" style={{ marginBottom: '2rem' }}>
                <button
                    className={`role-btn ${userRole === 'student' ? 'active' : ''}`}
                    onClick={() => setUserRole('student')}
                    style={userRole === 'student' ? { background: '#7c3aed', borderColor: '#7c3aed' } : {}}
                >
                    👨‍🎓 Soy Alumno
                </button>
                <button
                    className={`role-btn ${userRole === 'teacher' ? 'active' : ''}`}
                    onClick={() => setUserRole('teacher')}
                    style={userRole === 'teacher' ? { background: '#7c3aed', borderColor: '#7c3aed' } : {}}
                >
                    👨‍🏫 Soy Docente
                </button>
            </div>

            {/* Content based on role */}
            {userRole === 'teacher' ? (
                <div className="role-content">
                    {/* Create section */}
                    <div className="teacher-section" style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '36px', border: '3px solid #c4b5fd'
                        }}>✨</div>
                        <h2 style={{ textAlign: 'center', color: '#5b21b6', marginBottom: '0.5rem' }}>Crear Nuevo Quiz</h2>
                        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>
                            Diseña cuestionarios interactivos para evaluar a tus alumnos.
                        </p>
                        <button
                            className="btn-play-quiz"
                            onClick={handleCreateQuiz}
                            style={{ maxWidth: '280px', margin: '0 auto', display: 'block' }}
                        >
                            🚀 Crear Quiz
                        </button>
                    </div>

                    {/* Activities list */}
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h3 style={{ color: '#5b21b6', marginBottom: '1rem', textAlign: 'center' }}>📊 Mis Quizzes Creados</h3>
                        {activities.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#6b7280' }}>Aún no has creado quizzes</p>
                        ) : (
                            <div className="quiz-activities-grid">
                                {activities.map(activity => (
                                    <div key={activity.id} className="quiz-activity-card" style={{ position: 'relative' }}>
                                        {/* Botones editar/eliminar */}
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditQuiz(activity.id); }}
                                                title="Editar"
                                                style={{ padding: '6px 10px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                                            >✏️</button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(activity.id, activity.name); }}
                                                title="Eliminar"
                                                style={{ padding: '6px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                                            >🗑️</button>
                                        </div>
                                        <div className="quiz-card-header">
                                            <div className="quiz-card-icon">❓</div>
                                            <div>
                                                <h3 className="quiz-card-title" style={{ paddingRight: '70px' }}>{activity.name}</h3>
                                                <span className="quiz-card-badge" style={{
                                                    background: getDifficultyColor(activity.difficulty) + '20',
                                                    color: getDifficultyColor(activity.difficulty)
                                                }}>
                                                    {getDifficultyLabel(activity.difficulty)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="quiz-card-description">{activity.description}</p>
                                        <div className="quiz-card-stats">
                                            <span>❓ {activity.questions?.length || 0} preguntas</span>
                                            <span>⭐ {activity.recommendedXP} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Student view */
                <div className="role-content">
                    <h2 style={{ textAlign: 'center', color: '#5b21b6', marginBottom: '2rem' }}>❓ Quizzes Disponibles</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>⏳ Cargando...</p>
                    ) : activities.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>📚</span>
                            <p style={{ color: '#374151', fontSize: '18px' }}>No hay quizzes disponibles</p>
                            <p style={{ color: '#6b7280' }}>Pide a tu maestro que cree un quiz</p>
                        </div>
                    ) : (
                        <div className="quiz-activities-grid">
                            {activities.map(activity => (
                                <div key={activity.id} className="quiz-activity-card">
                                    <div className="quiz-card-header">
                                        <div className="quiz-card-icon">❓</div>
                                        <div>
                                            <h3 className="quiz-card-title">{activity.name}</h3>
                                            <span className="quiz-card-badge" style={{
                                                background: getDifficultyColor(activity.difficulty) + '20',
                                                color: getDifficultyColor(activity.difficulty)
                                            }}>
                                                {getDifficultyLabel(activity.difficulty)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="quiz-card-description">{activity.description}</p>
                                    <div className="quiz-card-stats">
                                        <span>❓ {activity.questions?.length || 0} preguntas</span>
                                        <span>⭐ {activity.recommendedXP} XP</span>
                                    </div>
                                    <button className="btn-play-quiz" onClick={() => handlePlayQuiz(activity.id)}>
                                        ▶️ ¡Comenzar Quiz!
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="panel-footer" style={{ marginTop: '2rem' }}>
                <small>💡 Tip: Los quizzes tienen múltiples opciones de respuesta</small>
            </div>
        </div>
    );
}

export default QuizAccessPanel;
