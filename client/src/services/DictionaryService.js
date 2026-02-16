// client/src/services/DictionaryService.js
// Servicio de diccionario Mazahua-Español

import apiConfig from './apiConfig';

class DictionaryService {
    /**
     * Obtener categorías de palabras
     * GET /api/dictionary/words/categories
     * @returns {Promise<Object>} - CategoryListDTO
     */
    async getCategories() {
        try {
            const response = await apiConfig.get('/api/dictionary/words/categories');
            return {
                success: true,
                data: response.categories || []
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
     * Obtener palabras por categoría con paginación
     * GET /api/dictionary/words/{category}?page=
     * @param {string} category - Categoría de palabras
     * @param {number} page - Número de página
     * @returns {Promise<Object>} - WordListDTO
     */
    async getWordsByCategory(category, page = 0) {
        try {
            const response = await apiConfig.get(
                `/api/dictionary/words/${encodeURIComponent(category)}?page=${page}`
            );
            return {
                success: true,
                data: response.words || []
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
     * Obtener detalles de una palabra
     * GET /api/dictionary/words/{id}
     * @param {string} id - ID de la palabra
     * @returns {Promise<Object>} - WordDetailsDTO
     */
    async getWordDetails(id) {
        try {
            const response = await apiConfig.get(`/api/dictionary/words/${id}`);
            return {
                success: true,
                data: response
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
     * Eliminar una palabra
     * DELETE /api/dictionary/words/{id}
     * @param {string} id - ID de la palabra
     * @returns {Promise<Object>}
     */
    async deleteWord(id) {
        try {
            await apiConfig.delete(`/api/dictionary/words/${id}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new DictionaryService();
