import { createContext, useState, useCallback, useContext, useRef } from 'react';
import ActivityApiService from '../services/ActivityApiService';

const StudentDataContext = createContext();

/**
 * Crea una sección del contexto con caché incorporado.
 * fetch()  → solo carga si no hay datos; reload() → siempre re-fetcha.
 */
function useSection(fetcher) {
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

// ── Fetchers ──────────────────────────────────────────────────────────────────

const fetchDashboard = async () => {
    const result = await ActivityApiService.getStudentDashboard();
    if (!result.success) throw new Error(result.error || 'Error al cargar el dashboard.');
    return result.data;
};

const fetchAssignments = async (page = 0) => {
    const result = await ActivityApiService.getStudentVariedActivities(page);
    if (!result.success) throw new Error(result.error || 'Error al cargar las asignaciones.');
    const raw = result.data;
    if (Array.isArray(raw)) {
        return { activities: raw, pageData: { totalPages: 1, number: 0, first: true, last: true } };
    }
    return {
        activities: raw.content || [],
        pageData: {
            totalPages: raw.totalPages || 0,
            number: raw.number || 0,
            first: raw.first !== undefined ? raw.first : true,
            last: raw.last !== undefined ? raw.last : true,
        }
    };
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const StudentDataProvider = ({ children }) => {
    const dashboard = useSection(useCallback(fetchDashboard, []));
    const assignments = useSection(useCallback(fetchAssignments, []));

    // fetchPage is a convenience wrapper to fetch a specific page (always re-fetches)
    const fetchPage = useCallback(async (page) => {
        assignments.reload(page);
    }, [assignments]);

    return (
        <StudentDataContext.Provider value={{ dashboard, assignments: { ...assignments, fetchPage } }}>
            {children}
        </StudentDataContext.Provider>
    );
};

export const useStudentData = () => {
    const ctx = useContext(StudentDataContext);
    if (!ctx) throw new Error('useStudentData debe usarse dentro de <StudentDataProvider>');
    return ctx;
};
