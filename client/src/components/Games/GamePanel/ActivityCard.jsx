import React from 'react';
import '../../../styles/components/games/gamePanel/ActivityCard.css';

function ActivityCard({
    activity,
    userRole,
    cardIcon,
    onEdit,
    onPlay
}) {
    function getDifficultyColor(difficulty) {
        const colors = { 'EASY': '#22c55e', 'MEDIUM': '#f59e0b', 'HARD': '#ef4444' };
        return colors[difficulty] || '#6b7280';
    }

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }

    return (
        <div className="activity-card" style={{ position: 'relative' }}>
            {/* Botones editar (solo maestro) */}
            {userRole === 'teacher' && onEdit && (
                <div className="activity-card-teacher-actions">
                    <button
                        className="activity-card-btn-edit"
                        onClick={(e) => { e.stopPropagation(); onEdit(activity.id); }}
                        title="Editar"
                    >✏️</button>
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div className="activity-card-icon">{cardIcon}</div>
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
            <p className="activity-card-description">{activity.description}</p>
            <div className="activity-card-stats">
                <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                {(activity.teacherDTO || activity.teacher) && (
                    <span>👤 {(activity.teacherDTO || activity.teacher).firstName}</span>
                )}
            </div>
            <button
                className="activity-card-btn-play"
                onClick={() => onPlay(activity.id)}
            >
                ▶️ ¡Jugar Ahora!
            </button>
        </div>
    );
}

export default ActivityCard;
