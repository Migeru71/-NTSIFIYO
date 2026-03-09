import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from '../Dashboard/SideBar';

/**
 * Layout principal de la aplicación autenticada.
 * Incluye la configuración global del SideBar y el contenedor del contenido principal.
 * @param {Object} user - Objeto de usuario actual.
 */
const MainLayout = ({ user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Check if the current route is a game route where we want a full-screen experience
    const isGameRoute = location.pathname.includes('/games/') ||
        location.pathname.includes('/recursos/crear') ||
        location.pathname.includes('/recursos/editar');

    useEffect(() => {
        const handleToggle = () => setIsSidebarOpen(prev => !prev);
        window.addEventListener('toggle-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-sidebar', handleToggle);
    }, []);

    if (!user) return <Outlet />; // Fallback si no hay usuario

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background-start to-background-end flex relative w-full overflow-x-hidden">
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
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
