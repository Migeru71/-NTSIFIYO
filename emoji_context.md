## ✅
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
            await onAssignActivity(activity);
            onReload();
            showToast(`✅ "${activity.title}" asignada al grupo exitosamente.`);
        } catch (err) {
            const status = err?.status || err?.response?.status;
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                        {inst && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${inst.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {inst.isActive ? '✅ Activa' : '❌ Inactiva'}
                            </span>
                        )}
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                                    <>
                                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
                                            <div>
                                                <p className="text-sm text-gray-500">Asignadas</p>
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                    <div className="gs-pairs-summary">
                                        <div className="gs-pairs-completed">
                                            <h4 className="gs-pairs-title">✅ Completadas</h4>
                                            <ul className="gs-pairs-list">
                                                {pairsSummary.completed.length > 0 ? (
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                        <div key={index} className={`gs-log-item ${log.isCorrect ? 'log-correct' : 'log-wrong'}`}>
                                            <div className="gs-log-header">
                                                <span className="gs-log-icon">{log.isCorrect ? '✅' : '❌'}</span>
                                                <span className="gs-log-question-num">Pregunta {index + 1}</span>
                                            </div>
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaCard.jsx
Context:
```jsx
                <div className={`mr-swipe-overlay ${direction === 'right' ? 'correct' : 'incorrect'}`} style={{ zIndex: 10 }}>
                    <span className="mr-overlay-icon">
                        {direction === 'right' ? '✅' : '❌'}
                    </span>
                </div>
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [speed, setSpeed] = useState(BASE_SPEED);
    const [feedback, setFeedback] = useState(null); // '✅' | '❌' | null
    const [cardKey, setCardKey] = useState(0); 
    const [countdown, setCountdown] = useState(3);
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
            setCorrectCount(prev => prev + 1);
            setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_DECREASE));
            setFeedback('✅');
        } else {
            setCombo(0);
```

## ❌
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
        } catch (err) {
            const status = err?.status || err?.response?.status;
            if (status === 404)       showToast('❌ Juego o grupo no encontrado.');
            else if (status === 409)  showToast('⚠️ Este juego ya está asignado o el grupo no te pertenece.');
            else                      showToast(`❌ Error al asignar: ${err.message || 'Error desconocido'}`);
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
            if (status === 404)       showToast('❌ Juego o grupo no encontrado.');
            else if (status === 409)  showToast('⚠️ Este juego ya está asignado o el grupo no te pertenece.');
            else                      showToast(`❌ Error al asignar: ${err.message || 'Error desconocido'}`);
        } finally {
            setAssigningId(null);
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                        {inst && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${inst.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {inst.isActive ? '✅ Activa' : '❌ Inactiva'}
                            </span>
                        )}
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                        </div>
                                        <div className="gs-pairs-incomplete">
                                            <h4 className="gs-pairs-title">❌ Incompletas</h4>
                                            <ul className="gs-pairs-list">
                                                {pairsSummary.incomplete.length > 0 ? (
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                        <div key={index} className={`gs-log-item ${log.isCorrect ? 'log-correct' : 'log-wrong'}`}>
                                            <div className="gs-log-header">
                                                <span className="gs-log-icon">{log.isCorrect ? '✅' : '❌'}</span>
                                                <span className="gs-log-question-num">Pregunta {index + 1}</span>
                                            </div>
```

### File: client\src\components\Games\Intruso\IntrusoGameView.jsx
Context:
```jsx
        } else {
            setCombo(0);
            setFeedback({ type: 'incorrect', title: 'Incorrecto ❌', message: 'Ese si pertenece al grupo...' });
        }
    };
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                <div className="lot-badge lot-badge-points">⭐ {score} pts</div>
                {penaltyCount > 0 && (
                    <div className="lot-badge lot-badge-penalty">❌ -{penaltyCount * PENALTY_PTS}</div>
                )}
            </div>
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaCard.jsx
Context:
```jsx
                <div className={`mr-swipe-overlay ${direction === 'right' ? 'correct' : 'incorrect'}`} style={{ zIndex: 10 }}>
                    <span className="mr-overlay-icon">
                        {direction === 'right' ? '✅' : '❌'}
                    </span>
                </div>
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [speed, setSpeed] = useState(BASE_SPEED);
    const [feedback, setFeedback] = useState(null); // '✅' | '❌' | null
    const [cardKey, setCardKey] = useState(0); 
    const [countdown, setCountdown] = useState(3);
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
        } else {
            setCombo(0);
            setFeedback('❌');
        }

```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
            <div className="game-error-container">
                <div className="error-box">
                    <h2>❌ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-secondary" onClick={() => window.history.back()}>
```

## ⚠
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
            const status = err?.status || err?.response?.status;
            if (status === 404)       showToast('❌ Juego o grupo no encontrado.');
            else if (status === 409)  showToast('⚠️ Este juego ya está asignado o el grupo no te pertenece.');
            else                      showToast(`❌ Error al asignar: ${err.message || 'Error desconocido'}`);
        } finally {
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
        if (error) return (
            <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
                <span className="text-5xl block mb-4">⚠️</span>
                <h3 className="text-lg font-bold text-red-600 mb-2">Error al cargar</h3>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                                const isMatched = matchedIds.has(card.wordId);
                                const isWrong = wrongIds.has(card.wordId);
                                // ⚠️ NO se resalta cuando sale en la baraja — el jugador debe identificar la carta
                                return (
                                    <div
```

### File: client\src\pages\student\StudentAssignments.jsx
Context:
```jsx
                        ) : error ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-red-100 max-w-2xl mx-auto">
                                <span className="text-6xl block mb-4">⚠️</span>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h3>
                                <p className="text-gray-500">{error.message}</p>
```

### File: client\src\pages\teacher\TeacherAssignments.jsx
Context:
```jsx
                    ) : error ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-red-100 shadow-sm">
                            <span className="text-5xl block mb-4">⚠️</span>
                            <h3 className="text-lg font-bold text-red-600 mb-2">Error al cargar</h3>
                            <p className="text-gray-500 text-sm mb-6">{error.message}</p>
```

### File: client\src\pages\teacher\TeacherDashboard.jsx
Context:
```jsx
                    {error && !isLoading && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-red-100 mt-6 shadow-sm">
                            <span className="text-6xl block mb-4">⚠️</span>
                            <h3 className="text-xl font-bold text-red-600 mb-2">Error cargando el panel</h3>
                            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{error.message}</p>
```

## 👤
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                    {activity.teacher && (
                        <p className="text-xs text-gray-400 mb-3">
                            👤 {activity.teacher.firstName} {activity.teacher.lastName}
                        </p>
                    )}
```

### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx
                <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                {(activity.teacherDTO || activity.teacher) && (
                    <span>👤 {(activity.teacherDTO || activity.teacher).firstName}</span>
                )}
            </div>
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                                            <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                                            {activity.teacherDTO && (
                                                <span>👤 {activity.teacherDTO.firstName}</span>
                                            )}
                                        </div>
```

## ⭐
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                        </span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span>⭐ {activity.experience} XP</span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span>
```

### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx
            <p className="activity-card-description">{activity.description}</p>
            <div className="activity-card-stats">
                <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                {(activity.teacherDTO || activity.teacher) && (
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                                        <p className="gap-card-description">{activity.description}</p>
                                        <div className="gap-card-stats">
                                            <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                                            <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                                            {activity.teacherDTO && (
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
    const messages = {
        perfecto: { icon: '🎉', title: '¡PERFECTO!', sub: '¡No fallaste ni una!' },
        excelente: { icon: '⭐', title: '¡Increíble!', sub: '¡Muy buen trabajo!' },
        bueno: { icon: '✓', title: '¡Bien hecho!', sub: '¡Sigue así!' },
        'necesita-mejorar': { icon: '💪', title: '¡Sigue practicando!', sub: '¡Tú puedes!' }
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                            <div className={`gs-xp-container ${result.isLevelUp ? 'level-up-anim' : ''}`}>
                                <div className="gs-xp-badge">
                                    <span className="gs-xp-icon">⭐</span>
                                    <span className="gs-xp-value">+{result.xpGained} XP</span>
                                </div>
```

### File: client\src\components\Games\Intruso\IntrusoGameView.jsx
Context:
```jsx
                </button>
                <div className="intruso-score-badge">
                    <span>⭐</span> {score}
                </div>
            </div>
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
            {/* Fila secundaria para puntos de lotería */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: 'var(--game-max-width)', marginBottom: '0.75rem', justifyContent: 'center' }}>
                <div className="lot-badge lot-badge-points">⭐ {score} pts</div>
                {penaltyCount > 0 && (
                    <div className="lot-badge lot-badge-penalty">❌ -{penaltyCount * PENALTY_PTS}</div>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input className="cfg-input" type="number" value={experience} onChange={e => setExperience(parseInt(e.target.value) || 0)} style={{ width: '80px' }} />
                                <span className="cfg-xp-hint">⭐ {recXP}</span>
                            </div>
                        </div>
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx
                        <div className="modal-meta">
                            <span>⏱️ {selectedItem.duration}s</span>
                            <span>⭐ Dificultad: {selectedItem.difficult}</span>
                        </div>
                        <p className="modal-desc">{selectedItem.description || 'Sin descripción disponible.'}</p>
```

## 📝
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                        <span className="w-px h-3 bg-gray-200" />
                        <span>
                            📝 {activity.totalQuestions}{' '}
                            {activity.gameType === 'FAST_MEMORY' ? 'pares' : 'preguntas'}
                        </span>
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                                <div key={i} className="flex gap-1 text-[10px] bg-gray-50 rounded-lg px-2 py-1">
                                    {cfg.showImage && <span title="Imagen">🖼️</span>}
                                    {cfg.showText  && <span title="Texto">📝</span>}
                                    {cfg.playAudio && <span title="Audio">🔊</span>}
                                    <span className="text-gray-400 ml-1">{cfg.isMazahua ? 'MAZ' : 'ESP'}</span>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
            <div className="cfg-config-options">
                <SwitchToggle label="Imagen" icon="🖼️" checked={config.showImage} onChange={v => setConfig({ ...config, showImage: v })} />
                <SwitchToggle label="Texto" icon="📝" checked={config.showText} onChange={handleText} />
                <SwitchToggle label="Audio" icon="🔊" checked={config.playAudio} onChange={v => setConfig({ ...config, playAudio: v })} />
                <SwitchToggle label="Mazahua" icon="🗣️" checked={config.isMazahua} onChange={handleMazahua} />
```

## 🖼
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                            {configSummary.map((cfg, i) => (
                                <div key={i} className="flex gap-1 text-[10px] bg-gray-50 rounded-lg px-2 py-1">
                                    {cfg.showImage && <span title="Imagen">🖼️</span>}
                                    {cfg.showText  && <span title="Texto">📝</span>}
                                    {cfg.playAudio && <span title="Audio">🔊</span>}
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
    }, [wordId]);

    if (!wordId) return <div className="cfg-preview-empty">🖼️ Selecciona una palabra</div>;
    if (loading) return <div className="cfg-preview-loading">Cargando…</div>;
    if (!preview) return <div className="cfg-preview-empty">Sin vista previa</div>;
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
            <h3><span className={`cfg-dot ${dotClass}`}></span>{title}</h3>
            <div className="cfg-config-options">
                <SwitchToggle label="Imagen" icon="🖼️" checked={config.showImage} onChange={v => setConfig({ ...config, showImage: v })} />
                <SwitchToggle label="Texto" icon="📝" checked={config.showText} onChange={handleText} />
                <SwitchToggle label="Audio" icon="🔊" checked={config.playAudio} onChange={v => setConfig({ ...config, playAudio: v })} />
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
const ConfigBadges = ({ config, hasWord }) => (
    <span className="cfg-badges">
        {config.showImage && <span className={`cfg-mini-badge ${hasWord ? 'active' : ''}`}>🖼️</span>}
        {config.playAudio && <span className={`cfg-mini-badge ${hasWord ? 'active' : ''}`}>🔊</span>}
        {config.showText && (
```

## 🔊
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                                    {cfg.showImage && <span title="Imagen">🖼️</span>}
                                    {cfg.showText  && <span title="Texto">📝</span>}
                                    {cfg.playAudio && <span title="Audio">🔊</span>}
                                    <span className="text-gray-400 ml-1">{cfg.isMazahua ? 'MAZ' : 'ESP'}</span>
                                </div>
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                                    {log.questionText && <span>{log.questionText}</span>}
                                                    {log.questionAudio && (
                                                        <button onClick={() => playAudio(log.questionAudio)} className="gs-log-audio-btn">🔊</button>
                                                    )}
                                                </div>
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                                        <div className="gs-log-value">
                                                            {log.questionText && <span>{log.questionText}</span>}
                                                            {log.questionAudio && <button onClick={() => playAudio(log.questionAudio)} className="gs-log-audio-btn">🔊</button>}
                                                        </div>
                                                        <div className="gs-log-label">Tarjeta mostrada (a evaluar):</div>
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                                        <div className="gs-log-value">
                                                            {log.correctText && <span>{log.correctText}</span>}
                                                            {log.correctAudio && <button onClick={() => playAudio(log.correctAudio)} className="gs-log-audio-btn">🔊</button>}
                                                        </div>
                                                    </div>
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                                            {log.correctImage && <img src={log.correctImage} alt="C" className="gs-log-img" />}
                                                            {log.correctText && <span>{log.correctText}</span>}
                                                            {log.correctAudio && <button onClick={() => playAudio(log.correctAudio)} className="gs-log-audio-btn">🔊</button>}
                                                        </div>
                                                    </div>
```

### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                                                                {log.selectedImage && <img src={log.selectedImage} alt="W" className="gs-log-img" />}
                                                                {log.selectedText ? <span>{log.selectedText}</span> : (!log.selectedImage && !log.selectedAudio ? <span>(Sin respuesta / Tiempo)</span> : null)}
                                                                {log.selectedAudio && <button onClick={() => playAudio(log.selectedAudio)} className="gs-log-audio-btn">🔊</button>}
                                                            </div>
                                                        </div>
```

### File: client\src\components\Games\Intruso\IntrusoGameView.jsx
Context:
```jsx
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <button onClick={() => playAudio(currentQuestion.word.audioUrl)}
                            style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>🔊</button>
                    </div>
                )}
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                                        onClick={() => new Audio(currentCard.audioUrl).play().catch(() => { })}
                                        title="Reproducir audio"
                                    >🔊</button>
                                )}
                            </div>
```

### File: client\src\components\Games\Quiz\QuizGameView.jsx
Context:
```jsx
                                style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pomnter' }}
                                title="Escuchar"
                            >🔊</button>
                        </div>
                    )}
```

### File: client\src\components\Games\Quiz\QuizGameView.jsx
Context:
```jsx
                                            onClick={(e) => { e.stopPropagation(); playAudio(option.word.AudioUrl); }}
                                            style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pomnter', flexShrInk: 0 }}
                                        >🔊</button>
                                    )}
                                </button>
```

### File: client\src\components\Games\Rompecabezas\RompecabezasGameView.jsx
Context:
```jsx
                    {gameConfigs[0]?.playAudio && currentQuestion.word?.audioUrl && (
                        <button onClick={() => playAudio(currentQuestion.word.audioUrl)}
                            style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' }}>🔊</button>
                    )}
                </div>
```

### File: client\src\components\Games\Rompecabezas\RompecabezasGameView.jsx
Context:
```jsx
                                        onClick={(e) => { e.stopPropagation(); playAudio(option.word.audioUrl); }}
                                        style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >🔊</button>
                                )}
                            </button>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                <SwitchToggle label="Imagen" icon="🖼️" checked={config.showImage} onChange={v => setConfig({ ...config, showImage: v })} />
                <SwitchToggle label="Texto" icon="📝" checked={config.showText} onChange={handleText} />
                <SwitchToggle label="Audio" icon="🔊" checked={config.playAudio} onChange={v => setConfig({ ...config, playAudio: v })} />
                <SwitchToggle label="Mazahua" icon="🗣️" checked={config.isMazahua} onChange={handleMazahua} />
            </div>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
    <span className="cfg-badges">
        {config.showImage && <span className={`cfg-mini-badge ${hasWord ? 'active' : ''}`}>🖼️</span>}
        {config.playAudio && <span className={`cfg-mini-badge ${hasWord ? 'active' : ''}`}>🔊</span>}
        {config.showText && (
            <span className="cfg-lang-badge">{config.isMazahua ? 'MAZ' : 'ESP'}</span>
```

## 📭
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
        if (filteredActivities.length === 0) return (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <span className="text-6xl block mb-4">📭</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {filterType !== 'ALL' ? 'Sin resultados' : 'Aún no hay actividades'}
```

### File: client\src\pages\teacher\TeacherAssignments.jsx
Context:
```jsx
                    ) : activities.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-6xl block mb-4">📭</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Sin asignaciones activas</h3>
                            <p className="text-gray-500">No hay actividades asignadas a tu grupo en este momento.</p>
```

### File: client\src\pages\teacher\TeacherDashboard.jsx
Context:
```jsx
                                        {activeAssignments.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                <span className="text-5xl mb-3 opacity-50">📭</span>
                                                <p className="text-gray-500 font-medium">No hay actividades activas actualmente.</p>
                                                <Link to="/maestro/recursos" className="mt-3 text-sm text-green-600 font-semibold hover:underline">Asignar nueva actividad</Link>
```

## 🚀
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                        🚀 Crear Primera Actividad
                    </button>
                )}
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                    >
                        🚀 Abrir Editor de Actividades
                    </button>
                </div>
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
                    }}>
                        <span style={{ fontSize: '56px', fontWeight: '800', color: '#1e293b' }}>
                            {countdown || '🚀'}
                        </span>
                    </div>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                            </div>
                            <button className="cfg-btn-publish" onClick={handleSubmit}>
                                {isEditMode ? '💾 Actualizar' : '🚀 Publicar'}
                            </button>
                        </div>
```

## 🟢
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🟢 Actividades Activas
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
```

### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }
```

### File: client\src\utils\difficultyBadges.js
Context:
```jsx
const DIFFICULTY_BADGES = {
    'EASY': { id: 'EASY', label: 'Fácil', color: 'bg-green-100 text-green-700', dot: '🟢', hexColor: '#22c55e' },
    'MEDIUM': { id: 'MEDIUM', label: 'Medio', color: 'bg-amber-100 text-amber-700', dot: '🟡', hexColor: '#f59e0b' },
    'HARD': { id: 'HARD', label: 'Difícil', color: 'bg-red-100 text-red-700', dot: '🔴', hexColor: '#ef4444' },
```

## 🔴
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🔴 Actividades Inactivas
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
```

### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }
```

### File: client\src\utils\difficultyBadges.js
Context:
```jsx
    'EASY': { id: 'EASY', label: 'Fácil', color: 'bg-green-100 text-green-700', dot: '🟢', hexColor: '#22c55e' },
    'MEDIUM': { id: 'MEDIUM', label: 'Medio', color: 'bg-amber-100 text-amber-700', dot: '🟡', hexColor: '#f59e0b' },
    'HARD': { id: 'HARD', label: 'Difícil', color: 'bg-red-100 text-red-700', dot: '🔴', hexColor: '#ef4444' },
};

```

## 🎮
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                <div>
                    {(activeActivities.length > 0 || inactiveActivities.length > 0) && (
                        <h3 className="text-xl font-bold text-gray-800 mb-4 mt-4">🎮 Todas las Actividades</h3>
                    )}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                                ) : (
                                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">🎮</div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
            <div className="gap-role-content">
                <div>
                    <h2 className="gap-section-title">🎮 Actividades Disponibles</h2>
                    {loading ? (
                        <div className="gap-loading">
```

### File: client\src\config\activityConfig.js
Context:
```jsx
/** Helpers */
export const getGameBasePath = (type) => ACTIVITY_CONFIG[type]?.basePath || '/dashboard';
export const getGameIcon = (type) => ACTIVITY_CONFIG[type]?.icon || '🎮';
export const getActivitiesList = () => Object.values(ACTIVITY_CONFIG);

```

### File: client\src\config\activityConfig.js
Context:
```jsx
        return { label: rest.join(' '), icon, color: activity.color || '#6b7280' };
    }
    return { label: type, icon: '🎮', color: '#6b7280' };
};

```

## 🚧
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                    {showTabs && activeTab === 'all' ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-6xl mb-4">🚧</span>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Próximamente</h3>
                            <p className="text-gray-400 text-sm">
```

### File: client\src\pages\teacher\TeacherContent.jsx
Context:
```jsx
                    {/* Placeholder Content */}
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-6xl block mb-4">🚧</span>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sección en Construcción</h3>
                        <p className="text-gray-500 mb-6">
```

## ❓
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">❓</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Quiz</p>
```

### File: client\src\components\Games\Quiz\QuizAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.QUESTIONNAIRE}
            icon="❓"
            title="Centro de Quiz"
            subtitle="Pon a prueba tus conocimientos de Mazahua"
```

### File: client\src\components\Games\Quiz\QuizAccessPanel.jsx
Context:
```jsx
            subtitle="Pon a prueba tus conocimientos de Mazahua"
            gameBasePath="/games/quiz"
            cardIcon="❓"
            tipStudent="Los quizzes tienen múltiples opciones de respuesta"
            tipTeacher="Crea quizzes personalizados y evalúa a tus alumnos"
```

### File: client\src\components\Games\Quiz\QuizGameView.jsx
Context:
```jsx
        return (
            <div className="quiz-access-panel" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <p style={{ fontSize: '64px' }}>❓</p>
                <h2>{error}</h2>
                <button
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                            <label>Interacción</label>
                            <div className="cfg-toggle-group">
                                <button className={`cfg-toggle-btn ${interactionType === 'QUESTIONNAIRE' ? 'active' : ''}`} onClick={() => handleInteractionChange('QUESTIONNAIRE')}>❓ Quiz</button>
                                <button className={`cfg-toggle-btn ${interactionType === 'PAIRS' ? 'active' : ''}`} onClick={() => handleInteractionChange('PAIRS')}>🃏 Pares</button>
                                <button className={`cfg-toggle-btn ${interactionType === 'MEDIA' ? 'active' : ''}`} onClick={() => handleInteractionChange('MEDIA')}>▶️ Contenido</button>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        <div className="cfg-field">
                                            <span className="cfg-field-label">
                                                ❓ Estímulo de Pregunta <ConfigBadges config={config1} hasWord={hasWord(q.wordId)} />
                                            </span>
                                            <input
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.QUESTIONNAIRE,
        title: 'Quiz',
        label: '❓ Quiz',
        subtitle: 'Preguntas y Respuestas',
        description: 'Pon a prueba tus conocimientos del idioma mazahua con preguntas desafiantes. Evalúa gramática, vocabulario y comprensión.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Preguntas y Respuestas',
        description: 'Pon a prueba tus conocimientos del idioma mazahua con preguntas desafiantes. Evalúa gramática, vocabulario y comprensión.',
        icon: '❓',
        materialIcon: 'quiz',
        basePath: '/games/quiz',
```

## 🃏
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">🃏</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pares</p>
```

### File: client\src\components\Games\Loteria\LoteriaAccessPanel.jsx
Context:
```jsx
            subtitle="Selecciona las cartas"
            gameBasePath="/games/loteria"
            cardIcon="🃏"
            tipStudent="Selecciona las cartas del tablero que coincidan con las que aparecen en la pila"
            tipTeacher="Crea actividades de lotería con palabras e imágenes en mazahua"
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
        playAudio: cfg1.playAudio,
        isMazahua: cfg1.isMazahua,
        emoji: w.emoji || '🃏',
    }));

```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
        playAudio: cfg0.playAudio,
        isMazahua: cfg0.isMazahua,
        emoji: w.emoji || '🃏',
    }));

```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                    <div className="lot-modal" onClick={e => e.stopPropagation()}>
                        <div className="lot-modal-icon">
                            {loteriaAlert === 'not_all_selected' ? '🃏' : '⏳'}
                        </div>
                        <h3 className="lot-modal-title">
```

### File: client\src\components\Games\Memorama\MemoramaAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.MEMORY_GAME}
            icon="🃏"
            title="Memorama"
            subtitle="Emparejar Pares"
```

### File: client\src\components\Games\Pares\ParesAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.PAIRS}
            icon="🃏"
            title="Pares"
            subtitle="Enlaza los elementos"
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                            <div className="cfg-toggle-group">
                                <button className={`cfg-toggle-btn ${interactionType === 'QUESTIONNAIRE' ? 'active' : ''}`} onClick={() => handleInteractionChange('QUESTIONNAIRE')}>❓ Quiz</button>
                                <button className={`cfg-toggle-btn ${interactionType === 'PAIRS' ? 'active' : ''}`} onClick={() => handleInteractionChange('PAIRS')}>🃏 Pares</button>
                                <button className={`cfg-toggle-btn ${interactionType === 'MEDIA' ? 'active' : ''}`} onClick={() => handleInteractionChange('MEDIA')}>▶️ Contenido</button>
                            </div>
```

## ⏸
### File: client\src\components\common\ActivitiesPanel.jsx
Context:
```jsx
                                        </div>
                                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">⏸️</div>
                                            <div>
                                                <p className="text-sm text-gray-500">Pausadas</p>
```

### File: client\src\components\common\MediaPlayerView.jsx
Context:
```jsx
                <div className="controls-row">
                    <button className="btn-control" onClick={togglePlay}>
                        {isPlaying ? '⏸' : '▶️'}
                    </button>

```

### File: client\src\components\Games\Intruso\IntrusoGameView.jsx
Context:
```jsx
            <div className="game-top-bar">
                <button className="game-top-bar__back-btn" onClick={() => returnToMap ? navigate('/estudiante/mapa') : navigate(-1)}>
                    ⏸
                </button>
                <div className="intruso-score-badge">
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
                    maxWidth: '360px', width: '100%'
                }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>⏸️</span>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Juego Pausado
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
            {/* Top Bar */}
            <div className="game-top-bar">
                <button className="game-top-bar__back-btn" onClick={togglePause}>⏸</button>

                {combo >= 2 && (
```

## ▶
### File: client\src\components\common\MediaPlayerView.jsx
Context:
```jsx
                <div className="controls-row">
                    <button className="btn-control" onClick={togglePlay}>
                        {isPlaying ? '⏸' : '▶️'}
                    </button>

```

### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx
                onClick={() => onPlay(activity.id)}
            >
                ▶️ ¡Jugar Ahora!
            </button>
        </div>
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                                            disabled={startingGame}
                                        >
                                            {startingGame ? 'Cargando...' : '▶️ ¡Jugar Ahora!'}
                                        </button>
                                    </div>
```

### File: client\src\components\Games\Laberinto\LaberintoControls.jsx
Context:
```jsx
                <button className="dpad-btn left" onClick={() => onMove(-1, 0)}>◀</button>
                <div className="dpad-center"></div>
                <button className="dpad-btn right" onClick={() => onMove(1, 0)}>▶</button>
                <button className="dpad-btn down" onClick={() => onMove(0, 1)}>▼</button>
            </div>
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
                        }}
                    >
                        ▶️ Continuar
                    </button>
                    <button
```

### File: client\src\components\Map\GameMap.jsx
Context:
```jsx
                                                    onClick={() => handlePlayGame(game)}
                                                >
                                                    {startingGameId === game.id ? 'Cargando...' : '▶ Comenzar'}
                                                </button>
                                            </div>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                <button className={`cfg-toggle-btn ${interactionType === 'QUESTIONNAIRE' ? 'active' : ''}`} onClick={() => handleInteractionChange('QUESTIONNAIRE')}>❓ Quiz</button>
                                <button className={`cfg-toggle-btn ${interactionType === 'PAIRS' ? 'active' : ''}`} onClick={() => handleInteractionChange('PAIRS')}>🃏 Pares</button>
                                <button className={`cfg-toggle-btn ${interactionType === 'MEDIA' ? 'active' : ''}`} onClick={() => handleInteractionChange('MEDIA')}>▶️ Contenido</button>
                            </div>
                        </div>
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx
                        <div className="modal-actions">
                            <button className="btn-play" onClick={() => handlePlay(selectedItem)}>
                                ▶️ Comenzar
                            </button>
                        </div>
```

### File: client\src\pages\student\StudentActivities.jsx
Context:
```jsx
                                    {/* CTA */}
                                    <div className="w-full py-3 text-center text-white font-semibold rounded-xl transition-colors shrink-0" style={{ backgroundColor: game.color }}>
                                        ▶️ Entrar
                                    </div>
                                </div>
```

## 💡
### File: client\src\components\Dashboard\DailyWisdom.jsx
Context:
```jsx
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full mb-4">
                    <span className="text-lg">💡</span>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        {data.badge}
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
            <div className="gap-footer">
                <small>
                    💡 Tip: {userRole === 'teacher' ? tipTeacher : tipStudent}
                </small>
            </div>
```

## ©
### File: client\src\components\Footer.jsx
Context:
```jsx
                <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        © 2026 NTS'I FÍYO. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 text-xs text-text-sub-light dark:text-text-sub-dark">
```

## 🟡
### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx

    function getDifficultyLabel(difficulty) {
        const labels = { 'EASY': '🟢 Fácil', 'MEDIUM': '🟡 Medio', 'HARD': '🔴 Difícil' };
        return labels[difficulty] || difficulty;
    }
```

### File: client\src\utils\difficultyBadges.js
Context:
```jsx
const DIFFICULTY_BADGES = {
    'EASY': { id: 'EASY', label: 'Fácil', color: 'bg-green-100 text-green-700', dot: '🟢', hexColor: '#22c55e' },
    'MEDIUM': { id: 'MEDIUM', label: 'Medio', color: 'bg-amber-100 text-amber-700', dot: '🟡', hexColor: '#f59e0b' },
    'HARD': { id: 'HARD', label: 'Difícil', color: 'bg-red-100 text-red-700', dot: '🔴', hexColor: '#ef4444' },
};
```

## ✏
### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx
                        onClick={(e) => { e.stopPropagation(); onEdit(activity.id); }}
                        title="Editar"
                    >✏️</button>
                </div>
            )}
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                                                    onClick={(e) => { e.stopPropagation(); handleEditActivity(activity.id); }}
                                                    title="Editar"
                                                >✏️</button>
                                            </div>
                                        )}
```

## 🎯
### File: client\src\components\Games\GamePanel\ActivityCard.jsx
Context:
```jsx
            <div className="activity-card-stats">
                <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                {(activity.teacherDTO || activity.teacher) && (
                    <span>👤 {(activity.teacherDTO || activity.teacher).firstName}</span>
```

### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                                        <div className="gap-card-stats">
                                            <span>{'⭐ ' + (activity.experience || 0) + ' XP'}</span>
                                            <span>{'🎯 ' + (activity.totalQuestions || 0) + ' items'}</span>
                                            {activity.teacherDTO && (
                                                <span>👤 {activity.teacherDTO.firstName}</span>
```

### File: client\src\components\Map\GameMap.jsx
Context:
```jsx
                                            <div className="map-game-actions">
                                                <div className="map-game-questions">
                                                    🎯 {game.totalQuestions || 0} ítems
                                                </div>
                                                <button
```

## ⬅
### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                }}
            >
                ⬅️ Volver
            </button>

```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '0.5rem' }}>
                        Desliza ➡️ si coincide, ⬅️ si no
                    </p>
                </div>
```

### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                <aside className="cfg-left-sidebar">
                    <button className="cfg-btn-back" onClick={() => window.history.back()}>
                        ⬅ Regresar
                    </button>
                    <div className="cfg-sidebar-card">
```

## ✨
### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '36px', border: '3px solid #fed7aa'
                    }}>✨</div>
                    <h2>Crear Nueva Actividad</h2>
                    <p>Diseña actividades personalizadas de {title} para tus alumnos.</p>
```

## 🎒
### File: client\src\components\Games\GamePanel\GameAccessPanel.jsx
Context:
```jsx
                    ) : activities.length === 0 ? (
                        <div className="gap-no-activities">
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🎒</span>
                            <p style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>No hay actividades disponibles</p>
                            <p>Pide a tu maestro que cree una actividad para ti</p>
```

## 🎉
### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
    const perf = getPerformance(percentage);
    const messages = {
        perfecto: { icon: '🎉', title: '¡PERFECTO!', sub: '¡No fallaste ni una!' },
        excelente: { icon: '⭐', title: '¡Increíble!', sub: '¡Muy buen trabajo!' },
        bueno: { icon: '✓', title: '¡Bien hecho!', sub: '¡Sigue así!' },
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                <div className={`lot-feedback-banner ${feedback}`}>
                    {feedback === 'correct'
                        ? `¡Correcto! +${CORRECT_PTS} pts 🎉`
                        : `¡Aún no ha salido! -${PENALTY_PTS} pts 😅`}
                </div>
```

## 💪
### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
        excelente: { icon: '⭐', title: '¡Increíble!', sub: '¡Muy buen trabajo!' },
        bueno: { icon: '✓', title: '¡Bien hecho!', sub: '¡Sigue así!' },
        'necesita-mejorar': { icon: '💪', title: '¡Sigue practicando!', sub: '¡Tú puedes!' }
    };
    return messages[perf];
```

## ⏱
### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                            <div className="gs-metric">
                                <span className="gs-metric-label">Tiempo</span>
                                <span className="gs-metric-value">⏱ {formatTime(timeElapsed)}</span>
                            </div>
                        </div>
```

### File: client\src\components\Games\Laberinto\LaberintoGameView.jsx
Context:
```jsx
                <button className="game-top-bar__back-btn" onClick={() => returnToMap ? navigate('/estudiante/mapa') : navigate('/games/laberinto')} title="Salir">‹</button>
                <span className="game-top-bar__title">{activityTitle}</span>
                <div className="game-top-bar__timer">⏱ {formatTime(timeLeft)}</div>
            </div>

```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                <button className="game-top-bar__back-btn" onClick={() => navigate('/games/loteria')} title="Salir">‹</button>
                <span className="game-top-bar__title">Lotería</span>
                <div className="game-top-bar__timer">⏱ {formatTime(elapsed)}</div>
            </div>

```

### File: client\src\components\Games\Memorama\MemoramaGameView.jsx
Context:
```jsx
                <button className="game-top-bar__back-btn" onClick={() => returnToMap ? navigate('/estudiante/mapa') : navigate('/games/memorama')} title="Salir">‹</button>
                <span className="game-top-bar__title">Memorama</span>
                <div className="game-top-bar__timer">⏱ {formatTime(elapsed)}</div>
            </div>

```

### File: client\src\components\Games\Pares\ParesGameView.jsx
Context:
```jsx
                >‹</button>
                <span className="game-top-bar__title">Enlazar Elementos</span>
                <div className="game-top-bar__timer">⏱ {formatTime(elapsed)}</div>
            </div>

```

### File: client\src\components\Games\Rompecabezas\RompecabezasGameView.jsx
Context:
```jsx
                fontVariantNumeric: 'tabular-nums'
            }}>
                ⏱ {formatTime(elapsed)}
            </div>
        </div>
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx
                        <h2 className="modal-title">{selectedItem.title}</h2>
                        <div className="modal-meta">
                            <span>⏱️ {selectedItem.duration}s</span>
                            <span>⭐ Dificultad: {selectedItem.difficult}</span>
                        </div>
```

## 🔄
### File: client\src\components\Games\GamePanel\GameSummary.jsx
Context:
```jsx
                <div className="gs-actions">
                    {onRetry && (
                        <button className="gs-btn gs-btn-retry" onClick={onRetry}>🔄 Reintentar</button>
                    )}
                    <button className="gs-btn gs-btn-exit" onClick={onExit}>✓ Continuar</button>
```

## 🕵
### File: client\src\components\Games\Intruso\IntrusoAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.INTRUDER}
            icon="🕵️"
            title="Encuentra al Intruso"
            subtitle="Selecciona la palabra que no pertenece al grupo"
```

### File: client\src\components\Games\Intruso\IntrusoAccessPanel.jsx
Context:
```jsx
            subtitle="Selecciona la palabra que no pertenece al grupo"
            gameBasePath="/games/intruso"
            cardIcon="🕵️"
            tipStudent="Encuentra al intruso rápidamente para ganar más XP"
        />
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.INTRUDER,
        title: 'El Intruso',
        label: '🕵️ Intruso',
        subtitle: 'Encuentra al Intruso',
        description: 'Identifica qué palabra no pertenece al grupo. Mejora tu vocabulario y capacidad de categorización.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Encuentra al Intruso',
        description: 'Identifica qué palabra no pertenece al grupo. Mejora tu vocabulario y capacidad de categorización.',
        icon: '🕵️',
        materialIcon: 'psychology',
        basePath: '/games/intruso',
```

## 🔍
### File: client\src\components\Games\Intruso\IntrusoGameView.jsx
Context:
```jsx
            <div className="intruso-question-header animate-pop" key={`header-${currentQuestionIndex}`}>
                <div className="intruso-category-pill">
                    🔍 Encuentra al Intruso
                </div>

```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.FIND_THE_WORD,
        title: 'Encuentra Palabra',
        label: '🔍 Encuentra Palabra',
        subtitle: 'Localiza la palabra correcta',
        description: 'Localiza la palabra correcta basándote en su definición o pista.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Localiza la palabra correcta',
        description: 'Localiza la palabra correcta basándote en su definición o pista.',
        icon: '🔍',
        materialIcon: 'search',
        basePath: '/games/encuentra_palabra',
```

## 🀄
### File: client\src\components\Games\Laberinto\LaberintoAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.MAZE}
            icon="🀄"
            title="Laberinto"
            subtitle="Encuentra la salida del laberinto"
```

### File: client\src\components\Games\Laberinto\LaberintoAccessPanel.jsx
Context:
```jsx
            subtitle="Encuentra la salida del laberinto"
            gameBasePath="/games/laberinto"
            cardIcon="🀄"
            tipStudent="Encuentra la salida del laberinto rápidamente para ganar más XP"
        />
```

## ◀
### File: client\src\components\Games\Laberinto\LaberintoControls.jsx
Context:
```jsx
            <div className="laberinto-dpad">
                <button className="dpad-btn up" onClick={() => onMove(0, -1)}>▲</button>
                <button className="dpad-btn left" onClick={() => onMove(-1, 0)}>◀</button>
                <div className="dpad-center"></div>
                <button className="dpad-btn right" onClick={() => onMove(1, 0)}>▶</button>
```

## 🎰
### File: client\src\components\Games\Loteria\LoteriaAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.LOTTERY}
            icon="🎰"
            title="Lotería"
            subtitle="Selecciona las cartas"
```

### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                    ) : (
                        <div className="lot-baraja-waiting">
                            <span className="lot-baraja-waiting-icon">🎰</span>
                            <span className="lot-baraja-waiting-text">Iniciando...</span>
                        </div>
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.LOTTERY,
        title: 'Lotería',
        label: '🎰 Lotería',
        subtitle: 'Selecciona las cartas',
        description: 'Selecciona las cartas de tu tablero que coincidan con las que van apareciendo en la pila. ¡Rápido y sin penalizaciones para ganar más puntos!',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Selecciona las cartas',
        description: 'Selecciona las cartas de tu tablero que coincidan con las que van apareciendo en la pila. ¡Rápido y sin penalizaciones para ganar más puntos!',
        icon: '🎰',
        materialIcon: 'casino',
        basePath: '/games/loteria',
```

## 😕
### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
        <div className="game-error-container">
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', textAlign: 'center', maxWidth: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
                <p style={{ fontSize: '48px', marginBottom: '0.5rem' }}>😕</p>
                <h2 style={{ color: '#E84C0A', fontFamily: 'Poppins,sans-serif' }}>Actividad no encontrada</h2>
                <p style={{ color: '#374151', margin: '0.5rem 0 1.5rem' }}>{loadError}</p>
```

### File: client\src\components\Games\Memorama\MemoramaGameView.jsx
Context:
```jsx
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)', maxWidth: '380px'
            }}>
                <p style={{ fontSize: '48px', marginBottom: '1rem' }}>😕</p>
                <h2 style={{ color: '#E65100', fontFamily: 'Poppins, sans-serif' }}>Actividad no encontrada</h2>
                <p style={{ color: '#374151', margin: '0.5rem 0 1.5rem' }}>No se pudo cargar la actividad.</p>
```

### File: client\src\components\Games\Rompecabezas\RompecabezasGameView.jsx
Context:
```jsx
                    textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxWidth: '400px'
                }}>
                    <p style={{ fontSize: '48px', marginBottom: '1rem' }}>😕</p>
                    <h2 style={{ color: '#E65100', fontFamily: 'Poppins, sans-serif', marginBottom: '0.5rem' }}>
                        Actividad no encontrada
```

## 🎊
### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                    onClick={handleLoteriaButton}
                >
                    🎊 ¡Lotería!
                </button>
            </div>
```

## ⏳
### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                    <div className="lot-modal" onClick={e => e.stopPropagation()}>
                        <div className="lot-modal-icon">
                            {loteriaAlert === 'not_all_selected' ? '🃏' : '⏳'}
                        </div>
                        <h3 className="lot-modal-title">
```

### File: client\src\components\Games\Quiz\QuizGameView.jsx
Context:
```jsx
        return (
            <div className="quiz-access-panel" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <p>⏳ Cargando quiz...</p>
            </div>
        );
```

## 😅
### File: client\src\components\Games\Loteria\LoteriaGameView.jsx
Context:
```jsx
                    {feedback === 'correct'
                        ? `¡Correcto! +${CORRECT_PTS} pts 🎉`
                        : `¡Aún no ha salido! -${PENALTY_PTS} pts 😅`}
                </div>
            )}
```

## 🎴
### File: client\src\components\Games\Memorama\MemoramaAccessPanel.jsx
Context:
```jsx
            subtitle="Emparejar Pares"
            gameBasePath="/games/memorama"
            cardIcon="🎴"
            tipStudent="Encuentra los pares para completar el memorama"
            tipTeacher="Crea pares de palabras e imágenes para el memorama"
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaAccessPanel.jsx
Context:
```jsx
            subtitle="Desliza a la derecha si coincide, a la izquierda si no"
            gameBasePath="/games/memoria_rapida"
            cardIcon="🎴"
            tipStudent="Desliza rápido y acumula combos para ganar más XP"
            tipTeacher="Crea actividades personalizadas de Memoria Rápida para tus alumnos"
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Tarjetas de Memoria',
        description: 'Aprende vocabulario y pronunciación mazahua emparejando tarjetas interactivas. Ejercita tu memoria mientras descubres nuevas palabras.',
        icon: '🎴',
        materialIcon: 'style',
        basePath: '/games/memoria_rapida',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.MEMORY_GAME,
        title: 'Memorama',
        label: '🎴 Memory Game',
        subtitle: 'Emparejar Pares',
        description: 'Voltea las cartas y encuentra todas las parejas. Aprende vocabulario mazahua emparejando palabras con su significado en español o imágenes.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Emparejar Pares',
        description: 'Voltea las cartas y encuentra todas las parejas. Aprende vocabulario mazahua emparejando palabras con su significado en español o imágenes.',
        icon: '🎴',
        materialIcon: 'style',
        basePath: '/games/memorama',
```

## ⚡
### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.FAST_MEMORY}
            icon="⚡"
            title="Memoria Rápida"
            subtitle="Desliza a la derecha si coincide, a la izquierda si no"
```

### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
                {/* Speed indicator */}
                <div className="mr-speed-indicator">
                    ⚡ {Math.round((1 - (speed - MIN_SPEED) / (BASE_SPEED - MIN_SPEED)) * 100)}%
                </div>
            </div>
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.FAST_MEMORY,
        title: 'Memoria Rápida',
        label: '⚡ Memoria Rápida',
        subtitle: 'Tarjetas de Memoria',
        description: 'Aprende vocabulario y pronunciación mazahua emparejando tarjetas interactivas. Ejercita tu memoria mientras descubres nuevas palabras.',
```

## ➡
### File: client\src\components\Games\MemoriaRapida\MemoriaRapidaGameView.jsx
Context:
```jsx
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '0.5rem' }}>
                        Desliza ➡️ si coincide, ⬅️ si no
                    </p>
                </div>
```

## 🧩
### File: client\src\components\Games\Rompecabezas\RompecabezasAccessPanel.jsx
Context:
```jsx
        <GameAccessPanel
            gameType={ActivityTypes.PUZZLE}
            icon="🧩"
            title="Rompecabezas"
            subtitle="Completa la frase eligiendo la pieza correcta"
```

### File: client\src\components\Games\Rompecabezas\RompecabezasAccessPanel.jsx
Context:
```jsx
            subtitle="Completa la frase eligiendo la pieza correcta"
            gameBasePath="/games/rompecabezas"
            cardIcon="🧩"
            tipStudent="Elige la pieza correcta para completar la frase"
            tipTeacher="Crea actividades y tus alumnos aprenderán completando frases"
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.PUZZLE,
        title: 'Rompecabezas',
        label: '🧩 Rompecabezas',
        subtitle: 'Completa la Frase',
        description: 'Selecciona la pieza correcta para completar la frase. Aprende vocabulario mazahua a través de frases contextuales en ejercicios prácticos.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Completa la Frase',
        description: 'Selecciona la pieza correcta para completar la frase. Aprende vocabulario mazahua a través de frases contextuales en ejercicios prácticos.',
        icon: '🧩',
        materialIcon: 'extension',
        basePath: '/games/rompecabezas',
```

## 🌿
### File: client\src\components\landing\HeroCinematic.jsx
Context:
```jsx
            >
                <span className="hero-cinematic__badge">
                    🌿 Plataforma Educativa en Lengua Mazahua
                </span>

```

## 🗣
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                <SwitchToggle label="Texto" icon="📝" checked={config.showText} onChange={handleText} />
                <SwitchToggle label="Audio" icon="🔊" checked={config.playAudio} onChange={v => setConfig({ ...config, playAudio: v })} />
                <SwitchToggle label="Mazahua" icon="🗣️" checked={config.isMazahua} onChange={handleMazahua} />
            </div>
        </div>
```

## ⚙
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                    </button>
                    <div className="cfg-sidebar-card">
                        <h3 className="cfg-sidebar-card-title">⚙️ General</h3>
                        <div className="cfg-sidebar-section">
                            <label>Nombre</label>
```

## 😊
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        onClick={() => setDifficult(d)}
                                    >
                                        {d === 'EASY' ? '😊' : d === 'MEDIUM' ? '🤔' : '🔥'}
                                    </button>
                                ))}
```

## 🤔
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        onClick={() => setDifficult(d)}
                                    >
                                        {d === 'EASY' ? '😊' : d === 'MEDIUM' ? '🤔' : '🔥'}
                                    </button>
                                ))}
```

## 🔥
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        onClick={() => setDifficult(d)}
                                    >
                                        {d === 'EASY' ? '😊' : d === 'MEDIUM' ? '🤔' : '🔥'}
                                    </button>
                                ))}
```

## 💾
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                            </div>
                            <button className="cfg-btn-publish" onClick={handleSubmit}>
                                {isEditMode ? '💾 Actualizar' : '🚀 Publicar'}
                            </button>
                        </div>
```

## 🇪
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        <SwitchToggle 
                                            label="Permitir habilitar/deshabilitar subtítulos en español" 
                                            icon="🇪🇸" 
                                            checked={allowSpanishToggle} 
                                            onChange={setAllowSpanishToggle} 
```

## 🇸
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        <SwitchToggle 
                                            label="Permitir habilitar/deshabilitar subtítulos en español" 
                                            icon="🇪🇸" 
                                            checked={allowSpanishToggle} 
                                            onChange={setAllowSpanishToggle} 
```

## 🗑
### File: client\src\components\Teacher\ConfigurationGameView.jsx
Context:
```jsx
                                        </div>
                                        <div className="cfg-item-status">
                                            {questions.length > 1 && <button className="cfg-btn-delete" onClick={() => removeQ(q.id)}>🗑️</button>}
                                        </div>
                                    </div>
```

## 🕹
### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.MAZE,
        title: 'Laberinto',
        label: '🕹️ Laberinto',
        subtitle: 'Traza el camino',
        description: 'Encuentra tu camino en el laberinto y une los conceptos sin equivocarte.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Traza el camino',
        description: 'Encuentra tu camino en el laberinto y une los conceptos sin equivocarte.',
        icon: '🕹️',
        materialIcon: 'route',
        basePath: '/games/laberinto',
```

## 🎵
### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.MEDIA_SONG,
        title: 'Canción',
        label: '🎵 Canción',
        subtitle: 'Actividad con canción',
        description: 'Disfruta y aprende con esta actividad musical en mazahua.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Actividad con canción',
        description: 'Disfruta y aprende con esta actividad musical en mazahua.',
        icon: '🎵',
        materialIcon: 'music_note',
        basePath: '/games/cancion',
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx
    { id: ContentType.LEYENDAS, label: 'Leyendas', icon: '🗺️' },
    { id: ContentType.CUENTOS, label: 'Cuentos', icon: '📖' },
    { id: ContentType.CANCIONES, label: 'Canciones', icon: '🎵' }
];

```

## 📖
### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.MEDIA_ANECDOTE,
        title: 'Anécdota',
        label: '📖 Anécdota',
        subtitle: 'Actividad con anécdota',
        description: 'Aprende del contexto y la historia mediante anécdotas.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Actividad con anécdota',
        description: 'Aprende del contexto y la historia mediante anécdotas.',
        icon: '📖',
        materialIcon: 'menu_book',
        basePath: '/games/anecdota',
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx
    { id: ContentType.POEMAS, label: 'Poemas', icon: '📜' },
    { id: ContentType.LEYENDAS, label: 'Leyendas', icon: '🗺️' },
    { id: ContentType.CUENTOS, label: 'Cuentos', icon: '📖' },
    { id: ContentType.CANCIONES, label: 'Canciones', icon: '🎵' }
];
```

## 🗺
### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.MEDIA_LEGEND,
        title: 'Leyenda',
        label: '🗺️ Leyenda',
        subtitle: 'Actividad con leyenda',
        description: 'Descubre historias tradicionales y expande tu conocimiento cultural.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Actividad con leyenda',
        description: 'Descubre historias tradicionales y expande tu conocimiento cultural.',
        icon: '🗺️',
        materialIcon: 'map',
        basePath: '/games/leyenda',
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx
const TABS = [
    { id: ContentType.POEMAS, label: 'Poemas', icon: '📜' },
    { id: ContentType.LEYENDAS, label: 'Leyendas', icon: '🗺️' },
    { id: ContentType.CUENTOS, label: 'Cuentos', icon: '📖' },
    { id: ContentType.CANCIONES, label: 'Canciones', icon: '🎵' }
```

## 📜
### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.MEDIA_POEM,
        title: 'Poema',
        label: '📜 Poema',
        subtitle: 'Actividad con poema',
        description: 'Aprende vocabulario a través de la poesía y cultura mazahua.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Actividad con poema',
        description: 'Aprende vocabulario a través de la poesía y cultura mazahua.',
        icon: '📜',
        materialIcon: 'auto_stories',
        basePath: '/games/poema',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        type: ActivityTypes.PAIRS,
        title: 'Pares',
        label: '📜 Pares',
        subtitle: 'Enlaza los pares',
        description: 'Une las cartas del lado izquierdo con su par del lado derecho para completar los desafíos.',
```

### File: client\src\config\activityConfig.js
Context:
```jsx
        subtitle: 'Enlaza los pares',
        description: 'Une las cartas del lado izquierdo con su par del lado derecho para completar los desafíos.',
        icon: '📜',
        materialIcon: 'auto_stories',
        basePath: '/games/pares',
```

### File: client\src\pages\common\ContentSection.jsx
Context:
```jsx

const TABS = [
    { id: ContentType.POEMAS, label: 'Poemas', icon: '📜' },
    { id: ContentType.LEYENDAS, label: 'Leyendas', icon: '🗺️' },
    { id: ContentType.CUENTOS, label: 'Cuentos', icon: '📖' },
```

## 🏆
### File: client\src\pages\student\StudentActivities.jsx
Context:
```jsx
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <div>
```

## 📚
### File: client\src\pages\student\StudentAssignments.jsx
Context:
```jsx
                        ) : activities.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-indigo-100 max-w-2xl mx-auto">
                                <span className="text-6xl block mb-4">📚</span>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Todo al día!</h3>
                                <p className="text-gray-500 text-lg">No tienes nuevas asignaciones pendientes.</p>
```

## ⚪
### File: client\src\utils\difficultyBadges.js
Context:
```jsx

export const getDifficultyBadge = (diff) => {
    return DIFFICULTY_BADGES[diff] || { id: diff, label: diff, color: 'bg-gray-100 text-gray-700', dot: '⚪', hexColor: '#6b7280' };
};

```

