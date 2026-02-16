// client/src/services/ActivityApiService.js
// Servicio de actividades que conecta con el API real
// Este servicio complementa ActivityService.js para operaciones con el backend

import apiConfig from './apiConfig';

class ActivityApiService {
    /**
     * Obtener actividades por tipo
     * GET /api/activity/{type}
     * @param {string} type - Tipo de actividad
     * @returns {Promise<Object>} - ActivityList
     */
    async getActivityByType(type) {
        try {
            const response = await apiConfig.get(`/api/activity/${type}`);
            return {
                success: true,
                data: response.games || []
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
     * Obtener detalles de una actividad
     * GET /api/activity/{id}
     * @param {number} id - ID de la actividad
     * @returns {Promise<Object>} - DetailResultListDTO
     */
    async getActivityDetails(id) {
        try {
            const response = await apiConfig.get(`/api/activity/${id}`);
            return {
                success: true,
                data: response.detailResults || []
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
     * Obtener actividades asignadas a un grupo
     * GET /api/activity/group/{grade}
     * @param {number} grade - Grado escolar
     * @returns {Promise<Object>} - ActivityList
     */
    async getAssignedActivities(grade) {
        try {
            const response = await apiConfig.get(`/api/activity/group/${grade}`);
            return {
                success: true,
                data: response.games || []
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
     * Iniciar una actividad
     * POST /api/activity/start/{game}
     * @param {number} gameId - ID del juego
     * @param {boolean} fromAssignment - Si viene de una asignación
     * @returns {Promise<Object>}
     */
    async startActivity(gameId, fromAssignment = false) {
        try {
            await apiConfig.post(`/api/activity/start/${gameId}?fromAssignment=${fromAssignment}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Completar una actividad
     * POST /api/activity/complete
     * @param {Object} data - ActivityCompleteRequestDTO
     * @returns {Promise<Object>}
     */
    async completeActivity(data) {
        try {
            await apiConfig.post('/api/activity/complete', {
                activityId: data.activityId,
                startDate: data.startDate,
                correctAnswers: data.correctAnswers,
                responseLogs: data.responseLogs || [],
                gameId: data.gameId
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Puntuar una actividad
     * POST /api/activity/score
     * @param {Object} data - ExperienceRequestDTO
     * @returns {Promise<Object>} - Score como integer
     */
    async scoreActivity(data) {
        try {
            const response = await apiConfig.post('/api/activity/score', {
                difficult: data.difficult, // EASY, MEDIUM, HARD
                totalQuestions: data.totalQuestions,
                gameConfigDTO: data.gameConfigs || []
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
     * Asignar una actividad a un grupo
     * POST /api/activity/assign
     * @param {number} gameId - ID del juego
     * @param {number} groupId - ID del grupo
     * @returns {Promise<Object>}
     */
    async assignActivity(gameId, groupId) {
        try {
            await apiConfig.post('/api/activity/assign', {
                gameId: gameId,
                groupId: groupId
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Recompensar a un usuario por completar una actividad
     * PATCH /api/activity/reward
     * @param {string} username - Username del usuario
     * @param {number} activityId - ID de la actividad
     * @returns {Promise<Object>} - RewardResponseDTO
     */
    async rewardActivity(username, activityId) {
        try {
            const response = await apiConfig.patch('/api/activity/reward', {
                username: username,
                activityId: activityId
            });
            return {
                success: true,
                data: {
                    xpGained: response.xpGained,
                    actualXp: response.actualXp,
                    currentLevel: response.currentLevel,
                    isLevelUp: response.isLevelUp
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
     * Eliminar una actividad
     * DELETE /api/activity/{id}
     * @param {number} id - ID de la actividad
     * @returns {Promise<Object>}
     */
    async deleteActivity(id) {
        try {
            await apiConfig.delete(`/api/activity/${id}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new ActivityApiService();
