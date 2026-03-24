// client/src/services/LoteriService.js
// Servicio de API para el juego de Lotería (LOTTERY)
import apiConfig from './apiConfig';

const LoteriService = {
    /**
     * Obtiene la lista de actividades de tipo LOTTERY
     * GET /api/activities/LOTTERY
     * @returns {{ success: boolean, data: Array, error?: string }}
     */
    async getActivities() {
        try {
            const response = await apiConfig.get('/api/activities/LOTTERY');
            const content = response.content || [];
            return { success: true, data: content };
        } catch (error) {
            return { success: false, data: [], error: error.message };
        }
    },

    /**
     * Inicia una partida y obtiene los datos del juego (wordIds, gameConfigs, etc.)
     * POST /api/activities/start/game/{gameId}
     * @param {number} gameId
     * @returns {{ success: boolean, data: Object|null, error?: string }}
     */
    async startGame(gameId) {
        try {
            // Respuesta: { activityId, wordIds, questions, mediaId, gameConfigs }
            const response = await apiConfig.post(`/api/activities/start/game/${gameId}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    }
};

export default LoteriService;
