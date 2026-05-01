import apiConfig from './apiConfig';

/**
 * ContentType enums mapping to backend MediaType
 */
export const ContentType = {
    POEMAS: 'POEM',
    LEYENDAS: 'LEGEND',
    CUENTOS: 'ANECDOTE',
    CANCIONES: 'SONG'
};

const MediaService = {
    /**
     * Obtiene la lista de elementos multimedia por tipo
     * @param {string} type - Tipo de contenido (ej. 'LEGEND', 'SONG')
     */
    getMediaByType: async (type) => {
        // Asumiendo que el endpoint documentado /api/media acepta el query param 'type'
        return await apiConfig.get(`/api/media?type=${type}`);
    },

    /**
     * Obtiene los recursos de transmisión para un elemento multimedia
     * @param {number} mediaId - ID del elemento multimedia
     * @returns {Promise<{url: string, espSubtitlesUrl: string, mazSubtitlesUrl: string}>}
     */
    getMediaStream: async (mediaId) => {
        return await apiConfig.get(`/api/media/${mediaId}/stream`);
    }
};

export default MediaService;
