import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../Dashboard/SideBar';

/**
 * Layout principal de la aplicación autenticada.
 * Incluye la configuración global del SideBar y el contenedor del contenido principal.
 * @param {Object} user - Objeto de usuario actual.
 */
const MainLayout = ({ user }) => {
    if (!user) return <Outlet />; // Fallback si no hay usuario

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background-start to-background-end flex">
            {/* Sidebar global de la aplicación */}
            <SideBar
                role={user.userType}
                userName={user.firstname || 'Usuario'}
            />

            {/* Contenedor principal de vistas (Outlet) */}
            <main className="flex-1 lg:pl-64">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
