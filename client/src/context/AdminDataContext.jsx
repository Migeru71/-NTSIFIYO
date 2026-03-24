import { createContext, useState, useCallback, useContext, useRef } from 'react';
import AdminService from '../services/AdminService';

const AdminDataContext = createContext();

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

// ── Fetchers ──────────────────────────────────────────────────────────────────

const fetchOverview = async () => await AdminService.getAdminDashboard();
const fetchStudents = async () => await AdminService.getStudents();
const fetchTeachers = async () => await AdminService.getTeachers();
const fetchGroups = async () => await AdminService.getGroups();

// ── Provider ──────────────────────────────────────────────────────────────────

export const AdminDataProvider = ({ children }) => {
    const overview = useCachedSection(useCallback(fetchOverview, []));
    const students = useCachedSection(useCallback(fetchStudents, []));
    const teachers = useCachedSection(useCallback(fetchTeachers, []));
    const groups = useCachedSection(useCallback(fetchGroups, []));

    return (
        <AdminDataContext.Provider value={{ overview, students, teachers, groups }}>
            {children}
        </AdminDataContext.Provider>
    );
};

export const useAdminData = () => {
    const ctx = useContext(AdminDataContext);
    if (!ctx) throw new Error('useAdminData debe usarse dentro de <AdminDataProvider>');
    return ctx;
};
