import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar de navegación para el dashboard del administrador
 */
const AdminSidebar = () => {
    const location = useLocation();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
        { id: 'groups', label: 'Grupos', icon: 'groups', path: '/admin/grupos' },
        { id: 'students', label: 'Estudiantes', icon: 'school', path: '/admin/estudiantes' },
        { id: 'teachers', label: 'Maestros', icon: 'person', path: '/admin/maestros' },
        { id: 'words', label: 'Palabras', icon: 'library_books', path: '/admin/palabras' },
        { id: 'activities', label: 'Actividades', icon: 'extension', path: '/admin/actividades' },
    ];

    // Some simple logic to figure out if active based on path
    const isActive = (path) => location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin');

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 flex flex-col z-30">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link to="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">admin_panel_settings</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-800">NTS'I FÍYO</span>
                        <span className="text-xs text-secondary font-medium">Panel Admin</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${isActive(item.path) ? 'text-primary' : 'text-gray-400'
                                    }`}>
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
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                            Administrador
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                            admin@system
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
