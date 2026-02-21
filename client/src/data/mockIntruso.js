const intrusoActivities = [
    {
        id: 12346,
        name: "Encuentra al Intruso",
        description: "Identifica la palabra que no pertenece al grupo antes de que se acabe el tiempo.",
        difficulty: "medio",
        activityMode: "intruso",
        questions: [
            {
                question: "¿Cuál no es una fruta?",
                responseList: [
                    { answerText: "Manzana", isCorrect: false, wordId: 1 },
                    { answerText: "Plátano", isCorrect: false, wordId: 2 },
                    { answerText: "Perro", isCorrect: true, wordId: 6 },
                    { answerText: "Uva", isCorrect: false, wordId: 5 }
                ]
            },
            {
                question: "¿Cuál no es un animal?",
                responseList: [
                    { answerText: "Gato", isCorrect: false, wordId: 7 },
                    { answerText: "Conejo", isCorrect: false, wordId: 9 },
                    { answerText: "Mariposa", isCorrect: false, wordId: 10 },
                    { answerText: "Azul", isCorrect: true, wordId: 12 }
                ]
            },
            {
                question: "¿Cuál no es un color?",
                responseList: [
                    { answerText: "Rojo", isCorrect: false, wordId: 11 },
                    { answerText: "Verde", isCorrect: false, wordId: 13 },
                    { answerText: "Amarillo", isCorrect: false, wordId: 14 },
                    { answerText: "Casa", isCorrect: true, wordId: 9 }
                ]
            }
        ],
        recommendedXP: 150
    }
];

export default intrusoActivities;
