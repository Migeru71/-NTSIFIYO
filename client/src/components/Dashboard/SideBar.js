import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useNavigation from '../../hooks/useNavigation';

/**
 * Sidebar de navegación reutilizable para todos los roles.
 *
 * Props:
 * - role: string       — El rol del usuario desde el enum Roles (ej. Roles.STUDENT)
 * - userName: string   — nombre del usuario
 */
const SideBar = ({ role, userName = '' }) => {
    const { authorizedSidebarRoutes: menuItems, roleLabel, accentColor, homePath } = useNavigation(role);
    const location = useLocation();

    // Determinar si un item está activo
    const isActive = (path) => location.pathname === path;

    // Mapas de colores para variantes dinámicas
    const colorMap = {
        primary: {
            gradient: 'from-primary to-primary-dark',
            activeBg: 'bg-primary/10',
            activeText: 'text-primary',
            activeIcon: 'text-primary',
            roleText: 'text-secondary',
            avatarBg: 'bg-primary',
        },
        green: {
            gradient: 'from-green-500 to-green-600',
            activeBg: 'bg-green-50',
            activeText: 'text-green-600',
            activeIcon: 'text-green-600',
            roleText: 'text-gray-500',
            avatarBg: 'bg-green-500',
        },
        amber: {
            gradient: 'from-amber-400 to-orange-500',
            activeBg: 'bg-amber-50',
            activeText: 'text-primary',
            activeIcon: 'text-primary',
            roleText: 'text-primary',
            avatarBg: 'bg-amber-500',
        },
    };

    const colors = colorMap[accentColor] || colorMap.primary;

    // Icono del logo según rol
    const roleIconMap = {
        Administrador: 'admin_panel_settings',
        Maestro: 'school',
        Estudiante: 'person',
        Visitante: 'visibility',
    };
    const roleIcon = roleIconMap[roleLabel] || 'dashboard';

    // Inicial para avatar
    const initial = userName ? userName.charAt(0).toUpperCase() : roleLabel.charAt(0).toUpperCase();

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 flex flex-col z-30">
            {/* Logo / Branding */}
            <div className="p-6 border-b border-gray-100">
                <Link to={homePath} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-white">{roleIcon}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-800">NTS'I FÍYO</span>
                        <span className={`text-xs font-medium ${colors.roleText}`}>Panel {roleLabel}</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? `${colors.activeBg} ${colors.activeText} font-semibold`
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined text-xl ${isActive(item.path) ? colors.activeIcon : 'text-gray-400'
                                        }`}
                                >
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Card at Bottom */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${colors.avatarBg} text-white font-bold`}>
                        {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                            {userName || roleLabel}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                            {roleLabel}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
