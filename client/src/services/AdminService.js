// client/src/services/AdminService.js
// Servicio de administración de usuarios

import apiConfig from './apiConfig';

class AdminService {
    /**
     * Registrar un nuevo usuario
     * POST /api/admin/users
     * @param {Object} userData - RegisterRequestDTO
     * @returns {Promise<Object>} - RegisterResponseDTO
     */
    async registerUser(userData) {
        try {
            const response = await apiConfig.post('/api/admin/users', {
                firstname: userData.firstname,
                lastname: userData.lastname,
                userType: userData.userType, // STUDENT, TEACHER, ADMIN, VISITOR
                grade: userData.grade || null
            });

            return {
                success: true,
                data: {
                    username: response.username,
                    password: response.password
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Eliminar un usuario
     * DELETE /api/admin/users/{username}
     * @param {string} username - Username del usuario
     * @returns {Promise<Object>}
     */
    async deleteUser(username) {
        try {
            await apiConfig.delete(`/api/admin/users/${username}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtener todos los estudiantes
     * GET /api/admin/students
     * @returns {Promise<Object>} - StudentListDTO
     */
    async getAllStudents() {
        try {
            const response = await apiConfig.get('/api/admin/students');
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

export default new AdminService();
