// client/src/services/GameService.js
// Servicio de creación de juegos

import apiConfig from './apiConfig';

class GameService {
    /**
     * Crear un nuevo juego/actividad
     * POST /api/game
     * @param {Object} gameData - GameDTO
     * @returns {Promise<Object>}
     */
    async createGame(gameData) {
        try {
            // Validar datos requeridos
            if (!gameData.gameType) {
                throw new Error('El tipo de juego es requerido');
            }
            if (!gameData.difficult) {
                throw new Error('La dificultad es requerida');
            }

            const response = await apiConfig.post('/api/game', {
                gameType: gameData.gameType, // PAIRS, QUESTIONNAIRE, MEDIA_SONG, etc.
                title: gameData.title,
                description: gameData.description,
                totalQuestions: gameData.totalQuestions,
                experience: gameData.experience,
                difficult: gameData.difficult, // EASY, MEDIUM, HARD
                wordIds: gameData.wordIds || [],
                questions: gameData.questions || [],
                mediaId: gameData.mediaId,
                gameConfigs: gameData.gameConfigs || []
            });

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Crea la configuración de un juego
     * @param {Object} config - Configuración del juego
     * @returns {Object} GameConfigDTO
     */
    createGameConfig(config = {}) {
        return {
            showImage: config.showImage ?? true,
            showText: config.showText ?? true,
            playAudio: config.playAudio ?? false,
            isMazahua: config.isMazahua ?? false
        };
    }

    /**
     * Crea una pregunta para el cuestionario
     * @param {string} question - Texto de la pregunta
     * @param {Array} answers - Lista de respuestas
     * @returns {Object} QuestionDTO
     */
    createQuestion(question, answers = []) {
        return {
            question: question,
            responseList: answers.map(answer => ({
                answerText: answer.text,
                isCorrect: answer.isCorrect,
                wordId: answer.wordId
            }))
        };
    }
}

export default new GameService();
