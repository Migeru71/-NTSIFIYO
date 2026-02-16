// client/src/services/MediaService.js
// Servicio de streaming y medios

import apiConfig from './apiConfig';

class MediaService {
    /**
     * Obtener lista de medios con paginación
     * GET /api/media?page=
     * @param {number} page - Número de página
     * @returns {Promise<Object>} - ListMediaDTO
     */
    async getMedia(page = 0) {
        try {
            const response = await apiConfig.get(`/api/media?page=${page}`);
            return {
                success: true,
                data: response.mediaList || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    /**
     * Obtener recursos de streaming para un medio
     * GET /api/media/{id}/stream
     * @param {string} id - ID del medio
     * @returns {Promise<Object>} - StreamResourcesDTO
     */
    async streamMedia(id) {
        try {
            const response = await apiConfig.get(`/api/media/${id}/stream?id=${id}`);
            return {
                success: true,
                data: {
                    url: response.url,
                    subtitles: response.subtitles || []
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    /**
     * Obtener recomendaciones de medios
     * GET /api/media/recommendations
     * @returns {Promise<Object>} - RecommendedResponse
     */
    async getRecommendations() {
        try {
            const response = await apiConfig.get('/api/media/recommendations');
            return {
                success: true,
                data: {
                    games: response.games || [],
                    medias: response.medias || []
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: { games: [], medias: [] }
            };
        }
    }
}

export default new MediaService();
