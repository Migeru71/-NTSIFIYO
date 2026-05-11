import React from 'react';
import apiConfig from '../../services/apiConfig';
import ActivityApiService from '../../services/ActivityApiService';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import { useTeacherActivitiesQuery, useTeacherInstancesQuery, useAllGamesQuery, useTeacherInvalidate } from '../../hooks/useTeacherQueries';

/**
 * Página de Recursos del Maestro.
 * Wrapper delgado: obtiene datos con TanStack Query y delega la UI a ActivitiesPanel.
 */
const TeacherResources = () => {
    const { data: activities = [], isLoading: loadingAct, error: errorAct } = useTeacherActivitiesQuery();
    const { data: instances  = [], isLoading: loadingInst }                 = useTeacherInstancesQuery();
    const { data: allGames = [], isLoading: loadingGames }                   = useAllGamesQuery();
    const { reloadResources }                                                = useTeacherInvalidate();

    const loading = loadingAct || loadingInst;
    const error   = errorAct?.message || '';

    const handleDelete = async (id) => {
        await apiConfig.delete(`/api/games/${id}`);
    };

    const handleAssign = async (activity) => {
        await apiConfig.post('/api/activities/assign', { gameId: activity.id });
    };

    const handleToggle = async (activityId, newState) => {
        const inst    = instances.find(i => i.game?.id === activityId || i.gameId === activityId);
        const groupId = inst?.group?.id || inst?.groupId;
        if (!groupId) throw new Error('No se encontró el grupo de la instancia.');
        const res = await ActivityApiService.toggleInstance(groupId, activityId, newState);
        if (!res.success) throw new Error(res.error || 'No se pudo cambiar el estado.');
    };

    return (
        <ActivitiesPanel
            activities={activities}
            instances={instances}
            allGames={allGames}
            loading={loading}
            loadingAllGames={loadingGames}
            error={error}
            onReload={reloadResources}
            onDeleteActivity={handleDelete}
            onAssignActivity={handleAssign}
            onToggleInstance={handleToggle}
            editRoute="/maestro/recursos/editar"
            createRoute="/maestro/recursos/crear"
            title="Mis Recursos"
            subtitle="Gestiona las actividades y juegos que has creado."
            showTabs
        />
    );
};

export default TeacherResources;
