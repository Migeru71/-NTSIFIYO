import { createContext, useState, useCallback, useContext } from 'react';
import apiConfig from '../services/apiConfig';

const StudentsContext = createContext();

/**
 * Provider que cachea la lista de estudiantes del grupo asignado al maestro.
 * - fetchStudents()   → carga estudiantes SOLO si no están cacheados.
 * - refreshStudents() → fuerza un re-fetch al backend.
 */
export const StudentsProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    const doFetch = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/groups/students`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener los estudiantes del grupo.');
            }
            const data = await response.json();
            setStudents(data.students || []);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError(err.message || 'Error de conexión al cargar los estudiantes.');
        } finally {
            setIsLoading(false);
            setLoaded(true);
        }
    }, []);

    /** Carga estudiantes solo si no se han cargado todavía. */
    const fetchStudents = useCallback(async () => {
        if (loaded) return;
        await doFetch();
    }, [loaded, doFetch]);

    /** Fuerza re-fetch al backend (botón "Actualizar"). */
    const refreshStudents = useCallback(async () => {
        await doFetch();
    }, [doFetch]);

    return (
        <StudentsContext.Provider value={{ students, isLoading, error, fetchStudents, refreshStudents }}>
            {children}
        </StudentsContext.Provider>
    );
};

/** Hook para consumir el contexto de estudiantes. */
export const useStudents = () => {
    const ctx = useContext(StudentsContext);
    if (!ctx) {
        throw new Error('useStudents debe usarse dentro de un <StudentsProvider>');
    }
    return ctx;
};
