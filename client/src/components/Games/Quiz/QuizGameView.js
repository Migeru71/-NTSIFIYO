// client/src/components/Games/Quiz/QuizGameView.js
// Vista de juego de Quiz para estudiantes
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import './Quiz.css';

function QuizGameView() {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const { currentGameData } = useGame();

    const [activity, setActivity] = useState(null);
    const [gameConfigs, setGameConfigs] = useState([{}, {}]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        if (!currentGameData) {
            setError("No hay datos de la actividad. Regresa al panel para iniciar.");
            setLoading(false);
            return;
        }

        // Read gameConfigs
        if (currentGameData.gameConfigs && currentGameData.gameConfigs.length >= 2) {
            const sorted = [...currentGameData.gameConfigs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setGameConfigs(sorted);
        }

        const mappedActivity = {
            name: "Centro de Quiz",
            recommendedXP: 100,
            questions: (currentGameData.questions || []).map((q, i) => ({
                id: i,
                question: q.question,
                word: q.word || null,
                options: (q.responseList || []).map((r, ri) => ({
                    id: ri,
                    text: r.answerText,
                    isCorrect: r.isCorrect,
                    word: r.word || null
                }))
            }))
        };

        if (mappedActivity.questions.length === 0) {
            setError("La actividad no tiene preguntas configuradas.");
            setLoading(false);
            return;
        }

        setActivity(mappedActivity);
        setError(null);
        setLoading(false);
    }, [currentGameData]);

    const currentQuestion = activity?.questions?.[currentQuestionIndex];
    const config1 = gameConfigs[0] || {};
    const config2 = gameConfigs[1] || {};

    // Helper: get display text
    const getWordText = (word, config) => {
        if (!word) return null;
        return config.isMazahua ? word.mazahuaWord : word.spanishWord;
    };

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => { });
        }
    };

    const handleAnswerSelect = (optionId) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(optionId);

        const isCorrect = currentQuestion.options.find(o => o.id === optionId)?.isCorrect || false;
        setAnswers(prev => [...prev, { questionId: currentQuestion.id, optionId, isCorrect }]);

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < activity.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswers([]);
        setScore(0);
        setShowResult(false);
    };

    const handleExit = () => {
        navigate('/games/quiz');
    };

    if (loading) {
        return (
            <div className="quiz-access-panel" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <p>⏳ Cargando quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-access-panel" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <p style={{ fontSize: '64px' }}>❓</p>
                <h2>{error}</h2>
                <button
                    className="btn-play-quiz"
                    onClick={handleExit}
                    style={{ maxWidth: '200px', margin: '1rem auto' }}
                >
                    Volver
                </button>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / activity.questions.length) * 100);
        const earnedXP = Math.round((score / activity.questions.length) * activity.recommendedXP);

        return (
            <div className="quiz-access-panel" style={{ textAlign: 'center', paddingTop: '3rem' }}>
                <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                    <span style={{ fontSize: '72px', display: 'block', marginBottom: '1rem' }}>
                        {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
                    </span>
                    <h1 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>
                        {percentage >= 70 ? '¡Excelente!' : percentage >= 50 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
                    </h1>
                    <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#7c3aed', margin: '1rem 0' }}>
                        {`${score}/${activity.questions.length}`}
                    </p>
                    <p style={{ color: '#6b7280' }}>{`${percentage}% de aciertos`}</p>
                    <div style={{ background: '#f3e8ff', borderRadius: '12px', padding: '1rem', margin: '1.5rem 0' }}>
                        <p style={{ color: '#7c3aed', fontWeight: '600' }}>{`+${earnedXP} XP ganados`}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={handleRestart}
                            style={{ padding: '12px 24px', background: 'white', border: '2px solid #7c3aed', borderRadius: '10px', color: '#7c3aed', fontWeight: '600', cursor: 'pointer' }}
                        >
                            🔄 Reintentar
                        </button>
                        <button className="btn-play-quiz" onClick={handleExit} style={{ maxWidth: '200px' }}>
                            ✓ Terminar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-access-panel">
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <button onClick={handleExit} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>←</button>
                    <span style={{ fontWeight: '600', color: '#5b21b6' }}>{activity.name}</span>
                    <span style={{ color: '#6b7280' }}>{`${currentQuestionIndex + 1}/${activity.questions.length}`}</span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '2rem' }}>
                    <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                        borderRadius: '3px',
                        width: `${((currentQuestionIndex + 1) / activity.questions.length) * 100}%`,
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {/* Question Card */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                    {/* Question stimulus — config1 */}
                    {config1.showImage && currentQuestion.word?.imageUrl && (
                        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            <img
                                src={currentQuestion.word.imageUrl}
                                alt="Pregunta"
                                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '12px', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {config1.playAudio && currentQuestion.word?.audioUrl && (
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <button
                                onClick={() => playAudio(currentQuestion.word.audioUrl)}
                                style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer' }}
                                title="Escuchar"
                            >🔊</button>
                        </div>
                    )}

                    {config1.showText && (
                        <h2 style={{ textAlign: 'center', color: '#1f2937', fontSize: '20px', marginBottom: '2rem' }}>
                            {currentQuestion.question || getWordText(currentQuestion.word, config1)}
                        </h2>
                    )}

                    {/* Options — config2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === option.id;
                            const showCorrect = selectedAnswer !== null && option.isCorrect;
                            const showWrong = isSelected && !option.isCorrect;

                            let bgColor = 'white';
                            let borderColor = '#e5e7eb';
                            if (showCorrect) { bgColor = '#f0fdf4'; borderColor = '#22c55e'; }
                            if (showWrong) { bgColor = '#fef2f2'; borderColor = '#ef4444'; }
                            if (isSelected && !showWrong && !showCorrect) { bgColor = '#f3e8ff'; borderColor = '#7c3aed'; }

                            const optionText = config2.showText
                                ? (option.text || getWordText(option.word, config2) || '')
                                : '';

                            // Skip entirely empty options (no text, no image, no audio)
                            const hasContent = optionText || (config2.showImage && option.word?.imageUrl) || (config2.playAudio && option.word?.audioUrl);
                            if (!hasContent) return null;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswerSelect(option.id)}
                                    disabled={selectedAnswer !== null}
                                    style={{
                                        padding: '1rem 1.25rem', background: bgColor,
                                        border: `2px solid ${borderColor}`, borderRadius: '12px',
                                        textAlign: 'left', cursor: selectedAnswer !== null ? 'default' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: showCorrect ? '#22c55e' : showWrong ? '#ef4444' : '#f3f4f6',
                                        color: (showCorrect || showWrong) ? 'white' : '#6b7280',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '600', fontSize: '14px', flexShrink: 0
                                    }}>
                                        {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + index)}
                                    </span>

                                    {config2.showImage && option.word?.imageUrl && (
                                        <img src={option.word.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                    )}

                                    {config2.showText && (
                                        <span style={{ fontWeight: '500', color: '#374151', flex: 1 }}>{optionText}</span>
                                    )}

                                    {config2.playAudio && option.word?.audioUrl && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); playAudio(option.word.audioUrl); }}
                                            style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                                        >🔊</button>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next button */}
                    {selectedAnswer !== null && (
                        <button
                            onClick={handleNextQuestion}
                            className="btn-play-quiz"
                            style={{ marginTop: '1.5rem', width: '100%' }}
                        >
                            {currentQuestionIndex < activity.questions.length - 1 ? 'Siguiente →' : 'Ver Resultados'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuizGameView;
