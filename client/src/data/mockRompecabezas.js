// client/src/data/mockRompecabezas.js
// Datos de ejemplo para el juego de Rompecabezas (Completar la frase)
// Estructura basada en el esquema del servidor (gameType: "PAIRS")

const mockRompecabezas = [
    {
        id: 20001,
        name: "Rompecabezas Mazahua — Nivel 1",
        description: "Completa las frases con la palabra correcta en español.",
        difficulty: "fácil",
        activityMode: "rompecabezas",
        recommendedXP: 100,

        // Estructura del servidor
        gameType: "PAIRS",
        title: "Rompecabezas — Español Nivel 1",
        totalQuestions: 5,
        experience: 100,
        difficult: "EASY",

        // No hay wordIds cuando hay questions
        wordIds: [],

        // 5 preguntas de completar la frase
        questions: [
            {
                question: "LA",
                responseList: [
                    { answerText: "casa", isCorrect: true, wordId: 1 },
                    { answerText: "verde", isCorrect: false, wordId: 2 }
                ]
            },
            {
                question: "EL",
                responseList: [
                    { answerText: "libro", isCorrect: false, wordId: 3 },
                    { answerText: "perro", isCorrect: true, wordId: 4 }
                ]
            },
            {
                question: "MI",
                responseList: [
                    { answerText: "mamá", isCorrect: true, wordId: 5 },
                    { answerText: "correr", isCorrect: false, wordId: 6 }
                ]
            },
            {
                question: "UN",
                responseList: [
                    { answerText: "rápido", isCorrect: false, wordId: 7 },
                    { answerText: "pájaro", isCorrect: true, wordId: 8 }
                ]
            },
            {
                question: "LOS",
                responseList: [
                    { answerText: "niños", isCorrect: true, wordId: 9 },
                    { answerText: "bonito", isCorrect: false, wordId: 10 }
                ]
            }
        ],

        mediaId: null,

        // gameConfigs[0] → cómo mostrar el TÍTULO/PREGUNTA (pieza superior)
        // gameConfigs[1] → cómo mostrar las RESPUESTAS (piezas inferiores)
        gameConfigs: [
            {
                showImage: false,
                showText: true,
                playAudio: false,
                isMazahua: false
            },
            {
                showImage: false,
                showText: true,
                playAudio: false,
                isMazahua: false
            }
        ]
    },
    {
        id: 20002,
        name: "Rompecabezas Mazahua — Nivel 2",
        description: "Completa las frases con palabras en lengua Mazahua.",
        difficulty: "medio",
        activityMode: "rompecabezas",
        recommendedXP: 150,

        gameType: "PAIRS",
        title: "Rompecabezas — Mazahua Nivel 2",
        totalQuestions: 5,
        experience: 150,
        difficult: "MEDIUM",

        wordIds: [],

        questions: [
            {
                question: "NTHI",
                responseList: [
                    { answerText: "jñaa", isCorrect: true, wordId: 11 },
                    { answerText: "xi", isCorrect: false, wordId: 12 }
                ]
            },
            {
                question: "RA",
                responseList: [
                    { answerText: "b'ono", isCorrect: false, wordId: 13 },
                    { answerText: "ñho", isCorrect: true, wordId: 14 }
                ]
            },
            {
                question: "KI",
                responseList: [
                    { answerText: "jñaa", isCorrect: true, wordId: 15 },
                    { answerText: "mfeni", isCorrect: false, wordId: 16 }
                ]
            },
            {
                question: "NU",
                responseList: [
                    { answerText: "b'eza", isCorrect: false, wordId: 17 },
                    { answerText: "ri", isCorrect: true, wordId: 18 }
                ]
            },
            {
                question: "GI",
                responseList: [
                    { answerText: "deje", isCorrect: true, wordId: 19 },
                    { answerText: "mpo", isCorrect: false, wordId: 20 }
                ]
            }
        ],

        mediaId: null,

        gameConfigs: [
            {
                showImage: false,
                showText: true,
                playAudio: false,
                isMazahua: true
            },
            {
                showImage: false,
                showText: true,
                playAudio: false,
                isMazahua: true
            }
        ]
    }
];

export default mockRompecabezas;
