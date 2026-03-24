import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ConfigurationGameView from './components/Teacher/ConfigurationGameView';
import MemoriaRapidaGameView from './components/Games/MemoriaRapida/MemoriaRapidaGameView';
import MemoriaRapidaAccessPanel from './components/Games/MemoriaRapida/MemoriaRapidaAccessPanel';
// Quiz imports
import QuizAccessPanel from './components/Games/Quiz/QuizAccessPanel';
import QuizGameView from './components/Games/Quiz/QuizGameView';
// Intruso imports
import IntrusoAccessPanel from './components/Games/Intruso/IntrusoAccessPanel';
import IntrusoGameView from './components/Games/Intruso/IntrusoGameView';
// Rompecabezas imports
import RompecabezasAccessPanel from './components/Games/Rompecabezas/RompecabezasAccessPanel';
import RompecabezasGameView from './components/Games/Rompecabezas/RompecabezasGameView';

// Memorama imports
import MemoramaAccessPanel from './components/Games/Memorama/MemoramaAccessPanel';
import MemoramaGameView from './components/Games/Memorama/MemoramaGameView';
// Lotería imports
import LoteriaAccessPanel from './components/Games/Loteria/LoteriaAccessPanel';
import LoteriaGameView from './components/Games/Loteria/LoteriaGameView';
// Student Dashboard
import StudentDashboard from './pages/student/StudentDashboard';
import StudentActivities from './pages/student/StudentActivities';
import StudentAssignments from './pages/student/StudentAssignments';
import GameMap from './components/Map/GameMap';
// Teacher Dashboard
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherResources from './pages/teacher/TeacherResources';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
// Admin

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherContent from './pages/teacher/TeacherContent';
import DictionaryPage from './pages/common/DictionaryPage';
import apiConfig from './services/apiConfig';

import { useAuth } from './context/AuthContext';
import { StudentsProvider } from './context/StudentsContext';
import { StudentDataProvider } from './context/StudentDataContext';
import { TeacherDataProvider } from './context/TeacherDataContext';
import { AdminDataProvider } from './context/AdminDataContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardSwitcher from './components/Dashboard/DashboardSwitcher';
import Roles from './utils/roles';

function App() {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const handleBeforeUnload = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                fetch(`${apiConfig.baseUrl}/api/user/session/end`, {
                    method: 'PUT',
                    headers: apiConfig.getHeaders(),
                    keepalive: true
                }).catch(console.error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/registro" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/admin" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/dashboard" replace />} />

                    {/* Authenticated Layout */}
                    <Route element={<MainLayout user={user} />}>

                        {/* Dynamic Dashboard */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute isAllowed={isAuthenticated}>
                                    <StudentDataProvider>
                                        <TeacherDataProvider>
                                            <AdminDataProvider>
                                                <DashboardSwitcher role={user?.userType} />
                                            </AdminDataProvider>
                                        </TeacherDataProvider>
                                    </StudentDataProvider>
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route element={<AdminDataProvider><ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.ADMIN} /></AdminDataProvider>}>
                            <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/admin/grupos" element={<AdminDashboard />} />
                            <Route path="/admin/estudiantes" element={<AdminDashboard />} />
                            <Route path="/admin/maestros" element={<AdminDashboard />} />
                            <Route path="/admin/palabras" element={<AdminDashboard />} />
                            <Route path="/admin/actividades" element={<AdminDashboard />} />
                            <Route path="/admin/actividades/crear" element={
                                <ConfigurationGameView redirectPath="/admin/actividades" />
                            } />
                            <Route path="/admin/actividades/editar/:editId" element={
                                <ConfigurationGameView redirectPath="/admin/actividades" />
                            } />
                            <Route path="/admin/contenido" element={<AdminDashboard />} />
                        </Route>

                        {/* Teacher Routes */}
                        <Route element={<TeacherDataProvider><ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.TEACHER} /></TeacherDataProvider>}>
                            <Route element={<StudentsProvider><Outlet /></StudentsProvider>}>
                                <Route path="/maestro/dashboard" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/maestro/estudiantes" element={<TeacherStudents />} />
                                <Route path="/maestro/asignaciones" element={<TeacherAssignments />} />
                                <Route path="/maestro/recursos" element={<TeacherResources />} />
                                <Route path="/maestro/contenido" element={<TeacherContent />} />
                                <Route path="/maestro/diccionario" element={<DictionaryPage />} />

                                <Route path="/maestro/recursos/crear" element={
                                    <ConfigurationGameView redirectPath="/maestro/recursos" />
                                } />
                                <Route path="/maestro/recursos/editar/:editId" element={
                                    <ConfigurationGameView redirectPath="/maestro/recursos" />
                                } />
                            </Route>
                        </Route>

                        {/* Student Routes */}
                        <Route element={<StudentDataProvider><ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.STUDENT} /></StudentDataProvider>}>
                            <Route path="/estudiante/dashboard" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/estudiante/actividades" element={<StudentActivities />} />
                            <Route path="/estudiante/mapa" element={<GameMap />} />
                            <Route path="/estudiante/asignaciones" element={<StudentAssignments />} />
                            <Route path="/estudiante/contenido" element={<StudentActivities />} />
                            <Route path="/estudiante/diccionario" element={<DictionaryPage />} />
                        </Route>

                        {/* Visitor Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.VISITOR} />}>
                            <Route path="/visitante/dashboard" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/visitante/mapa" element={<GameMap />} />
                            <Route path="/visitante/actividades" element={<StudentActivities />} />
                            <Route path="/visitante/contenido" element={<StudentActivities />} />
                            <Route path="/visitante/diccionario" element={<DictionaryPage />} />
                        </Route>

                        {/* Games/Global Authenticated Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
                            {/* Memoria Rápida */}
                            <Route path="/games/memoria_rapida" element={<MemoriaRapidaAccessPanel />} />
                            <Route path="/games/memoria_rapida/crear" element={
                                <ConfigurationGameView redirectPath="/games/memoria_rapida/jugar/{id}" />
                            } />
                            <Route path="/games/memoria_rapida/editar/:editId" element={
                                <ConfigurationGameView redirectPath="/games/memoria_rapida" />
                            } />
                            <Route path="/games/memoria_rapida/jugar/:activityId" element={
                                <MemoriaRapidaGameView studentId={localStorage.getItem('app_user') ? JSON.parse(localStorage.getItem('app_user')).id : 'student_001'} />
                            } />

                            {/* Memorama */}
                            <Route path="/games/memorama" element={<MemoramaAccessPanel />} />
                            <Route path="/games/memorama/crear" element={
                                <ConfigurationGameView redirectPath="/games/memorama/jugar/{id}" />
                            } />
                            <Route path="/games/memorama/editar/:editId" element={
                                <ConfigurationGameView redirectPath="/games/memorama" />
                            } />
                            <Route path="/games/memorama/jugar/:activityId" element={
                                <MemoramaGameView studentId={localStorage.getItem('app_user') ? JSON.parse(localStorage.getItem('app_user')).id : 'student_001'} />
                            } />

                            {/* Quiz */}
                            <Route path="/games/quiz" element={<QuizAccessPanel />} />
                            <Route path="/games/quiz/editar/:editId" element={
                                <ConfigurationGameView redirectPath="/games/quiz" />
                            } />
                            <Route path="/games/quiz/jugar/:activityId" element={<QuizGameView />} />

                            {/* Intruso */}
                            <Route path="/games/intruso" element={<IntrusoAccessPanel />} />
                            <Route path="/games/intruso/jugar/:activityId" element={<IntrusoGameView />} />

                            {/* Rompecabezas */}
                            <Route path="/games/rompecabezas" element={<RompecabezasAccessPanel />} />
                            <Route path="/games/rompecabezas/jugar/:activityId" element={<RompecabezasGameView />} />

                            {/* Lotería */}
                            <Route path="/games/loteria" element={<LoteriaAccessPanel />} />
                            <Route path="/games/loteria/jugar/:activityId" element={<LoteriaGameView />} />
                        </Route>
                    </Route>

                </Routes>
            </div>
        </Router>
    );
}

export default App;