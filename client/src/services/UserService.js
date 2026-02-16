// client/src/services/UserService.js
// Servicio de gestión de sesiones y usuarios

import apiConfig from './apiConfig';

class UserService {
    /**
     * Iniciar sesión de usuario
     * POST /api/user/session/start
     * @returns {Promise<Object>}
     */
    async startSession() {
        try {
            await apiConfig.post('/api/user/session/start');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Terminar sesión de usuario
     * PUT /api/user/session/end
     * @returns {Promise<Object>}
     */
    async endSession() {
        try {
            await apiConfig.put('/api/user/session/end');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtener usuarios disponibles para asignación a grupos
     * GET /api/user/available
     * @returns {Promise<Object>} - StudentListDTO
     */
    async getAvailableUsers() {
        try {
            const response = await apiConfig.get('/api/user/available');
            return {
                success: true,
                data: response.students || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
}

export default new UserService();
