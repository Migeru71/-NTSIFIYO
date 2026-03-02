import React from 'react';
import Roles from '../../utils/roles';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import TeacherDashboard from '../../pages/TeacherDashboard';
import StudentDashboard from '../../pages/StudentDashboard';

/**
 * Componente que renderiza dinámicamente el dashboard correspondiente según el rol.
 * @param {string} role - El rol del usuario actual.
 */
const DashboardSwitcher = ({ role }) => {
    switch (role) {
        case Roles.ADMIN:
            return <AdminDashboard />;
        case Roles.TEACHER:
            return <TeacherDashboard />;
        case Roles.STUDENT:
        case Roles.VISITOR:
        default:
            return <StudentDashboard />;
    }
};

export default DashboardSwitcher;
