import React from 'react';
import apiConfig from '../../services/apiConfig';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import { useAdminActivitiesQuery, useAdminInvalidate } from '../../hooks/useAdminQueries';

/**
 * Sección de Actividades del Administrador.
 * Wrapper delgado: obtiene datos con TanStack Query y delega la UI a ActivitiesPanel.
 */
const AdminActivitiesSection = () => {
    const { data: rawData, isLoading: loading, error: errorObj } = useAdminActivitiesQuery();
    const { reloadActivities } = useAdminInvalidate();

    const activities = Array.isArray(rawData) ? rawData : (rawData?.activities || []);
    const error      = errorObj?.message || '';

    const handleDelete = async (id) => {
        await apiConfig.delete(`/api/games/${id}`);
    };

    return (
        <ActivitiesPanel
            activities={activities}
            loading={loading}
            error={error}
            onReload={reloadActivities}
            onDeleteActivity={handleDelete}
            editRoute="/admin/actividades/editar"
            createRoute="/admin/actividades/crear"
            title="Actividades"
            subtitle="Gestiona todos los juegos y actividades del sistema."
        />
    );
};

export default AdminActivitiesSection;
