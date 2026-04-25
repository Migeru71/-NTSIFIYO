
const ActivityTypes = Object.freeze({
    questionnaire: { value: "QUESTIONNAIRE", label: "❓ Quiz",             desc: "Preguntas de opción múltiple",      color: '#7c3aed' },
    fastMemory:    { value: "FAST_MEMORY",    label: "⚡ Memoria Rápida",  desc: "Recuerda con rapidez",             color: '#E65100' },
    intruder:      { value: "INTRUDER",       label: "🕵️ Intruso",         desc: "Encuentra el que no pertenece",   color: '#d97706' },
    findTheWord:   { value: "FIND_THE_WORD",  label: "🔍 Encuentra Palabra",desc: "Localiza la palabra correcta",    color: '#0284c7' },
    mediaSong:     { value: "MEDIA_SONG",     label: "🎵 Canción",          desc: "Actividad con canción",           color: '#db2777' },
    mediaAnecdote: { value: "MEDIA_ANECDOTE", label: "📖 Anécdota",         desc: "Actividad con anécdota",          color: '#059669' },
    mediaLegend:   { value: "MEDIA_LEGEND",   label: "🗺️ Leyenda",          desc: "Actividad con leyenda",           color: '#7c3aed' },
    puzzle:        { value: "PUZZLE",         label: "🧩 Rompecabezas",     desc: "Arma la imagen o palabra",        color: '#2563eb' },
    memoryGame:    { value: "MEMORY_GAME",    label: "🎴 Memory Game",      desc: "Voltea y empareja pares",         color: '#E65100' },
    lottery:       { value: "LOTTERY",        label: "🎰 Lotería",          desc: "Juego de lotería",                color: '#b45309' },
});

/** Quiz / single-element game types */
export const QUESTIONNAIRE_TYPES = [
    ActivityTypes.questionnaire,
    ActivityTypes.fastMemory,
    ActivityTypes.intruder,
    ActivityTypes.findTheWord,
    ActivityTypes.mediaSong,
    ActivityTypes.mediaAnecdote,
    ActivityTypes.mediaLegend,
    ActivityTypes.puzzle,
];

/** Pair-based game types */
export const PAIR_TYPES = [
    ActivityTypes.memoryGame,
    ActivityTypes.lottery
];

export const getGameTypeInfo = (type) => {
    const activity = Object.values(ActivityTypes).find(a => a.value === type);
    if (activity) {
        const [icon, ...rest] = activity.label.split(' ');
        return { label: rest.join(' '), icon, color: activity.color || '#6b7280' };
    }
    return { label: type, icon: '🎮', color: '#6b7280' };
};

export default ActivityTypes;
