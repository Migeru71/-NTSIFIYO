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
        return await apiConfig.get(`/api/media?type=${type}&page=0&size=50`);
    },

    /**
     * Obtiene los recursos de transmisión para un elemento multimedia
     * @param {number} mediaId - ID del elemento multimedia
     * @returns {Promise<{url: string, espSubtitlesUrl: string, mazSubtitlesUrl: string}>}
     */
    getMediaStream: async (mediaId) => {
        return await apiConfig.get(`/api/media/${mediaId}/stream`);
    },

    /**
     * Sube un nuevo recurso multimedia (video/audio) con subtítulos.
     * @param {FormData} formData - Datos del formulario multipart
     * @returns {Promise<any>}
     */
    uploadMedia: async (formData) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiConfig.baseUrl}/api/media`, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        });
        return apiConfig.handleResponse(response);
    }
};

export default MediaService;
