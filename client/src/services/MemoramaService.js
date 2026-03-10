// client/src/services/MemoramaService.js
// Servicio de API para el juego de Memorama (MEMORY_GAME)
import apiConfig from './apiConfig';

const MemoramaService = {

    /**
     * Obtiene la lista de actividades de tipo MEMORY_GAME
     * GET /api/activities/MEMORY_GAME
     * @returns {{ success: boolean, data: Array, error?: string }}
     */
    async getActivities() {
        try {
            const response = await apiConfig.get('/api/activities/MEMORY_GAME');
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
            const response = await apiConfig.post(`/api/activities/start/game/${gameId}`);
            // Respuesta: { activityId, wordIds, questions, mediaId, gameConfigs }
            return { success: true, data: response };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    }
};

export default MemoramaService;
