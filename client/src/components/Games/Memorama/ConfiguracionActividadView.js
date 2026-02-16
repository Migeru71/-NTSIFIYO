// client/src/components/Games/Memorama/ConfiguracionActividadView.js
// Vista de configuración de actividades con estilo EduCreator Studio
// Incluye: Word Pairs mode, Quiz mode, creación de categorías, upload de media
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ActivityService from '../../../services/ActivityService';
import ExperienceService from '../../../services/ExperienceService';
import mockGames from '../../../data/mockGames';
import mockQuiz from '../../../data/mockQuiz';
import './Memorama.css';

const ConfiguracionActividadView = ({ onActivityCreated }) => {
    const navigate = useNavigate();
    const { editId } = useParams();
    const imageInputRef = useRef(null);
    const audioInputRef = useRef(null);

    // Estado del formulario principal
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        difficulty: 'medio',
        categoryId: '',
        mediaType: 'Imagen',
        language: 'ESP'
    });

    // Estado para word pairs (Word Pairs mode)
    const [wordPairs, setWordPairs] = useState([
        { id: 1, stimulus: '', response: '', stimulusLang: 'ESP', responseLang: 'MAZ', image: null, audio: null, isComplete: false }
    ]);

    // Estado para quiz questions (Quiz mode)
    const [quizQuestions, setQuizQuestions] = useState([
        {
            id: 1,
            question: '',
            questionLang: 'ESP',
            image: null,
            audio: null,
            answerFormat: 'text',
            answerLang: 'ESP',
            options: [
                { id: 1, text: '', isCorrect: true },
                { id: 2, text: '', isCorrect: false },
                { id: 3, text: '', isCorrect: false },
                { id: 4, text: '', isCorrect: false }
            ]
        }
    ]);

    // Estado del modo de actividad
    const [activityMode, setActivityMode] = useState('wordPairs');

    // Estado para nueva categoría
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Estado para media upload activo
    const [activeMediaUpload, setActiveMediaUpload] = useState({ type: null, itemId: null, field: null });

    const [categories, setCategories] = useState([]);
    const [recommendedXP, setRecommendedXP] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [difficultyLevel, setDifficultyLevel] = useState(3);

    useEffect(() => {
        setCategories(mockGames.getAllCategories());

        // Cargar datos si estamos en modo edición
        if (editId) {
            loadActivityForEdit(editId);
        }
    }, [editId]);

    const loadActivityForEdit = (id) => {
        setLoading(true);
        // Intentar encontrar en mockGames (Memorama)
        const memoramaActivity = mockGames.getActivity(parseInt(id));

        if (memoramaActivity) {
            console.log('✏️ Editando Memorama:', memoramaActivity.name);
            setActivityMode('wordPairs');
            setFormData({
                name: memoramaActivity.name,
                description: memoramaActivity.description || '',
                difficulty: memoramaActivity.difficulty,
                categoryId: memoramaActivity.categoryId,
                mediaType: 'Imagen',
                language: 'ESP'
            });

            // Map pairs to component structure
            if (memoramaActivity.pairs) {
                setWordPairs(memoramaActivity.pairs.map(p => ({
                    id: p.id,
                    stimulus: p.spanish,
                    response: p.mazahua,
                    stimulusLang: 'ESP',
                    responseLang: 'MAZ',
                    image: p.image,
                    audio: p.audio,
                    isComplete: true
                })));
            }
            setLoading(false);
            return;
        }

        // Intentar encontrar en mockQuiz (Quiz)
        const quizActivity = mockQuiz.getActivity(parseInt(id));
        if (quizActivity) {
            console.log('✏️ Editando Quiz:', quizActivity.name);
            setActivityMode('quiz');
            setFormData({
                name: quizActivity.name,
                description: quizActivity.description || '',
                difficulty: quizActivity.difficulty,
                categoryId: quizActivity.categoryId,
                mediaType: 'Imagen',
                language: 'ESP'
            });

            if (quizActivity.questions) {
                setQuizQuestions(quizActivity.questions.map(q => ({
                    ...q,
                    // Asegurar estructura
                    options: q.options || []
                })));
            }
            setLoading(false);
            return;
        }

        setError('Actividad no encontrada');
        setLoading(false);
    };

    useEffect(() => {
        const calculateXP = async () => {
            if (formData.difficulty && formData.mediaType) {
                const xp = await ExperienceService.calculateRecommendedXP(
                    formData.difficulty,
                    formData.mediaType
                );
                setRecommendedXP(xp);
            }
        };
        calculateXP();
    }, [formData.difficulty, formData.mediaType]);

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

    // ========== WORD PAIRS HANDLERS ==========
    const handleWordPairChange = (id, field, value) => {
        setWordPairs(prev => prev.map(pair =>
            pair.id === id ? { ...pair, [field]: value } : pair
        ));
    };

    const addWordPair = () => {
        const newId = Math.max(...wordPairs.map(p => p.id), 0) + 1;
        setWordPairs(prev => [...prev, {
            id: newId, stimulus: '', response: '', stimulusLang: 'ESP', responseLang: 'MAZ',
            image: null, audio: null, isComplete: false
        }]);
    };

    const removeWordPair = (id) => {
        if (wordPairs.length > 1) {
            setWordPairs(prev => prev.filter(pair => pair.id !== id));
        }
    };

    // ========== QUIZ HANDLERS ==========
    const handleQuizQuestionChange = (questionId, field, value) => {
        setQuizQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, [field]: value } : q
        ));
    };

    const handleQuizOptionChange = (questionId, optionId, field, value) => {
        setQuizQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.options.map(opt => {
                    if (opt.id === optionId) {
                        return { ...opt, [field]: value };
                    }
                    // Si marcamos una opción como correcta, desmarcamos las demás
                    if (field === 'isCorrect' && value === true && opt.id !== optionId) {
                        return { ...opt, isCorrect: false };
                    }
                    return opt;
                });
                return { ...q, options: updatedOptions };
            }
            return q;
        }));
    };

    const addQuizQuestion = () => {
        const newId = Math.max(...quizQuestions.map(q => q.id), 0) + 1;
        setQuizQuestions(prev => [...prev, {
            id: newId, question: '', questionLang: 'ESP', image: null, audio: null,
            answerFormat: 'text', answerLang: 'ESP',
            options: [
                { id: 1, text: '', isCorrect: true },
                { id: 2, text: '', isCorrect: false },
                { id: 3, text: '', isCorrect: false },
                { id: 4, text: '', isCorrect: false }
            ]
        }]);
    };

    const removeQuizQuestion = (id) => {
        if (quizQuestions.length > 1) {
            setQuizQuestions(prev => prev.filter(q => q.id !== id));
        }
    };

    // ========== MEDIA HANDLERS ==========
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await mockGames.fileToBase64(file);
            mockGames.saveImage(base64);

            if (activeMediaUpload.type === 'wordPair') {
                setWordPairs(prev => prev.map(p =>
                    p.id === activeMediaUpload.itemId ? { ...p, image: base64 } : p
                ));
            } else if (activeMediaUpload.type === 'quiz') {
                setQuizQuestions(prev => prev.map(q =>
                    q.id === activeMediaUpload.itemId ? { ...q, image: base64 } : q
                ));
            }
        } catch (err) {
            console.error('Error uploading image:', err);
        }
        setActiveMediaUpload({ type: null, itemId: null, field: null });
    };

    const handleAudioUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await mockGames.fileToBase64(file);
            mockGames.saveAudio(base64);

            if (activeMediaUpload.type === 'wordPair') {
                setWordPairs(prev => prev.map(p =>
                    p.id === activeMediaUpload.itemId ? { ...p, audio: base64 } : p
                ));
            } else if (activeMediaUpload.type === 'quiz') {
                setQuizQuestions(prev => prev.map(q =>
                    q.id === activeMediaUpload.itemId ? { ...q, audio: base64 } : q
                ));
            }
        } catch (err) {
            console.error('Error uploading audio:', err);
        }
        setActiveMediaUpload({ type: null, itemId: null, field: null });
    };

    const triggerImageUpload = (type, itemId) => {
        setActiveMediaUpload({ type, itemId, field: 'image' });
        imageInputRef.current?.click();
    };

    const triggerAudioUpload = (type, itemId) => {
        setActiveMediaUpload({ type, itemId, field: 'audio' });
        audioInputRef.current?.click();
    };

    const removeMedia = (type, itemId, field) => {
        if (type === 'wordPair') {
            setWordPairs(prev => prev.map(p =>
                p.id === itemId ? { ...p, [field]: null } : p
            ));
        } else if (type === 'quiz') {
            setQuizQuestions(prev => prev.map(q =>
                q.id === itemId ? { ...q, [field]: null } : q
            ));
        }
    };

    // ========== SUBMIT ==========
    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            let result;

            // Crear o Actualizar
            const isEdit = !!editId;
            const targetId = isEdit ? parseInt(editId) : null;

            // QUIZ MODE
            if (activityMode === 'quiz') {
                const quizData = {
                    name: formData.name,
                    description: formData.description,
                    difficulty: formData.difficulty,
                    recommendedXP,
                    questions: quizQuestions.map(q => ({
                        ...q,
                        options: q.options.filter(o => o.text.trim())
                    }))
                };

                const validation = mockQuiz.validateQuizActivity(quizData);
                if (!validation.isValid) {
                    setError(validation.errors.join('. '));
                    setLoading(false);
                    return;
                }

                if (isEdit) {
                    result = mockQuiz.updateActivity(targetId, quizData);
                } else {
                    if (showNewCategory && newCategoryName.trim()) {
                        result = mockQuiz.createActivityWithCategory(quizData, newCategoryName.trim());
                    } else {
                        result = mockQuiz.createActivity(quizData);
                    }
                }

                if (result.success === false) {
                    setError(result.errors?.join('. ') || result.error || 'Error al guardar quiz');
                    setLoading(false);
                    return;
                }

                setSuccess(isEdit ? '✅ Quiz actualizado exitosamente' : '✅ Quiz creado exitosamente');
                if (onActivityCreated) {
                    onActivityCreated(result.activity);
                }
                setTimeout(() => {
                    setSuccess(null);
                    navigate(isEdit ? '/games/quiz' : '/games/memorama');
                }, 2000);

            } else {
                // WORD PAIRS MODE
                const activityData = {
                    name: formData.name,
                    description: formData.description,
                    difficulty: formData.difficulty,
                    activityMode: activityMode,
                    recommendedXP,
                    wordPairs: wordPairs.filter(p => p.stimulus && p.response)
                };

                if (isEdit) {
                    const updatedPairs = activityData.wordPairs.map((wp, index) => ({
                        id: index + 1,
                        spanish: wp.stimulus,
                        mazahua: wp.response,
                        image: wp.image || null,
                        audio: wp.audio || null
                    }));

                    result = mockGames.updateActivity(targetId, {
                        ...activityData,
                        pairs: updatedPairs
                    });

                } else {
                    if (showNewCategory && newCategoryName.trim()) {
                        result = mockGames.createActivityWithCategory(activityData, newCategoryName.trim());
                        setCategories(mockGames.getAllCategories());
                    } else {
                        const response = await ActivityService.createActivity({
                            ...formData,
                            activityMode,
                            recommendedXP,
                            wordPairs: activityData.wordPairs,
                        });

                        if (!response.success) {
                            setError(response.error);
                            setLoading(false);
                            return;
                        }
                        result = response;
                    }
                }

                if (result.success === false && result.error) {
                    setError(result.error);
                    setLoading(false);
                    return;
                }

                setSuccess(isEdit ? '✅ Actividad actualizada exitosamente' : '✅ Actividad creada exitosamente');
                if (onActivityCreated) {
                    onActivityCreated(result.activity);
                }
                setTimeout(() => {
                    setSuccess(null);
                    navigate(isEdit ? '/games/memorama' : '/games/memorama');
                }, 2000);
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate('/games/memorama');

    const getItemCount = () => {
        if (activityMode === 'wordPairs') {
            return wordPairs.filter(p => p.stimulus && p.response).length;
        }
        return quizQuestions.filter(q => q.question && q.options.some(o => o.text)).length;
    };

    // ========== RENDER WORD PAIRS MODE ==========
    const renderWordPairsContent = () => (
        <div className="word-pair-list">
            {wordPairs.map((pair, index) => (
                <div key={pair.id} className={`word-pair-card ${(!pair.stimulus || !pair.response) ? 'incomplete' : ''}`}>
                    <div className="word-pair-header">
                        <div className="word-pair-header-left">
                            <span className="word-pair-number">{index + 1}</span>
                            <h3 className="word-pair-title">
                                {pair.stimulus ? `Par: "${pair.stimulus}"` : 'Nuevo Elemento'}
                            </h3>
                        </div>
                        <div className="word-pair-header-right">
                            {(!pair.stimulus || !pair.response) && (
                                <span className="word-pair-status">Incompleto</span>
                            )}
                            <button className="word-pair-action delete" onClick={() => removeWordPair(pair.id)}>
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div className="word-pair-content">
                        <div className="word-pair-divider" />
                        {/* Estímulo */}
                        <div className="word-pair-side">
                            <div className="word-pair-side-header">
                                <span className="word-pair-side-label">Estímulo</span>
                                <select
                                    className="word-pair-lang-select"
                                    value={pair.stimulusLang}
                                    onChange={(e) => handleWordPairChange(pair.id, 'stimulusLang', e.target.value)}
                                >
                                    <option value="ESP">ESP</option>
                                    <option value="MAZ">MAZ</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                className="word-pair-input"
                                placeholder="Escribe la palabra..."
                                value={pair.stimulus}
                                onChange={(e) => handleWordPairChange(pair.id, 'stimulus', e.target.value)}
                            />
                            <div className="word-pair-media">
                                {pair.image ? (
                                    <div className="media-preview">
                                        <img src={pair.image} alt="preview" />
                                        <button className="media-preview-remove" onClick={() => removeMedia('wordPair', pair.id, 'image')}>
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <button className="media-btn" onClick={() => triggerImageUpload('wordPair', pair.id)}>
                                        <span className="media-btn-icon">🖼️</span>
                                        <span className="media-btn-label">Imagen</span>
                                    </button>
                                )}
                                <button className="media-btn" onClick={() => triggerAudioUpload('wordPair', pair.id)}>
                                    <span className="media-btn-icon">🎤</span>
                                    <span className="media-btn-label">{pair.audio ? '✓' : 'Audio'}</span>
                                </button>
                            </div>
                        </div>
                        {/* Respuesta */}
                        <div className="word-pair-side">
                            <div className="word-pair-side-header">
                                <span className="word-pair-side-label">Respuesta</span>
                                <select
                                    className="word-pair-lang-select"
                                    value={pair.responseLang}
                                    onChange={(e) => handleWordPairChange(pair.id, 'responseLang', e.target.value)}
                                >
                                    <option value="MAZ">MAZ</option>
                                    <option value="ESP">ESP</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                className={`word-pair-input ${pair.response ? 'correct' : ''}`}
                                placeholder="Respuesta correcta..."
                                value={pair.response}
                                onChange={(e) => handleWordPairChange(pair.id, 'response', e.target.value)}
                            />
                            {pair.response && (
                                <div className="audio-player">
                                    <span className="audio-status">CORRECTO</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn-add-card" onClick={addWordPair}>
                <span className="btn-add-card-icon">+</span>
                <span className="btn-add-card-label">Agregar Nuevo Par</span>
            </button>
        </div>
    );

    // ========== RENDER QUIZ MODE ==========
    const renderQuizContent = () => (
        <div className="quiz-question-list">
            {/* Mode Alert */}
            <div className="mode-alert">
                <span className="mode-alert-icon">⚠️</span>
                <div>
                    <h4 className="mode-alert-title">Modo Quiz</h4>
                    <p className="mode-alert-text">
                        Cada ítem consiste en una pregunta y múltiples opciones de respuesta.
                    </p>
                </div>
            </div>

            {/* Questions */}
            {quizQuestions.map((question, qIndex) => (
                <div key={question.id} className="quiz-card">
                    <div className="quiz-card-header">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="quiz-card-number">{qIndex + 1}</span>
                            <span className="quiz-card-title">Configuración de Pregunta</span>
                        </div>
                        <button className="word-pair-action delete" onClick={() => removeQuizQuestion(question.id)}>
                            🗑️
                        </button>
                    </div>
                    <div className="quiz-card-content">
                        {/* Question Stimulus */}
                        <div className="question-stimulus-section">
                            <div className="question-stimulus-header">
                                <span className="question-stimulus-label">❓ Estímulo de Pregunta</span>
                                <div className="question-lang-select">
                                    <span>Idioma:</span>
                                    <select
                                        value={question.questionLang}
                                        onChange={(e) => handleQuizQuestionChange(question.id, 'questionLang', e.target.value)}
                                    >
                                        <option value="ESP">ESP (Español)</option>
                                        <option value="MAZ">MAZ (Mazahua)</option>
                                        <option value="ENG">ENG (Inglés)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="question-stimulus-content">
                                <div className="question-input-area">
                                    <input
                                        type="text"
                                        className="question-input"
                                        placeholder="Escribe tu pregunta aquí..."
                                        value={question.question}
                                        onChange={(e) => handleQuizQuestionChange(question.id, 'question', e.target.value)}
                                    />
                                </div>
                                <div className="question-media-area">
                                    {question.image ? (
                                        <div className="question-media-preview">
                                            <img src={question.image} alt="Question" />
                                            <span className="media-type-badge">Imagen</span>
                                            <button
                                                className="remove-media-btn"
                                                onClick={() => removeMedia('quiz', question.id, 'image')}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="add-media-btn" onClick={() => triggerImageUpload('quiz', question.id)}>
                                            <span className="add-media-icon">🖼️</span>
                                            <span className="add-media-label">Imagen</span>
                                        </button>
                                    )}
                                    <button className="add-media-btn" onClick={() => triggerAudioUpload('quiz', question.id)}>
                                        <span className="add-media-icon">{question.audio ? '✓' : '🎤'}</span>
                                        <span className="add-media-label">{question.audio ? 'Audio ✓' : 'Audio'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Answer Configuration */}
                        <div className="answer-config-section">
                            <div className="answer-config-divider">
                                <span>Configuración de Respuestas</span>
                            </div>
                            <div className="answer-format-bar">
                                <div className="answer-format-left">
                                    <span className="answer-format-label">Formato:</span>
                                    <div className="answer-format-options">
                                        {['text', 'images', 'audio', 'mixed'].map(format => (
                                            <button
                                                key={format}
                                                className={`format-option-btn ${question.answerFormat === format ? 'active' : ''}`}
                                                onClick={() => handleQuizQuestionChange(question.id, 'answerFormat', format)}
                                            >
                                                {format.charAt(0).toUpperCase() + format.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="answer-format-right">
                                    <span>Idioma:</span>
                                    <select
                                        className="word-pair-lang-select"
                                        value={question.answerLang}
                                        onChange={(e) => handleQuizQuestionChange(question.id, 'answerLang', e.target.value)}
                                    >
                                        <option value="ESP">ESP</option>
                                        <option value="MAZ">MAZ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="answer-options-grid">
                                {question.options.map((option, oIndex) => (
                                    <div key={option.id} className={`answer-option-card ${option.isCorrect ? 'correct' : ''}`}>
                                        <div className="answer-option-header">
                                            <span className="answer-option-label">
                                                {`Opción ${oIndex + 1}`}
                                            </span>
                                            <div
                                                className={`toggle-correct ${option.isCorrect ? 'active' : ''}`}
                                                onClick={() => handleQuizOptionChange(question.id, option.id, 'isCorrect', !option.isCorrect)}
                                            >
                                                <span>Correcta</span>
                                                <div className={`toggle-switch ${option.isCorrect ? 'active' : ''}`} />
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="answer-option-input"
                                            placeholder="Texto de respuesta..."
                                            value={option.text}
                                            onChange={(e) => handleQuizOptionChange(question.id, option.id, 'text', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button className="btn-add-question" onClick={addQuizQuestion}>
                <span className="btn-add-question-icon">+</span>
                <span className="btn-add-question-label">Agregar Nueva Pregunta</span>
            </button>
        </div>
    );

    // ========== MAIN RENDER ==========
    return (
        <div className="educreator-container">
            {/* Hidden file inputs */}
            <input
                type="file"
                ref={imageInputRef}
                className="file-upload-hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <input
                type="file"
                ref={audioInputRef}
                className="file-upload-hidden"
                accept="audio/*"
                onChange={handleAudioUpload}
            />

            {/* Header */}
            <header className="educreator-header">
                <div className="header-left">
                    <div className="header-logo">📚</div>
                    <h1 className="header-title">MazahuaConnect Studio</h1>
                    <span className="header-version">v1.1</span>
                </div>
                <div className="header-right">
                    <div className="header-status">
                        <span className="header-status-icon">☁️</span>
                        <span>Guardado</span>
                    </div>
                    <button
                        className="btn-publish"
                        onClick={handleSubmit}
                        disabled={loading || getItemCount() < 1}
                    >
                        {loading ? '⏳ Publicando...' : '📤 Publicar'}
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="educreator-main">
                {/* Sidebar */}
                <aside className="educreator-sidebar">
                    {/* General Config */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Configuración General</h3>
                        <div className="sidebar-input-group">
                            <label className="sidebar-label">Nombre</label>
                            <input
                                type="text"
                                className="sidebar-input"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="ej: Quiz de Animales"
                            />
                        </div>
                        <div className="sidebar-input-group">
                            <label className="sidebar-label">Descripción</label>
                            <textarea
                                className="sidebar-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Descripción de la actividad..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* XP Box */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Complejidad &amp; Puntuación</h3>
                        <div className="xp-box">
                            <div className="xp-box-header">
                                <span className="xp-box-title">XP Recomendado</span>
                                <span className="xp-box-icon">✨</span>
                            </div>
                            <div className="xp-box-value">
                                {recommendedXP ? `${recommendedXP} XP` : '-- XP'}
                            </div>
                            <p className="xp-box-description">Basado en cantidad y variedad.</p>
                            <hr className="xp-box-divider" />
                            <label className="difficulty-slider-label">Dificultad</label>
                            <input
                                type="range"
                                className="difficulty-slider"
                                min={1}
                                max={5}
                                value={difficultyLevel}
                                onChange={(e) => setDifficultyLevel(parseInt(e.target.value))}
                            />
                            <div className="difficulty-labels">
                                <span>Fácil</span>
                                <span>Medio</span>
                                <span>Difícil</span>
                            </div>
                        </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Modo de Actividad</h3>
                        <div className="mode-selector">
                            <button
                                className={`mode-btn ${activityMode === 'wordPairs' ? 'active' : ''}`}
                                onClick={() => setActivityMode('wordPairs')}
                            >
                                <span className="mode-btn-icon">🔀</span>
                                <span className="mode-btn-label">Pares</span>
                            </button>
                            <button
                                className={`mode-btn ${activityMode === 'quiz' ? 'active' : ''}`}
                                onClick={() => setActivityMode('quiz')}
                            >
                                <span className="mode-btn-icon">❓</span>
                                <span className="mode-btn-label">Quiz</span>
                            </button>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Categoría</h3>
                        <select
                            className="sidebar-input"
                            name="categoryId"
                            value={showNewCategory ? 'new' : formData.categoryId}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Seleccionar --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            <option value="new">+ Nueva Categoría</option>
                        </select>
                        {showNewCategory && (
                            <div className="new-category-input-container">
                                <label className="new-category-input-label">Nombre de la nueva categoría</label>
                                <input
                                    type="text"
                                    className="new-category-input"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="ej: Animales de Granja"
                                />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Content */}
                <section className="educreator-content">
                    <div className="content-wrapper">
                        <div className="content-header">
                            <div>
                                <h2 className="content-title">
                                    {activityMode === 'quiz' ? 'Configuración de Quiz' : 'Configuración de Contenido'}
                                </h2>
                                <p className="content-subtitle">
                                    {activityMode === 'quiz'
                                        ? 'Diseña tus preguntas y define las opciones de respuesta.'
                                        : 'Configura tus pares de palabras y recursos multimedia.'}
                                </p>
                            </div>
                        </div>

                        {(error || success) && (
                            <div
                                className="validation-alert"
                                style={success ? { background: '#f0fdf4', borderColor: '#86efac' } : {}}
                            >
                                <span className="validation-alert-icon">{success ? '✅' : '⚠️'}</span>
                                <div>
                                    <p className="validation-alert-text">{error || success}</p>
                                </div>
                            </div>
                        )}

                        {activityMode === 'quiz' ? renderQuizContent() : renderWordPairsContent()}

                        <div style={{ height: '80px' }} />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="educreator-footer">
                <div className="footer-info">
                    <strong>{`${getItemCount()} ${activityMode === 'quiz' ? 'preguntas' : 'pares'}`}</strong>
                    {' definidos'}
                </div>
                <div className="footer-actions">
                    <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                    <button
                        className="btn-save"
                        onClick={handleSubmit}
                        disabled={loading || getItemCount() < 1}
                    >
                        {loading ? 'Guardando...' : 'Guardar y Continuar →'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ConfiguracionActividadView;