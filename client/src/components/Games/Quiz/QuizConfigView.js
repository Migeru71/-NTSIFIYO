// client/src/components/Games/Quiz/QuizConfigView.js
// Vista de configuración para crear Quiz con validación propia
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mockQuiz from '../../../data/mockQuiz';
import './Quiz.css';

const QuizConfigView = ({ onActivityCreated }) => {
    const navigate = useNavigate();
    const imageInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', description: '', difficulty: 'medio', categoryId: ''
    });

    const [questions, setQuestions] = useState([{
        id: 1, question: '', questionLang: 'ESP', image: null,
        options: [
            { id: 1, text: '', isCorrect: true },
            { id: 2, text: '', isCorrect: false },
            { id: 3, text: '', isCorrect: false },
            { id: 4, text: '', isCorrect: false }
        ]
    }]);

    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [activeImageUpload, setActiveImageUpload] = useState(null);
    const [categories, setCategories] = useState([]);
    const [recommendedXP, setRecommendedXP] = useState(150);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [difficultyLevel, setDifficultyLevel] = useState(3);

    useEffect(() => { setCategories(mockQuiz.getAllCategories()); }, []);

    useEffect(() => {
        const xp = mockQuiz.calculateXP(formData.difficulty, questions.length);
        setRecommendedXP(xp);
    }, [formData.difficulty, questions.length]);

    useEffect(() => {
        const difficultyMap = { 1: 'fácil', 2: 'fácil', 3: 'medio', 4: 'difícil', 5: 'difícil' };
        setFormData(prev => ({ ...prev, difficulty: difficultyMap[difficultyLevel] }));
    }, [difficultyLevel]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categoryId' && value === 'new') {
            setShowNewCategory(true);
            setFormData(prev => ({ ...prev, categoryId: '' }));
        } else {
            setShowNewCategory(false);
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleQuestionChange = (questionId, field, value) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, [field]: value } : q
        ));
    };

    const handleOptionChange = (questionId, optionId, field, value) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.options.map(opt => {
                    if (opt.id === optionId) return { ...opt, [field]: value };
                    if (field === 'isCorrect' && value === true && opt.id !== optionId) return { ...opt, isCorrect: false };
                    return opt;
                });
                return { ...q, options: updatedOptions };
            }
            return q;
        }));
    };

    const addQuestion = () => {
        const newId = Math.max(...questions.map(q => q.id), 0) + 1;
        setQuestions(prev => [...prev, {
            id: newId, question: '', questionLang: 'ESP', image: null,
            options: [
                { id: 1, text: '', isCorrect: true },
                { id: 2, text: '', isCorrect: false },
                { id: 3, text: '', isCorrect: false },
                { id: 4, text: '', isCorrect: false }
            ]
        }]);
    };

    const removeQuestion = (id) => {
        if (questions.length > 1) setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !activeImageUpload) return;
        const reader = new FileReader();
        reader.onload = () => {
            setQuestions(prev => prev.map(q =>
                q.id === activeImageUpload ? { ...q, image: reader.result } : q
            ));
        };
        reader.readAsDataURL(file);
        setActiveImageUpload(null);
    };

    const triggerImageUpload = (questionId) => {
        setActiveImageUpload(questionId);
        imageInputRef.current?.click();
    };

    const removeImage = (questionId) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, image: null } : q
        ));
    };

    const handleSubmit = async () => {
        setError(null); setSuccess(null); setLoading(true);

        const activityData = {
            name: formData.name, description: formData.description,
            difficulty: formData.difficulty, recommendedXP,
            questions: questions.map(q => ({ ...q, options: q.options.filter(o => o.text.trim()) }))
        };

        const validation = mockQuiz.validateQuizActivity(activityData);
        if (!validation.isValid) { setError(validation.errors.join('. ')); setLoading(false); return; }

        try {
            let result;
            if (showNewCategory && newCategoryName.trim()) {
                result = mockQuiz.createActivityWithCategory(activityData, newCategoryName.trim());
                setCategories(mockQuiz.getAllCategories());
            } else {
                result = mockQuiz.createActivity(activityData);
            }

            if (result.success === false) {
                setError(result.errors?.join('. ') || 'Error al crear');
            } else {
                setSuccess('✅ Quiz creado exitosamente');
                if (onActivityCreated) onActivityCreated(result.activity);
                setTimeout(() => navigate('/games/quiz'), 2000);
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate('/games/quiz');

    const getValidQuestionCount = () => {
        return questions.filter(q =>
            q.question.trim() &&
            q.options.filter(o => o.text.trim()).length >= 2 &&
            q.options.some(o => o.isCorrect)
        ).length;
    };

    return (
        <div className="quiz-config-container">
            {/* Hidden input */}
            <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

            {/* Header */}
            <header className="quiz-config-header">
                <div className="quiz-header-left">
                    <div className="quiz-header-logo">❓</div>
                    <span className="quiz-header-title">Quiz Studio</span>
                </div>
                <button
                    className="btn-quiz-save"
                    onClick={handleSubmit}
                    disabled={loading || getValidQuestionCount() < 1}
                >
                    {loading ? '⏳ Guardando...' : '📤 Publicar Quiz'}
                </button>
            </header>

            {/* Main */}
            <main className="quiz-config-main">
                {/* Sidebar */}
                <aside className="quiz-sidebar">
                    <div className="quiz-sidebar-section">
                        <h3 className="quiz-sidebar-title">Configuración General</h3>
                        <div className="quiz-input-group">
                            <label className="quiz-input-label">Nombre del Quiz</label>
                            <input type="text" className="quiz-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="ej: Quiz de Animales" />
                        </div>
                        <div className="quiz-input-group">
                            <label className="quiz-input-label">Descripción</label>
                            <textarea className="quiz-textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Descripción del quiz..." />
                        </div>
                    </div>

                    <div className="quiz-sidebar-section">
                        <h3 className="quiz-sidebar-title">Puntuación</h3>
                        <div className="quiz-xp-box">
                            <div className="quiz-xp-label">XP Recomendado</div>
                            <div className="quiz-xp-value">{`${recommendedXP} XP`}</div>
                            <p style={{ fontSize: '12px', color: '#7c3aed', marginTop: '0.5rem' }}>
                                {`Basado en ${questions.length} pregunta(s)`}
                            </p>
                        </div>
                    </div>

                    <div className="quiz-sidebar-section">
                        <h3 className="quiz-sidebar-title">Dificultad</h3>
                        <input type="range" style={{ width: '100%' }} min={1} max={5} value={difficultyLevel} onChange={(e) => setDifficultyLevel(parseInt(e.target.value))} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                            <span>Fácil</span><span>Medio</span><span>Difícil</span>
                        </div>
                    </div>

                    <div className="quiz-sidebar-section">
                        <h3 className="quiz-sidebar-title">Categoría</h3>
                        <select className="quiz-input" name="categoryId" value={showNewCategory ? 'new' : formData.categoryId} onChange={handleInputChange}>
                            <option value="">-- Seleccionar --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            <option value="new">+ Nueva Categoría</option>
                        </select>
                        {showNewCategory && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <input type="text" className="quiz-input" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nombre de la categoría" />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Content */}
                <section className="quiz-content">
                    <div className="quiz-content-wrapper">
                        <div className="quiz-content-header">
                            <h2 className="quiz-content-title">Configuración de Preguntas</h2>
                            <p className="quiz-content-subtitle">Cada pregunta debe tener al menos 2 opciones y 1 respuesta correcta.</p>
                        </div>

                        {/* Error/Success */}
                        {(error || success) && (
                            <div className={`quiz-validation-alert ${error ? 'error' : 'success'}`}>
                                <span>{error ? '⚠️' : '✅'}</span>
                                <span>{error || success}</span>
                            </div>
                        )}

                        {/* Questions */}
                        {questions.map((question, qIndex) => (
                            <div key={question.id} className="quiz-question-card">
                                <div className="quiz-question-header">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className="quiz-question-number">{qIndex + 1}</span>
                                        <span className="quiz-question-label">Pregunta</span>
                                    </div>
                                    <button onClick={() => removeQuestion(question.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                                </div>
                                <div className="quiz-question-content">
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="text" className="quiz-question-input"
                                                placeholder="Escribe tu pregunta aquí..."
                                                value={question.question}
                                                onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {question.image ? (
                                                <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '2px solid #e5e7eb' }}>
                                                    <img src={question.image} alt="Q" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button
                                                        onClick={() => removeImage(question.id)}
                                                        style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: 'white', border: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '12px' }}
                                                    >×</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => triggerImageUpload(question.id)}
                                                    style={{ width: '80px', height: '80px', borderRadius: '10px', border: '2px dashed #d1d5db', background: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    <span>🖼️</span>
                                                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>Imagen</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="quiz-options-grid">
                                        {question.options.map((option, oIndex) => (
                                            <div key={option.id} className={`quiz-option-card ${option.isCorrect ? 'correct' : ''}`}>
                                                <div className="quiz-option-header">
                                                    <span className="quiz-option-label">{`Opción ${oIndex + 1}`}</span>
                                                    <div
                                                        className={`quiz-toggle ${option.isCorrect ? 'active' : ''}`}
                                                        onClick={() => handleOptionChange(question.id, option.id, 'isCorrect', !option.isCorrect)}
                                                    >
                                                        <span className="quiz-toggle-label">Correcta</span>
                                                        <div className="quiz-toggle-switch" />
                                                    </div>
                                                </div>
                                                <input
                                                    type="text" className="quiz-option-input"
                                                    placeholder="Respuesta..."
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add question button */}
                        <button className="btn-add-quiz-question" onClick={addQuestion}>
                            <span className="btn-add-quiz-question-icon">+</span>
                            <span className="btn-add-quiz-question-label">Agregar Nueva Pregunta</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="quiz-footer">
                <div className="quiz-footer-info">
                    <strong>{getValidQuestionCount()}</strong> pregunta(s) válida(s)
                </div>
                <div className="quiz-footer-actions">
                    <button className="btn-quiz-cancel" onClick={handleCancel}>Cancelar</button>
                    <button className="btn-quiz-save" onClick={handleSubmit} disabled={loading || getValidQuestionCount() < 1}>
                        {loading ? 'Guardando...' : 'Guardar Quiz →'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default QuizConfigView;
