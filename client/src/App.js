import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import AdminLogin from './pages/AdminLogin';
import apiConfig from './services/apiConfig';

import { useAuth } from './context/AuthContext';

import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardSwitcher from './components/Dashboard/DashboardSwitcher';
import Roles from './utils/roles';

// Lazy-loaded components (loaded on demand)
const ConfigurationGameView = lazy(() => import('./components/Teacher/ConfigurationGameView'));
const MemoriaRapidaGameView = lazy(() => import('./components/Games/MemoriaRapida/MemoriaRapidaGameView'));
const MemoriaRapidaAccessPanel = lazy(() => import('./components/Games/MemoriaRapida/MemoriaRapidaAccessPanel'));
const QuizAccessPanel = lazy(() => import('./components/Games/Quiz/QuizAccessPanel'));
const QuizGameView = lazy(() => import('./components/Games/Quiz/QuizGameView'));
const IntrusoAccessPanel = lazy(() => import('./components/Games/Intruso/IntrusoAccessPanel'));
const IntrusoGameView = lazy(() => import('./components/Games/Intruso/IntrusoGameView'));
const RompecabezasAccessPanel = lazy(() => import('./components/Games/Rompecabezas/RompecabezasAccessPanel'));
const RompecabezasGameView = lazy(() => import('./components/Games/Rompecabezas/RompecabezasGameView'));
const ParesAccessPanel = lazy(() => import('./components/Games/Pares/ParesAccessPanel'));
const ParesGameView = lazy(() => import('./components/Games/Pares/ParesGameView'));
const MemoramaAccessPanel = lazy(() => import('./components/Games/Memorama/MemoramaAccessPanel'));
const MemoramaGameView = lazy(() => import('./components/Games/Memorama/MemoramaGameView'));
const LoteriaAccessPanel = lazy(() => import('./components/Games/Loteria/LoteriaAccessPanel'));
const LoteriaGameView = lazy(() => import('./components/Games/Loteria/LoteriaGameView'));
const LaberintoGameView = lazy(() => import('./components/Games/Laberinto/LaberintoGameView'));
const LaberintoAccessPanel = lazy(() => import('./components/Games/Laberinto/LaberintoAccessPanel'));
const ContentSection = lazy(() => import('./pages/common/ContentSection'));
const NosotrosPage = lazy(() => import('./pages/NosotrosPage'));
const MediaPlayerView = lazy(() => import('./components/common/MediaPlayerView'));
const StudentActivities = lazy(() => import('./pages/student/StudentActivities'));
const StudentAssignments = lazy(() => import('./pages/student/StudentAssignments'));
const GameMap = lazy(() => import('./components/Map/GameMap'));
const TeacherResources = lazy(() => import('./pages/teacher/TeacherResources'));
const TeacherStudents = lazy(() => import('./pages/teacher/TeacherStudents'));
const TeacherAssignments = lazy(() => import('./pages/teacher/TeacherAssignments'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const TeacherContent = lazy(() => import('./pages/teacher/TeacherContent'));
const DictionaryPage = lazy(() => import('./pages/common/DictionaryPage'));

/**
 * Wrapper that adds top-padding equal to the fixed navbar height (64px = h-16)
 * on every page EXCEPT the home page, where the hero is intentionally fullscreen.
 */
// Loading fallback for lazy-loaded components
function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    );
}

function PageContent({ children }) {
    const location = useLocation();
    const isHome = location.pathname === '/';
    return (
        <div className={isHome ? '' : 'pt-16'}>
            <Suspense fallback={<LoadingFallback />}>
                {children}
            </Suspense>
        </div>
    );
}

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
                <PageContent>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/nosotros" element={<NosotrosPage />} />
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
                                    <DashboardSwitcher role={user?.userType} />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.ADMIN} />}>
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
                            <Route path="/admin/contenido" element={<ContentSection />} />
                        </Route>

                        {/* Teacher Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.TEACHER} />}>
                                <Route path="/maestro/dashboard" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/maestro/estudiantes" element={<TeacherStudents />} />
                                <Route path="/maestro/asignaciones" element={<TeacherAssignments />} />
                                <Route path="/maestro/recursos" element={<TeacherResources />} />
                                <Route path="/maestro/contenido" element={<ContentSection />} />
                                <Route path="/maestro/diccionario" element={<DictionaryPage />} />

                                <Route path="/maestro/recursos/crear" element={
                                    <ConfigurationGameView redirectPath="/maestro/recursos" />
                                } />
                                <Route path="/maestro/recursos/editar/:editId" element={
                                    <ConfigurationGameView redirectPath="/maestro/recursos" />
                                } />
                        </Route>

                        {/* Student Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.STUDENT} />}>
                            <Route path="/estudiante/dashboard" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/estudiante/actividades" element={<StudentActivities />} />
                            <Route path="/estudiante/mapa" element={<GameMap />} />
                            <Route path="/estudiante/asignaciones" element={<StudentAssignments />} />
                            <Route path="/estudiante/contenido" element={<ContentSection />} />
                            <Route path="/estudiante/diccionario" element={<DictionaryPage />} />
                        </Route>

                        {/* Visitor Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated && user?.userType === Roles.VISITOR} />}>
                            <Route path="/visitante/dashboard" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/visitante/mapa" element={<GameMap />} />
                            <Route path="/visitante/actividades" element={<StudentActivities />} />
                            <Route path="/visitante/contenido" element={<ContentSection />} />
                            <Route path="/visitante/diccionario" element={<DictionaryPage />} />
                        </Route>

                        {/* Games/Global Authenticated Routes */}
                        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
                            {/* MediaPlayer */}
                            <Route path="/reproductor/:id" element={<MediaPlayerView />} />

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

                            {/* Pares */}
                            <Route path="/games/pares" element={<ParesAccessPanel />} />
                            <Route path="/games/pares/crear" element={
                                <ConfigurationGameView redirectPath="/games/pares/jugar/{id}" />
                            } />
                            <Route path="/games/pares/editar/:editId" element={
                                <ConfigurationGameView redirectPath="/games/pares" />
                            } />
                            <Route path="/games/pares/jugar/:activityId" element={<ParesGameView />} />

                            {/* Lotería */}
                            <Route path="/games/loteria" element={<LoteriaAccessPanel />} />
                            <Route path="/games/loteria/jugar/:activityId" element={<LoteriaGameView />} />

                            {/* Laberinto */}
                            <Route path="/games/laberinto" element={<LaberintoAccessPanel />} />
                            <Route path="/games/laberinto/jugar/:activityId" element={<LaberintoGameView />} />
                        </Route>
                    </Route>

                </Routes>
                </PageContent>
            </div>
        </Router>
    );
}

export default App;