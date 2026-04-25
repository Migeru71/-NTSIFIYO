import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import SideBar from '../../components/Dashboard/SideBar';
import Roles from '../../utils/roles';
import TeachersSection from './TeachersSection';
import StudentsSection from './StudentsSection';
import GroupsSection from './GroupsSection';
import WordsSection from './WordsSection';
import AdminOverviewSection from './AdminOverviewSection';
import AdminActivitiesSection from './AdminActivitiesSection';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/common/Breadcrumb';

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
            case '/admin/actividades':
                return <AdminActivitiesSection />;
            default:
                return <AdminOverviewSection />;
        }
    };

    const sectionName = currentPath.split('/').filter(Boolean).pop() || 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SideBar role={Roles.ADMIN} userName={user.firstname} />
            <main className="flex-1 ml-4 p-8 min-h-screen">
                <div className="flex items-center justify-between mb-6">
                    <Breadcrumb />
                    <div className="ml-auto">
                        <Link to="/" className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Cerrar Sesión / Salir
                        </Link>
                    </div>
                </div>

                {renderSection()}
            </main>
        </div>
    );
};

export default AdminDashboard;

