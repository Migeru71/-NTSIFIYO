// client/src/components/Games/Intruso/IntrusoFinalView.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Intruso.css';

const IntrusoFinalView = ({ score, stats, onRetry, onExit }) => {
    const navigate = useNavigate();
    const isNewRecord = score > 1000; // Mock logic

    return (
        <div className="intruso-container" style={{ justifyContent: 'center' }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                <div style={{ position: 'relative', height: '40px', marginBottom: '1rem' }}>
                    <button
                        onClick={onExit}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#6B7280'
                        }}
                    >
                        ✕
                    </button>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#374151', lineHeight: '40px' }}>
                        ¡Juego Terminado!
                    </h2>
                </div>

                <p style={{
                    color: '#E65100',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                }}>
                    Puntuación Final
                </p>

                <h1 style={{
                    fontSize: '56px',
                    color: '#E65100',
                    margin: '0 0 1rem 0',
                    lineHeight: 1
                }}>
                    {score.toLocaleString()}
                </h1>

                {isNewRecord && (
                    <div style={{
                        background: '#DCFCE7',
                        color: '#15803D',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '700',
                        fontSize: '14px',
                        marginBottom: '2rem'
                    }}>
                        🏆 ¡Nuevo récord!
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        flex: 1,
                        background: '#F9FAFB',
                        padding: '1rem',
                        borderRadius: '16px',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', color: '#6B7280', fontSize: '12px', fontWeight: '600' }}>
                            <span style={{ color: '#E65100' }}>✔</span> Aciertos
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                            {stats.correct || 0}
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        background: '#F9FAFB',
                        padding: '1rem',
                        borderRadius: '16px',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', color: '#6B7280', fontSize: '12px', fontWeight: '600' }}>
                            <span style={{ color: '#E65100' }}>⏱</span> Tiempo
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                            00:45
                        </div>
                    </div>
                </div>

                {/* Accuracy / Additional Stats Area */}
                <div style={{
                    background: '#F9FAFB',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    textAlign: 'left'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Precisión</p>
                            <p style={{ fontSize: '28px', fontWeight: '800', color: '#1F2937' }}>
                                {stats.totalQuestions > 0 ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0}%
                            </p>
                        </div>
                        <div style={{ fontSize: '20px', color: '#E65100' }}>
                            ★★★★☆
                        </div>
                    </div>
                </div>

                {/* Play Again Button */}
                <button
                    onClick={onRetry}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#E65100',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(230, 81, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    🔄 Jugar de nuevo
                </button>
            </div>
        </div>
    );
};

export default IntrusoFinalView;
