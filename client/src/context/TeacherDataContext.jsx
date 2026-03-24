import { createContext, useState, useCallback, useContext, useRef } from 'react';
import ActivityApiService from '../services/ActivityApiService';
import AuthService from '../services/AuthService';
import apiConfig from '../services/apiConfig';

const TeacherDataContext = createContext();

// ── Generic cached-section hook ───────────────────────────────────────────────

function useCachedSection(fetcher) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const loaded = useRef(false);

    const doFetch = useCallback(async (...args) => {
        setLoading(true);
        setError('');
        try {
            const result = await fetcher(...args);
            setData(result);
            loaded.current = true;
        } catch (err) {
            setError(err.message || 'Error de conexión.');
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    const fetch = useCallback(async (...args) => {
        if (loaded.current) return;
        await doFetch(...args);
    }, [doFetch]);

    const reload = useCallback(async (...args) => {
        await doFetch(...args);
    }, [doFetch]);

    return { data, loading, error, fetch, reload };
}

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

const fetchDashboard = async () => {
    const gId = await resolveGroupId();
    if (!gId) {
        // No group assigned yet — return empty state so the panel still renders
        return { totalStudents: 0, activeAssignments: [], alertStudents: [], completeStudents: [], groupId: null, noGroup: true };
    }
    const result = await ActivityApiService.getTeacherDashboard(gId);
    if (!result.success) throw new Error(result.error || 'Error al cargar el dashboard.');
    return { ...result.data, groupId: gId };
};

const fetchResources = async () => {
    const activities = await apiConfig.get('/api/activities/teacher');
    const instData = await ActivityApiService.getGroupInstances();
    return {
        activities: Array.isArray(activities) ? activities : [],
        instances: instData.success ? (instData.data || []) : [],
    };
};

const fetchAssignments = async () => {
    const gId = await resolveGroupId();
    if (!gId) {
        // No group assigned yet — return empty state so the panel still renders
        return { activities: [], groupId: null, noGroup: true };
    }
    const result = await ActivityApiService.getActiveAssignments(gId, true);
    if (!result.success) throw new Error(result.error || 'Error al cargar las asignaciones.');
    return { activities: result.data, groupId: gId };
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const TeacherDataProvider = ({ children }) => {
    const dashboard = useCachedSection(useCallback(fetchDashboard, []));
    const resources = useCachedSection(useCallback(fetchResources, []));
    const assignments = useCachedSection(useCallback(fetchAssignments, []));

    return (
        <TeacherDataContext.Provider value={{ dashboard, resources, assignments }}>
            {children}
        </TeacherDataContext.Provider>
    );
};

export const useTeacherData = () => {
    const ctx = useContext(TeacherDataContext);
    if (!ctx) throw new Error('useTeacherData debe usarse dentro de <TeacherDataProvider>');
    return ctx;
};
