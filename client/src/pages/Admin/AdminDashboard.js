import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import SideBar from '../../components/Dashboard/SideBar';
import Roles from '../../utils/roles';
import TeachersSection from './sections/TeachersSection';
import StudentsSection from './sections/StudentsSection';
import GroupsSection from './sections/GroupsSection';
import WordsSection from './sections/WordsSection';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { user, logout } = useAuth();

    const renderSection = () => {
        switch (currentPath) {
            case '/admin/maestros':
                return <TeachersSection />;
            case '/admin/estudiantes':
                return <StudentsSection />;
            case '/admin/grupos':
                return <GroupsSection />;
            case '/admin/palabras':
                return <WordsSection />;
            default:
                return (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-7xl text-gray-300 mb-4 block">construction</span>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sección en Construcción</h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Actualmente este panel se encuentra en construcción.
                            Pronto se añadirán herramientas para gestionar {currentPath.split('/').pop()}.
                        </p>
                    </div>
                );
        }
    };

    const sectionName = currentPath.split('/').filter(Boolean).pop() || 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SideBar role={Roles.ADMIN} userName={user.firstname} />
            <main className="flex-1 ml-4 p-8 min-h-screen">
                <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                    <Link to="/admin/dashboard" className="hover:text-primary transition-colors font-medium">Admin Panel</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-gray-800 font-bold capitalize">{sectionName}</span>
                    <div className="ml-auto">
                        <Link to="/" className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Cerrar Sesión / Salir
                        </Link>
                    </div>
                </nav>

                {renderSection()}
            </main>
        </div>
    );
};

export default AdminDashboard;

