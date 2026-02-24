import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './configurationGameStyles.css';
import DictionaryService from '../../services/DictionaryService';
import apiConfig from '../../services/apiConfig';

const generateId = () => Math.random().toString(36).substr(2, 9);

/* ─────────────── Word Search Input ─────────────── */
const WordSearchInput = ({ value, onSelectWord, onChangeText, placeholder, words }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = useMemo(() => {
        if (!value || value.length < 1) return [];
        return words.filter(w => w.spanishWord?.toLowerCase().includes(value.toLowerCase())).slice(0, 8);
    }, [value, words]);

    return (
        <div className="cfg-word-search" ref={ref}>
            <input
                type="text"
                className="cfg-input"
                placeholder={placeholder}
                value={value}
                onChange={e => { onChangeText(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
            />
            {open && filtered.length > 0 && (
                <div className="cfg-word-results">
                    {filtered.map(w => (
                        <div key={w.id} className="cfg-word-option" onClick={() => { onSelectWord(w); setOpen(false); }}>
                            <span>{w.spanishWord}</span>
                            <span className="maz-hint">{w.mazahuaWord}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────── Switch Toggle ─────────────── */
const SwitchToggle = ({ label, icon, checked, onChange }) => (
    <div className="cfg-switch-row">
        <span className="cfg-switch-label">{icon && <span className="sw-icon">{icon}</span>}{label}</span>
        <label className="cfg-switch">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="cfg-slider"></span>
        </label>
    </div>
);

/* ─────────────── Config Card ─────────────── */
const ConfigCard = ({ title, dotClass, config, setConfig }) => {
    const handleMazahua = (v) => {
        // If mazahua is ON, text must be ON (mazahua defines the language of text)
        if (v) {
            setConfig({ ...config, isMazahua: true, showText: true });
        } else {
            setConfig({ ...config, isMazahua: false });
        }
    };

    const handleText = (v) => {
        // If turning text OFF, also turn mazahua OFF
        if (!v) {
            setConfig({ ...config, showText: false, isMazahua: false });
        } else {
            setConfig({ ...config, showText: v });
        }
    };

    return (
        <div className="cfg-config-card">
            <h3><span className={`cfg-dot ${dotClass}`}></span>{title}</h3>
            <div className="cfg-config-options">
                <SwitchToggle label="Imagen" icon="🖼️" checked={config.showImage} onChange={v => setConfig({ ...config, showImage: v })} />
                <SwitchToggle label="Texto" icon="📝" checked={config.showText} onChange={handleText} />
                <SwitchToggle label="Audio" icon="🔊" checked={config.playAudio} onChange={v => setConfig({ ...config, playAudio: v })} />
                <SwitchToggle label="Mazahua" icon="🗣️" checked={config.isMazahua} onChange={handleMazahua} />
            </div>
        </div>
    );
};

/* ─────────────── Config Badges (inline in labels) ─────────────── */
const ConfigBadges = ({ config, hasWord }) => (
    <span className="cfg-badges">
        {config.showImage && <span className={`cfg-mini-badge ${hasWord ? 'active' : ''}`}>🖼️</span>}
        {config.playAudio && <span className={`cfg-mini-badge ${hasWord ? 'active' : ''}`}>🔊</span>}
        {config.showText && (
            <span className="cfg-lang-badge">{config.isMazahua ? 'MAZ' : 'ESP'}</span>
        )}
    </span>
);

/* ═══════════════ MAIN COMPONENT ═══════════════ */
const ConfigurationGameView = () => {
    const [gameType, setGameType] = useState('PAIRS');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [experience, setExperience] = useState(0);
    const [difficult, setDifficult] = useState('EASY');

    const [words, setWords] = useState([]);

    const [config1, setConfig1] = useState({ showImage: true, showText: true, playAudio: true, isMazahua: true, order: 1 });
    const [config2, setConfig2] = useState({ showImage: true, showText: true, playAudio: true, isMazahua: true, order: 2 });

    const [questions, setQuestions] = useState([]);
    const [pairs, setPairs] = useState([]);

    useEffect(() => {
        DictionaryService.getAllWords().then(r => { if (r.success && Array.isArray(r.data)) setWords(r.data); });
        setPairs([makePair()]);
        setQuestions([makeQuestion()]);
    }, []);

    const makePair = () => ({ id: generateId(), elem1: { text: '', wordId: null, sw: '' }, elem2: { text: '', wordId: null, sw: '' } });
    const makeQuestion = () => ({
        id: generateId(), question: '', wordId: null, sw: '',
        responseList: [
            { id: generateId(), answerText: '', wordId: null, sw: '', isCorrect: true },
            { id: generateId(), answerText: '', wordId: null, sw: '', isCorrect: false },
            { id: generateId(), answerText: '', wordId: null, sw: '', isCorrect: false },
            { id: generateId(), answerText: '', wordId: null, sw: '', isCorrect: false },
        ]
    });

    const totalItems = gameType === 'PAIRS' ? pairs.length : questions.length;
    const recXP = totalItems * (difficult === 'EASY' ? 10 : difficult === 'MEDIUM' ? 15 : 20);

    /* ── Pair helpers ── */
    const updatePairElem = (id, elem, data) => setPairs(ps => ps.map(p => p.id === id ? { ...p, [elem]: { ...p[elem], ...data } } : p));
    const removePair = id => { if (pairs.length > 1) setPairs(ps => ps.filter(p => p.id !== id)); };

    /* ── Question helpers ── */
    const updateQ = (id, data) => setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...data } : q));
    const removeQ = id => { if (questions.length > 1) setQuestions(qs => qs.filter(q => q.id !== id)); };

    const addAnswer = qId => setQuestions(qs => qs.map(q =>
        q.id === qId && q.responseList.length < 6
            ? { ...q, responseList: [...q.responseList, { id: generateId(), answerText: '', wordId: null, sw: '', isCorrect: false }] }
            : q
    ));

    const removeAnswer = (qId, aId) => setQuestions(qs => qs.map(q => {
        if (q.id !== qId || q.responseList.length <= 2) return q;
        const list = q.responseList.filter(a => a.id !== aId);
        if (!list.some(a => a.isCorrect)) list[0].isCorrect = true;
        return { ...q, responseList: list };
    }));

    const setCorrectAnswer = (qId, aId) => setQuestions(qs => qs.map(q =>
        q.id !== qId ? q : { ...q, responseList: q.responseList.map(a => ({ ...a, isCorrect: a.id === aId })) }
    ));

    const updateAnswer = (qId, aId, data) => setQuestions(qs => qs.map(q =>
        q.id !== qId ? q : { ...q, responseList: q.responseList.map(a => a.id === aId ? { ...a, ...data } : a) }
    ));

    /* ── Submit ── */
    const handleSubmit = async () => {
        const dto = {
            gameType, title, description,
            experience: experience || recXP,
            difficult,
            totalQuestions: totalItems,
            wordIds: [],
            questions: [],
            mediaId: null,
            gameConfigs: [config1, config2]
        };

        if (gameType === 'PAIRS') {
            const ids = new Set();
            pairs.forEach(p => { if (p.elem1.wordId) ids.add(p.elem1.wordId); if (p.elem2.wordId) ids.add(p.elem2.wordId); });
            dto.wordIds = Array.from(ids);
        } else {
            dto.questions = questions.map(q => ({
                question: q.question,
                wordId: q.wordId,
                responseList: q.responseList.map(a => ({ answerText: a.answerText, isCorrect: a.isCorrect, wordId: a.wordId }))
            }));
        }

        try {
            await apiConfig.post('/api/games', dto);
            alert('✅ Juego creado con éxito!');
        } catch (err) {
            alert('Error al crear el juego: ' + err.message);
        }
    };

    const hasWord = wId => wId !== null && wId !== undefined;

    /* ═══════════════ RENDER ═══════════════ */
    return (
        <div className="cfg-game-root">
            {/* ─── SIDEBAR ─── */}
            <aside className="cfg-sidebar">
                <p className="cfg-sidebar-title">General</p>

                <div className="cfg-sidebar-section">
                    <label>Tipo de Juego</label>
                    <div className="cfg-toggle-group">
                        <button className={`cfg-toggle-btn ${gameType === 'PAIRS' ? 'active' : ''}`} onClick={() => setGameType('PAIRS')}>🃏 Pares</button>
                        <button className={`cfg-toggle-btn ${gameType === 'QUESTIONNAIRE' ? 'active' : ''}`} onClick={() => setGameType('QUESTIONNAIRE')}>❓ Quiz</button>
                    </div>
                </div>

                <div className="cfg-sidebar-section">
                    <label>Nombre</label>
                    <input className="cfg-input" placeholder="Nombre del juego" value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <div className="cfg-sidebar-section">
                    <label>Descripción</label>
                    <textarea className="cfg-input" placeholder="Describe la actividad..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="cfg-sidebar-section">
                    <label>Dificultad</label>
                    <div className="cfg-diff-group">
                        {['EASY', 'MEDIUM', 'HARD'].map(d => (
                            <button
                                key={d}
                                className={`cfg-diff-btn ${difficult === d ? `active-${d.toLowerCase()}` : ''}`}
                                onClick={() => setDifficult(d)}
                            >
                                {d === 'EASY' ? '😊 Fácil' : d === 'MEDIUM' ? '🤔 Medio' : '🔥 Difícil'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cfg-sidebar-section">
                    <label>Experiencia (XP)</label>
                    <input className="cfg-input" type="number" value={experience} onChange={e => setExperience(parseInt(e.target.value) || 0)} />
                    <span className="cfg-xp-hint">⭐ Recomendado: {recXP} XP</span>
                </div>

                <button className="cfg-btn-publish" onClick={handleSubmit}>🚀 Publicar</button>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="cfg-main">
                <div className="cfg-section-heading">
                    <h2>{gameType === 'PAIRS' ? 'Configuración de Contenido' : 'Configuración de Quiz'}</h2>
                    <p>{gameType === 'PAIRS' ? 'Configura tus pares de palabras y recursos multimedia.' : 'Diseña tus preguntas y define las opciones de respuesta.'}</p>
                </div>

                {/* Mode pill */}
                <div className={`cfg-mode-pill ${gameType === 'PAIRS' ? 'pairs' : 'quiz'}`}>
                    <span className="pill-icon">{gameType === 'PAIRS' ? '🃏' : '⚠️'}</span>
                    {gameType === 'PAIRS'
                        ? 'Modo Pares — Cada item consiste en dos elementos que se emparejan.'
                        : 'Modo Quiz — Cada item consiste en una pregunta y múltiples opciones de respuesta.'}
                </div>

                {/* Configs row */}
                <div className="cfg-configs-row">
                    <ConfigCard
                        title={gameType === 'PAIRS' ? 'Configuración Elemento 1' : 'Configuración Pregunta'}
                        dotClass="dot-1"
                        config={config1}
                        setConfig={setConfig1}
                    />
                    <ConfigCard
                        title={gameType === 'PAIRS' ? 'Configuración Elemento 2' : 'Configuración Respuestas'}
                        dotClass="dot-2"
                        config={config2}
                        setConfig={setConfig2}
                    />
                </div>

                {/* ─── ITEMS LIST ─── */}
                <div className="cfg-items-list">
                    {gameType === 'PAIRS' ? (
                        <>
                            {pairs.map((pair, idx) => (
                                <div key={pair.id} className="cfg-item-card">
                                    <div className="cfg-item-header">
                                        <div className="cfg-item-number">
                                            <span className="num-badge">{idx + 1}</span>
                                            Nuevo Elemento
                                        </div>
                                        <div className="cfg-item-status">
                                            <span className={`cfg-status-tag ${pair.elem1.text && pair.elem2.text ? 'complete' : 'incomplete'}`}>
                                                {pair.elem1.text && pair.elem2.text ? 'Completo' : 'Incompleto'}
                                            </span>
                                            {pairs.length > 1 && <button className="cfg-btn-delete" onClick={() => removePair(pair.id)}>🗑️</button>}
                                        </div>
                                    </div>
                                    <div className="cfg-row">
                                        <div className="cfg-field">
                                            <span className="cfg-field-label">
                                                Estímulo <ConfigBadges config={config1} hasWord={hasWord(pair.elem1.wordId)} />
                                            </span>
                                            <input
                                                className="cfg-input"
                                                placeholder="Escribe la palabra..."
                                                value={pair.elem1.text}
                                                onChange={e => updatePairElem(pair.id, 'elem1', { text: e.target.value })}
                                            />
                                            <WordSearchInput
                                                words={words}
                                                value={pair.elem1.sw}
                                                placeholder="Buscar palabra conocida..."
                                                onChangeText={t => updatePairElem(pair.id, 'elem1', { sw: t, wordId: null })}
                                                onSelectWord={w => updatePairElem(pair.id, 'elem1', { sw: w.spanishWord, wordId: w.id })}
                                            />
                                        </div>
                                        <div className="cfg-field">
                                            <span className="cfg-field-label">
                                                Respuesta <ConfigBadges config={config2} hasWord={hasWord(pair.elem2.wordId)} />
                                            </span>
                                            <input
                                                className="cfg-input"
                                                placeholder="Respuesta correcta..."
                                                value={pair.elem2.text}
                                                onChange={e => updatePairElem(pair.id, 'elem2', { text: e.target.value })}
                                            />
                                            <WordSearchInput
                                                words={words}
                                                value={pair.elem2.sw}
                                                placeholder="Buscar palabra conocida..."
                                                onChangeText={t => updatePairElem(pair.id, 'elem2', { sw: t, wordId: null })}
                                                onSelectWord={w => updatePairElem(pair.id, 'elem2', { sw: w.spanishWord, wordId: w.id })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="cfg-add-card" onClick={() => setPairs([...pairs, makePair()])}>
                                <span className="add-icon">+</span>
                                <span>Agregar Nuevo Par</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {questions.map((q, idx) => (
                                <div key={q.id} className="cfg-item-card">
                                    <div className="cfg-item-header">
                                        <div className="cfg-item-number">
                                            <span className="num-badge">{idx + 1}</span>
                                            Configuración de Pregunta
                                        </div>
                                        <div className="cfg-item-status">
                                            {questions.length > 1 && <button className="cfg-btn-delete" onClick={() => removeQ(q.id)}>🗑️</button>}
                                        </div>
                                    </div>

                                    {/* Question row */}
                                    <div className="cfg-row">
                                        <div className="cfg-field">
                                            <span className="cfg-field-label">
                                                ❓ Estímulo de Pregunta <ConfigBadges config={config1} hasWord={hasWord(q.wordId)} />
                                            </span>
                                            <input
                                                className="cfg-input"
                                                placeholder="Escribe tu pregunta aquí..."
                                                value={q.question}
                                                onChange={e => updateQ(q.id, { question: e.target.value })}
                                            />
                                            <WordSearchInput
                                                words={words}
                                                value={q.sw}
                                                placeholder="Buscar palabra base..."
                                                onChangeText={t => updateQ(q.id, { sw: t, wordId: null })}
                                                onSelectWord={w => updateQ(q.id, { sw: w.spanishWord, wordId: w.id })}
                                            />
                                        </div>
                                        <div className="cfg-field" style={{ alignSelf: 'flex-start' }}>
                                            {/* Empty right column for spacing */}
                                        </div>
                                    </div>

                                    {/* Answers */}
                                    <p className="cfg-answers-label">Configuración de Respuestas</p>
                                    <div className="cfg-answers-grid">
                                        {q.responseList.map((ans, aIdx) => (
                                            <div key={ans.id} className={`cfg-answer-cell ${ans.isCorrect ? 'is-correct' : ''}`}>
                                                <div className="cfg-answer-top">
                                                    <span className="cfg-answer-label">Opción {aIdx + 1} <ConfigBadges config={config2} hasWord={hasWord(ans.wordId)} /></span>
                                                    <div className="cfg-answer-actions">
                                                        <span className="cfg-correct-text">Correcta</span>
                                                        <label className="cfg-correct-switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={ans.isCorrect}
                                                                onChange={() => setCorrectAnswer(q.id, ans.id)}
                                                            />
                                                            <span className="cfg-correct-slider"></span>
                                                        </label>
                                                        {q.responseList.length > 2 && (
                                                            <button className="cfg-btn-remove-ans" onClick={() => removeAnswer(q.id, ans.id)}>✕</button>
                                                        )}
                                                    </div>
                                                </div>
                                                <input
                                                    className="cfg-input"
                                                    placeholder="Texto de respuesta..."
                                                    value={ans.answerText}
                                                    onChange={e => updateAnswer(q.id, ans.id, { answerText: e.target.value })}
                                                />
                                                <WordSearchInput
                                                    words={words}
                                                    value={ans.sw}
                                                    placeholder="Palabra (opcional)..."
                                                    onChangeText={t => updateAnswer(q.id, ans.id, { sw: t, wordId: null })}
                                                    onSelectWord={w => updateAnswer(q.id, ans.id, { sw: w.spanishWord, wordId: w.id })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {q.responseList.length < 6 && (
                                        <button className="cfg-btn-add-answer" onClick={() => addAnswer(q.id)}>
                                            + Añadir Respuesta
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="cfg-add-card" onClick={() => setQuestions([...questions, makeQuestion()])}>
                                <span className="add-icon">+</span>
                                <span>Agregar Nueva Pregunta</span>
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ConfigurationGameView;
