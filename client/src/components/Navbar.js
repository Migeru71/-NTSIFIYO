import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Componente de Navegación Principal.
 * Muestra botones de login/registro si NO hay sesión,
 * o nombre de usuario + cerrar sesión si SÍ hay sesión.
 */
const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Verificar si hay sesión activa al montar y cuando cambie el localStorage
    useEffect(() => {
        checkAuth();

        // Escuchar cambios en localStorage (para cuando se inicie/cierre sesión en otra pestaña)
        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);

        // Escuchar evento custom para login/logout dentro de la misma pestaña
        window.addEventListener('authChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChanged', handleStorageChange);
        };
    }, []);

    const checkAuth = () => {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('authToken');
        if (userData && token) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        window.dispatchEvent(new Event('authChanged'));
        navigate('/');
    };

    // Obtener la inicial del nombre o username
    const getInitial = () => {
        if (!user) return '?';
        const name = user.name || user.username || '';
        return name.charAt(0).toUpperCase();
    };

    // Color del badge según el rol
    const getRoleBadge = () => {
        if (!user) return null;
        const roleMap = {
            'TEACHER': { label: 'Maestro', color: 'bg-green-100 text-green-700' },
            'STUDENT': { label: 'Alumno', color: 'bg-blue-100 text-blue-700' },
            'VISITOR': { label: 'Visitante', color: 'bg-purple-100 text-purple-700' },
            'ADMIN': { label: 'Admin', color: 'bg-red-100 text-red-700' }
        };
        return roleMap[user.role] || { label: user.role, color: 'bg-gray-100 text-gray-700' };
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-surface-dark/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo e Identidad */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-dark dark:text-primary">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">
                        NTS'I FÍYO
                    </h1>
                </Link>

                {/* Menú de Navegación (Escritorio) */}
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-medium text-text-sub-light hover:text-primary dark:text-text-sub-dark transition-colors" href="#nosotros">Nosotros</a>
                    <a className="text-sm font-medium text-text-sub-light hover:text-primary dark:text-text-sub-dark transition-colors" href="#cursos">Cursos</a>
                    <a className="text-sm font-medium text-text-sub-light hover:text-primary dark:text-text-sub-dark transition-colors" href="#recursos">Resources</a>
                    <a className="text-sm font-medium text-text-sub-light hover:text-primary dark:text-text-sub-dark transition-colors" href="#contacto">Contacto</a>
                </nav>

                {/* Acciones de Usuario */}
                <div className="flex items-center gap-3">
                    {user ? (
                        /* ===== USUARIO AUTENTICADO ===== */
                        <>
                            {/* Badge de rol */}
                            {getRoleBadge() && (
                                <span className={`hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleBadge().color}`}>
                                    {getRoleBadge().label}
                                </span>
                            )}

                            {/* Avatar + nombre */}
                            <Link
                                to={user.role === 'TEACHER' ? '/maestro/dashboard' : user.role === 'STUDENT' ? '/estudiante/dashboard' : '/'}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {getInitial()}
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-text-main-light dark:text-text-main-dark max-w-[120px] truncate">
                                    {user.name || user.username || 'Usuario'}
                                </span>
                            </Link>

                            {/* Botón cerrar sesión */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center h-9 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Cerrar sesión"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                                <span className="hidden sm:inline ml-1">Salir</span>
                            </button>
                        </>
                    ) : (
                        /* ===== NO AUTENTICADO ===== */
                        <>
                            <Link
                                to="/auth"
                                state={{ mode: 'login' }}
                                className="hidden sm:flex items-center justify-center h-9 px-4 text-sm font-medium text-text-main-light dark:text-text-main-dark hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Iniciar Sesión
                            </Link>

                            <Link
                                to="/auth"
                                state={{ mode: 'register' }}
                                className="flex items-center justify-center h-9 px-4 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}

                    {/* Menú Móvil */}
                    <button className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 text-text-main-light dark:text-text-main-dark">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;