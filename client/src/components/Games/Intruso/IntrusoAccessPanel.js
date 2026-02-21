// client/src/components/Games/Intruso/IntrusoAccessPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import intrusoActivities from '../../../data/mockIntruso';
import './Intruso.css';

function IntrusoAccessPanel() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay for better UX
        setTimeout(() => {
            setActivities(intrusoActivities);
            setLoading(false);
        }, 500);
    }, []);

    const handlePlay = (activityId) => {
        navigate(`/games/intruso/jugar/${activityId}`);
    };

    return (
        <div className="intruso-    container">
            {/* Header */}
            <div className="header-panel" style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
                <div style={{
                    fontSize: '64px',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}>
                    🕵️
                </div>
                <h1 style={{
                    fontSize: '36px',
                    color: '#1E3A8A',
                    fontWeight: '800',
                    marginBottom: '0.5rem',
                    fontFamily: "'Poppins', sans-serif"
                }}>
                    Encuentra al Intruso
                </h1>
                <p style={{
                    color: '#4B5563',
                    fontSize: '18px',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    Selecciona la palabra que no pertenece al grupo. ¡Tienes 45 segundos!
                </p>
            </div>

            {/* Activity List */}
            <div style={{ width: '100%', maxWidth: '500px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <p style={{ color: '#1E3A8A' }}>Cargando actividades...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <p>No hay actividades disponibles por el momento.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {activities.map(activity => (
                            <div key={activity.id} style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                                border: '2px solid transparent'
                            }}
                                onClick={() => handlePlay(activity.id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.borderColor = '#E65100';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                <div>
                                    <h3 style={{
                                        margin: 0,
                                        color: '#1E3A8A',
                                        fontSize: '18px',
                                        fontWeight: '700'
                                    }}>
                                        {activity.name}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            background: '#FFF3E0',
                                            color: '#E65100',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontWeight: '600'
                                        }}>
                                            {activity.difficulty || 'Normal'}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                            {activity.questions ? `${activity.questions.length} rondas` : 'Juego rápido'}
                                        </span>
                                    </div>
                                </div>

                                <button style={{
                                    background: '#E65100',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    ▶
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/estudiante/actividades')}
                style={{
                    marginTop: '2rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#1E3A8A',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                ⬅ Volver a actividades
            </button>
        </div>
    );
}

export default IntrusoAccessPanel;
