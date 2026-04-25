// client/src/services/GameService.js
// Servicio general de API para los juegos
import apiConfig from './apiConfig';

const GameService = {

    /**
     * Obtiene la lista de actividades de tipo PUZZLE
     * GET /api/activities/{activityType}
     * @returns {{ success: boolean, data: Array, error?: string }}
     */
    async getActivities(activityType) {
        try {
            const response = await apiConfig.get(`/api/activities/${activityType}`);
            // La respuesta es paginada: { content: [...], totalElements, ... }
            const content = response.content || [];
            return { success: true, data: content };
        } catch (error) {
            return { success: false, data: [], error: error.message };
        }
    },

    /**
     * Inicia una partida y obtiene los datos del juego (preguntas, configs, etc.)
     * POST /api/activities/start/game/{gameId}
     * @param {number} gameId
     * @returns {{ success: boolean, data: Object|null, error?: string }}
     */
    async startGame(gameId) {
        try {
            const response = await apiConfig.post(`/api/activities/start/game/${gameId}`);
            // Respuesta: { activityId, wordIds, questions, mediaId, gameConfigs }
            return { success: true, data: response };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    }
};

export default GameService;
