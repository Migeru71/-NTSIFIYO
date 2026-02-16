import React from 'react';
import { Link } from 'react-router-dom'; // IMPORTACIÓN CRÍTICA

/**
 * Componente de Navegación Principal.
 * Maneja la identidad visual y los accesos rápidos de la plataforma.
 */
const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-surface-dark/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo e Identidad - Enlace al Home */}
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

                {/* Acciones de Usuario con Lógica de Redirección */}
                <div className="flex items-center gap-3">
                    {/* Link para Iniciar Sesión (Modo Login) */}
                    <Link
                        to="/auth"
                        state={{ mode: 'login' }}
                        className="hidden sm:flex items-center justify-center h-9 px-4 text-sm font-medium text-text-main-light dark:text-text-main-dark hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Iniciar Sesión
                    </Link>

                    {/* Link para Registrarse (Modo Registro) */}
                    <Link
                        to="/auth"
                        state={{ mode: 'register' }}
                        className="flex items-center justify-center h-9 px-4 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
                    >
                        Registrarse
                    </Link>



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