import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from '../Dashboard/SideBar';
import { BreadcrumbProvider } from '../../context/BreadcrumbContext';
import Roles from '../../utils/roles';

/**
 * Layout principal de la aplicación autenticada.
 * Incluye la configuración global del SideBar y el contenedor del contenido principal.
 * @param {Object} user - Objeto de usuario actual.
 */
const MainLayout = ({ user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Check if the current route is a game route where we want a full-screen experience
    const isGameRoute = (location.pathname.includes('/games/') && location.pathname.includes('/jugar/')) ||
        location.pathname.includes('/recursos/crear') ||
        location.pathname.includes('/recursos/editar');

    useEffect(() => {
        const handleToggle = () => setIsSidebarOpen(prev => !prev);
        window.addEventListener('toggle-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-sidebar', handleToggle);
    }, []);

    if (!user) return <Outlet />; // Fallback si no hay usuario

    const isAdminOrTeacher = user.userType === Roles.ADMIN || user.userType === Roles.TEACHER;
    const bgClass = !isGameRoute && isAdminOrTeacher
        ? 'bg-gray-50'
        : 'bg-gradient-to-b from-background-start to-background-end';

    return (
        <BreadcrumbProvider>
            <div className={`min-h-[calc(100vh-4rem)] ${bgClass} flex relative w-full overflow-x-hidden`}>
                {/* Sidebar global de la aplicación, hidden on game routes */}
                {!isGameRoute && (
                    <SideBar
                        role={user.userType}
                        userName={user.firstname || 'Usuario'}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Overlay para móviles */}
                {!isGameRoute && isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Contenedor principal de vistas (Outlet) */}
                <main className={`flex-1 min-w-0 ${!isGameRoute ? 'lg:pl-64' : ''}`}>
                    <Suspense fallback={
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        </div>
                    }>
                        <div key={location.pathname}>
                            <Outlet />
                        </div>
                    </Suspense>
                </main>
            </div>
        </BreadcrumbProvider>
    );
};

export default MainLayout;
