// client/src/data/mockMemorama.js
// Datos de ejemplo para el juego de Memorama (Memory Game — emparejar pares)
// Estructura compatible con el esquema del servidor (gameType: "MEMORY_GAME")

// Diccionario local de palabras: simula la respuesta de /api/words/{wordId}
// En producción, estas vendrán del servidor al cargar cada wordId.
export const mockWordDictionary = {
    1: { id: 1, mazahua: 'Jñaa', spanish: 'Mamá', emoji: '👩' },
    2: { id: 2, mazahua: 'Ñho', spanish: 'Agua', emoji: '💧' },
    3: { id: 3, mazahua: 'Deje', spanish: 'Cielo', emoji: '☁️' },
    4: { id: 4, mazahua: 'B\'ono', spanish: 'Árbol', emoji: '🌳' },
    5: { id: 5, mazahua: 'Xi', spanish: 'Sol', emoji: '☀️' },
    6: { id: 6, mazahua: 'Mfeni', spanish: 'Perro', emoji: '🐕' },
    7: { id: 7, mazahua: 'B\'eza', spanish: 'Casa', emoji: '🏠' },
    8: { id: 8, mazahua: 'Nthi', spanish: 'Tierra', emoji: '🌱' },
    9: { id: 9, mazahua: 'Mpo', spanish: 'Piedra', emoji: '🪨' },
    10: { id: 10, mazahua: 'Ra', spanish: 'Fuego', emoji: '🔥' },
    11: { id: 11, mazahua: 'Ki', spanish: 'Luna', emoji: '🌙' },
    12: { id: 12, mazahua: 'Nu', spanish: 'Flor', emoji: '🌸' },
};

const mockMemorama = [
    {
        id: 30001,
        name: 'Memorama — Vocabulario Básico',
        description: 'Empareja palabras en Mazahua con su significado en español. ¡8 pares!',
        difficulty: 'fácil',
        recommendedXP: 100,

        // Estructura del servidor
        gameType: 'MEMORY_GAME',
        title: 'Memorama — Vocabulario Mazahua Básico',
        totalQuestions: 0,        // El memorama NO tiene preguntas, usa wordIds
        experience: 100,
        difficult: 'EASY',

        // IDs de las palabras — generan dos cartas cada uno
        wordIds: [1, 2, 3, 4, 5, 6, 7, 8],

        questions: [],            // Vacío para este tipo de juego

        mediaId: null,

        // gameConfigs[0] → cómo mostrar LADO A de cada par (texto Mazahua)
        // gameConfigs[1] → cómo mostrar LADO B de cada par (texto Español / emoji)
        gameConfigs: [
            { showImage: false, showText: true, playAudio: false, isMazahua: true, order: 0 },
            { showImage: false, showText: true, playAudio: false, isMazahua: false, order: 1 }
        ]
    },
    {
        id: 30002,
        name: 'Memorama — Naturaleza',
        description: 'Vocabulario de naturaleza en Mazahua con emojis visuales. ¡12 pares!',
        difficulty: 'medio',
        recommendedXP: 150,

        gameType: 'MEMORY_GAME',
        title: 'Memorama — Naturaleza Mazahua',
        totalQuestions: 0,
        experience: 150,
        difficult: 'MEDIUM',

        wordIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

        questions: [],

        mediaId: null,

        gameConfigs: [
            { showImage: false, showText: true, playAudio: false, isMazahua: true, order: 0 },
            { showImage: true, showText: false, playAudio: false, isMazahua: false, order: 1 }
        ]
    }
];

export default mockMemorama;
