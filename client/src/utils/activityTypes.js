
const ActivityTypes = Object.freeze({
    questionnaire: { value: "QUESTIONNAIRE", label: "❓ Quiz", desc: "Preguntas de opción múltiple" },
    fastMemory: { value: "FAST_MEMORY", label: "⚡ Memoria Rápida", desc: "Recuerda con rapidez" },
    intruder: { value: "INTRUDER", label: "🕵️ Intruso", desc: "Encuentra el que no pertenece" },
    findTheWord: { value: "FIND_THE_WORD", label: "🔍 Encuentra Palabra", desc: "Localiza la palabra correcta" },
    mediaSong: { value: "MEDIA_SONG", label: "🎵 Canción", desc: "Actividad con canción" },
    mediaAnecdote: { value: "MEDIA_ANECDOTE", label: "📖 Anécdota", desc: "Actividad con anécdota" },
    mediaLegend: { value: "MEDIA_LEGEND", label: "🗺️ Leyenda", desc: "Actividad con leyenda" },
    puzzle: { value: "PUZZLE", label: "🧩 Rompecabezas", desc: "Arma la imagen o palabra" },
    memoryGame: { value: "MEMORY_GAME", label: "🎴 Memory Game", desc: "Voltea y empareja pares" },
    lottery: { value: "LOTTERY", label: "🎰 Lotería", desc: "Juego de lotería" },
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

export default ActivityTypes;
