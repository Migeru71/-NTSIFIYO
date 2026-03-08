// client/src/services/ActivityApiService.js
// Servicio de actividades que conecta con el API real
// Este servicio complementa ActivityService.js para operaciones con el backend

import apiConfig from './apiConfig';

class ActivityApiService {
    /**
     * Obtener actividades por tipo (vía /api/activities/{type})
     * GET /api/activities/{type}?page=#
     * @param {string} type - Tipo de actividad (FAST_MEMORY, QUIZ, INTRUDER, PUZZLE)
     * @param {number} page - Número de página
     * @returns {Promise<Object>} - Paginated Activity response
     */
    async getActivitiesByGameType(type, page = 0) {
        try {
            const response = await apiConfig.get(`/api/games/${type}?page=${page}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: { content: [] }
            };
        }
    }

    /**
     * Iniciar una actividad de juego
     * POST /api/activities/start/game/{gameId}
     * @param {number} gameId - ID del juego
     * @returns {Promise<Object>} - StartGameResponseDTO
     */
    async startGame(gameId) {
        try {
            const response = await apiConfig.post(`/api/activities/start/game/${gameId}`);
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
     * Obtener detalles de una actividad
     * GET /api/activities/{id}
     * @param {number} id - ID de la actividad
     * @returns {Promise<Object>} - DetailResultListDTO
     */
    async getActivityDetails(id) {
        try {
            const response = await apiConfig.get(`/api/activities/${id}`);
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
     * GET /api/activities/group/{grade}
     * @param {number} grade - Grado escolar
     * @returns {Promise<Object>} - ActivityList
     */
    async getAssignedActivities(grade) {
        try {
            const response = await apiConfig.get(`/api/activities/group/${grade}`);
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
     * Iniciar una actividad (Legacy - v1)
     * POST /api/activities/start/{game}
     */
    /**
     * Iniciar una actividad (Legacy - v1)
     * POST /api/activities/start/{game}
     */
    async startActivity(gameId, fromAssignment = false) {
        try {
            await apiConfig.post(`/api/activities/start/${gameId}?fromAssignment=${fromAssignment}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtener asignaciones para un estudiante
     * GET /api/activities/student?page=#
     * @param {number} page - Número de página
     */
    async getStudentVariedActivities(page = 0) {
        try {
            const response = await apiConfig.get(`/api/activities/student?page=${page}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: { content: [] }
            };
        }
    }

    /**
     * Iniciar una actividad asignada para estudiante
     * POST /api/activities/start/{activityId}
     * @param {number} activityId - ID de la actividad
     */
    async startStudentActivity(activityId) {
        try {
            const response = await apiConfig.post(`/api/activities/start/${activityId}`);
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
     * Completar una actividad
     * POST /api/activities/complete
     */
    async completeActivity(data) {
        try {
            await apiConfig.post('/api/activities/complete', {
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
     * POST /api/activities/score
     */
    async scoreActivity(data) {
        try {
            const response = await apiConfig.post('/api/activities/score', {
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
     * POST /api/activities/assign
     */
    async assignActivity(gameId, groupId) {
        try {
            await apiConfig.post('/api/activities/assign', {
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
     * PATCH /api/activities/reward
     */
    async rewardActivity(username, activityId) {
        try {
            const response = await apiConfig.patch('/api/activities/reward', {
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

    async deleteActivity(id) {
        try {
            await apiConfig.delete(`/api/activities/${id}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtener las instancias de actividades para el grupo del maestro actual
     * GET /api/activities/instance/group
     */
    async getGroupInstances() {
        try {
            const response = await apiConfig.get('/api/activities/instance/group');
            return {
                success: true,
                data: response || []
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
     * Cambiar el estado activo/inactivo de una instancia
     * PUT /api/activities/instance/{groupId}/{gameId}
     */
    async toggleInstance(groupId, gameId, state) {
        try {
            // Asumiendo que es PUT o POST, de acuerdo al estándar REST suele ser PUT/PATCH para toggle.
            const response = await apiConfig.patch(`/api/activities/instance/${groupId}/${gameId}?state=${state}`);
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
}

export default new ActivityApiService();
