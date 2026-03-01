// client/src/services/RompecabezasService.js
// Servicio de API para el juego de Rompecabezas
import apiConfig from './apiConfig';

const RompecabezasService = {

    /**
     * Obtiene la lista de actividades de tipo PUZZLE
     * GET /api/activities/PUZZLE
     * @returns {{ success: boolean, data: Array, error?: string }}
     */
    async getActivities() {
        try {
            const response = await apiConfig.get('/api/activities/PUZZLE');
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

export default RompecabezasService;
