// client/src/hooks/useTeacherQueries.js
// Hooks de TanStack Query para datos del maestro

import { useQuery, useQueryClient } from '@tanstack/react-query';
import ActivityApiService from '../services/ActivityApiService';
import AuthService from '../services/AuthService';
import apiConfig from '../services/apiConfig';

// ── Query Keys ────────────────────────────────────────────────────────────────
export const teacherKeys = {
    dashboard:   () => ['teacher', 'dashboard'],
    activities:  () => ['teacher', 'activities'],
    instances:   () => ['teacher', 'instances'],
    assignments: () => ['teacher', 'assignments'],
    students:    () => ['teacher', 'students'],
    allGames:    () => ['teacher', 'allGames'],
};

// ── Shared: resolve groupId ───────────────────────────────────────────────────
async function resolveGroupId() {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser?.grade) return currentUser.grade;
    try {
        const instResult = await ActivityApiService.getGroupInstances();
        if (instResult.success && instResult.data.length > 0) {
            const id = instResult.data[0].group?.id || instResult.data[0].groupId;
            if (id) return id;
        }
    } catch (e) {
        console.error('Error resolving groupId:', e);
    }
    return null;
}

// ── Fetchers ──────────────────────────────────────────────────────────────────
async function fetchTeacherDashboard() {
    const gId = await resolveGroupId();
    if (!gId) {
        return { totalStudents: 0, activeAssignments: [], alertStudents: [], completeStudents: [], groupId: null, noGroup: true };
    }
    const result = await ActivityApiService.getTeacherDashboard(gId);
    if (!result.success) throw new Error(result.error || 'Error al cargar el dashboard.');
    return { ...result.data, groupId: gId };
}

/** Obtiene todas las actividades del teacher autenticado (mismo endpoint que admin). */
async function fetchTeacherActivities() {
    const data = await apiConfig.get('/api/activities/teacher');
    return Array.isArray(data) ? data : [];
}

/** Obtiene las instancias asignadas al grupo del teacher. */
async function fetchTeacherInstances() {
    const instData = await ActivityApiService.getGroupInstances();
    return instData.success ? (instData.data || []) : [];
}

async function fetchTeacherAssignments() {
    const gId = await resolveGroupId();
    if (!gId) {
        return { activities: [], groupId: null, noGroup: true };
    }
    const result = await ActivityApiService.getActiveAssignments(gId, true);
    if (!result.success) throw new Error(result.error || 'Error al cargar las asignaciones.');
    return { activities: result.data, groupId: gId };
}

async function fetchTeacherStudents() {
    const response = await fetch(`${apiConfig.baseUrl}/api/groups/students`, {
        headers: apiConfig.getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener los estudiantes del grupo.');
    const data = await response.json();
    return data.students || [];
}

async function fetchAllGames() {
    const result = await ActivityApiService.getAllGames();
    if (!result.success) throw new Error(result.error || 'Error al cargar los juegos.');
    return result.data;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useTeacherDashboardQuery() {
    return useQuery({
        queryKey: teacherKeys.dashboard(),
        queryFn: fetchTeacherDashboard,
    });
}

/** Query de actividades del teacher (lista general, cacheable). */
export function useTeacherActivitiesQuery() {
    return useQuery({
        queryKey: teacherKeys.activities(),
        queryFn:  fetchTeacherActivities,
        staleTime: 2 * 60 * 1000,
        gcTime:    10 * 60 * 1000,
    });
}

/** Query de instancias asignadas (específica del teacher). */
export function useTeacherInstancesQuery() {
    return useQuery({
        queryKey: teacherKeys.instances(),
        queryFn:  fetchTeacherInstances,
        staleTime: 2 * 60 * 1000,
        gcTime:    10 * 60 * 1000,
    });
}

export function useTeacherAssignmentsQuery() {
    return useQuery({
        queryKey: teacherKeys.assignments(),
        queryFn: fetchTeacherAssignments,
    });
}

export function useTeacherStudentsQuery() {
    return useQuery({
        queryKey: teacherKeys.students(),
        queryFn: fetchTeacherStudents,
    });
}

export function useAllGamesQuery() {
    return useQuery({
        queryKey: teacherKeys.allGames(),
        queryFn: fetchAllGames,
        staleTime: 5 * 60 * 1000,
        gcTime:    15 * 60 * 1000,
    });
}

/**
 * Hook para invalidar consultas del maestro (botones "Actualizar").
 */
export function useTeacherInvalidate() {
    const queryClient = useQueryClient();
    return {
        reloadDashboard:   () => queryClient.invalidateQueries({ queryKey: teacherKeys.dashboard() }),
        reloadActivities:  () => queryClient.invalidateQueries({ queryKey: teacherKeys.activities() }),
        reloadInstances:   () => queryClient.invalidateQueries({ queryKey: teacherKeys.instances() }),
        reloadResources:   () => {
            queryClient.invalidateQueries({ queryKey: teacherKeys.activities() });
            queryClient.invalidateQueries({ queryKey: teacherKeys.instances() });
            queryClient.invalidateQueries({ queryKey: teacherKeys.allGames() });
        },
        reloadAssignments: () => queryClient.invalidateQueries({ queryKey: teacherKeys.assignments() }),
        reloadStudents:    () => queryClient.invalidateQueries({ queryKey: teacherKeys.students() }),
        reloadAllGames:    () => queryClient.invalidateQueries({ queryKey: teacherKeys.allGames() }),
    };
}
