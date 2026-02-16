// client/src/services/apiConfig.js
// Configuración central del API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiConfig = {
    baseUrl: API_BASE_URL,

    /**
     * Obtiene los headers para las peticiones
     * Incluye el token JWT si existe
     */
    getHeaders: () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    /**
     * Maneja la respuesta del servidor
     * @param {Response} response - Respuesta de fetch
     * @returns {Promise<any>} - Datos parseados o error
     */
    handleResponse: async (response) => {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Error: ${response.status}`);
        }

        // Manejar respuestas vacías (204 No Content)
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    },

    /**
     * Realiza una petición GET
     */
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: apiConfig.getHeaders()
        });
        return apiConfig.handleResponse(response);
    },

    /**
     * Realiza una petición POST
     */
    post: async (endpoint, body = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: apiConfig.getHeaders(),
            body: JSON.stringify(body)
        });
        return apiConfig.handleResponse(response);
    },

    /**
     * Realiza una petición PUT
     */
    put: async (endpoint, body = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: apiConfig.getHeaders(),
            body: JSON.stringify(body)
        });
        return apiConfig.handleResponse(response);
    },

    /**
     * Realiza una petición PATCH
     */
    patch: async (endpoint, body = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: apiConfig.getHeaders(),
            body: JSON.stringify(body)
        });
        return apiConfig.handleResponse(response);
    },

    /**
     * Realiza una petición DELETE
     */
    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: apiConfig.getHeaders()
        });
        return apiConfig.handleResponse(response);
    }
};

export default apiConfig;
