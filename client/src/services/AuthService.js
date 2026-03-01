// client/src/services/AuthService.js
// Servicio de autenticación

import apiConfig from './apiConfig';

class AuthService {
    /**
     * Login de usuario
     * POST /api/auth/login
     * @param {Object} credentials - { username, password, userType, grade? }
     * @returns {Promise<Object>} - LoginResponseDTO
     */
    async login(credentials) {
        try {
            let payload = {};
            if (credentials.userType === 'STUDENT') {
                payload = {
                    listNumber: credentials.listNumber,
                    password: credentials.password,
                    grade: credentials.grade
                };
            } else {
                payload = {
                    username: credentials.username,
                    password: credentials.password,
                    grade: credentials.grade || null
                };
            }

            const response = await apiConfig.post(`/api/auth/login/${credentials.userType.toLowerCase()}`, payload);

            // Guardar token si viene en la respuesta
            if (response.jwtToken) {
                localStorage.setItem('authToken', response.jwtToken);
            }

            // Guardar información del usuario
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
            }

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Registro de visitante
     * POST /api/auth/visitor
     * @param {Object} visitorData - RegisterVisitorRequestDTO
     * @returns {Promise<Object>}
     */
    async registerVisitor(visitorData) {
        try {
            const response = await apiConfig.post('/api/auth/visitor', {
                firstname: visitorData.firstname,
                lastname: visitorData.lastname,
                email: visitorData.email,
                password: visitorData.password,
                username: visitorData.username
            });

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Cerrar sesión
     * Limpia el almacenamiento local
     */
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        return { success: true };
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Obtiene los datos del usuario actual
     * @returns {Object|null}
     */
    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Obtiene el token de autenticación
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('authToken');
    }
}

export default new AuthService();
