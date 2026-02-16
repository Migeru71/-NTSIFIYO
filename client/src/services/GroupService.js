// client/src/services/GroupService.js
// Servicio de gestión de grupos escolares

import apiConfig from './apiConfig';

class GroupService {
    /**
     * Obtener todos los grupos (para admin)
     * GET /api/groups
     * @returns {Promise<Object>} - GroupListDTO
     */
    async getGroups() {
        try {
            const response = await apiConfig.get('/api/groups');
            return {
                success: true,
                data: response.groups || []
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
     * Obtener grados disponibles
     * GET /api/groups/available
     * @returns {Promise<Object>} - AvailableGradeListDTO
     */
    async getAvailableGroups() {
        try {
            const response = await apiConfig.get('/api/groups/available');
            return {
                success: true,
                data: response.grades || []
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
     * Obtener estudiantes por grado
     * GET /api/groups/{grade}/students
     * @param {number} grade - Grado escolar
     * @returns {Promise<Object>} - StudentListDTO
     */
    async getStudentsByGrade(grade) {
        try {
            const response = await apiConfig.get(`/api/groups/${grade}/students`);
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

    /**
     * Cambiar estado del grupo
     * POST /api/groups/{grade}
     * @param {number} grade - Grado escolar
     * @param {Object} groupData - CreateGroupRequestDTO
     * @returns {Promise<Object>}
     */
    async changeGroupStatus(grade, groupData) {
        try {
            await apiConfig.post(`/api/groups/${grade}`, groupData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ========== GESTIÓN DE ESTUDIANTES ==========

    /**
     * Agregar estudiante a un grupo
     * POST /api/groups/{grade}/students/{student}
     * @param {number} grade - Grado escolar
     * @param {string} student - Username del estudiante
     * @returns {Promise<Object>}
     */
    async addStudentToGroup(grade, student) {
        try {
            await apiConfig.post(`/api/groups/${grade}/students/${student}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Reasignar estudiante a otro grupo
     * PUT /api/groups/{grade}/students/{student}
     * @param {number} grade - Nuevo grado escolar
     * @param {string} student - Username del estudiante
     * @returns {Promise<Object>}
     */
    async reassignStudent(grade, student) {
        try {
            await apiConfig.put(`/api/groups/${grade}/students/${student}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remover estudiante de un grupo
     * DELETE /api/groups/{grade}/students/{student}
     * @param {number} grade - Grado escolar
     * @param {string} student - Username del estudiante
     * @returns {Promise<Object>}
     */
    async removeStudentFromGroup(grade, student) {
        try {
            await apiConfig.delete(`/api/groups/${grade}/students/${student}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ========== GESTIÓN DE MAESTROS ==========

    /**
     * Agregar maestro a un grupo
     * POST /api/groups/{grade}/teacher/{teacher}
     * @param {number} grade - Grado escolar
     * @param {string} teacher - Username del maestro
     * @returns {Promise<Object>}
     */
    async addTeacherToGroup(grade, teacher) {
        try {
            await apiConfig.post(`/api/groups/${grade}/teacher/${teacher}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Reasignar maestro a otro grupo
     * PUT /api/groups/{grade}/teacher/{teacher}
     * @param {number} grade - Nuevo grado escolar
     * @param {string} teacher - Username del maestro
     * @returns {Promise<Object>}
     */
    async reassignTeacher(grade, teacher) {
        try {
            await apiConfig.put(`/api/groups/${grade}/teacher/${teacher}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remover maestro de un grupo
     * DELETE /api/groups/{grade}/teacher/{teacher}
     * @param {number} grade - Grado escolar
     * @param {string} teacher - Username del maestro
     * @returns {Promise<Object>}
     */
    async removeTeacherFromGroup(grade, teacher) {
        try {
            await apiConfig.delete(`/api/groups/${grade}/teacher/${teacher}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new GroupService();
