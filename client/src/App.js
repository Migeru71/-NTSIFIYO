import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ConfigurationGameView from './components/Teacher/ConfigurationGameView';
import MemoramaGameView from './components/Games/Memorama/MemoramaGameView';
import MemoramaAccessPanel from './components/Games/Memorama/MemoramaAccessPanel';
// Quiz imports
import QuizAccessPanel from './components/Games/Quiz/QuizAccessPanel';
import QuizGameView from './components/Games/Quiz/QuizGameView';
// Intruso imports
import IntrusoAccessPanel from './components/Games/Intruso/IntrusoAccessPanel';
import IntrusoGameView from './components/Games/Intruso/IntrusoGameView';
// Rompecabezas imports
import RompecabezasAccessPanel from './components/Games/Rompecabezas/RompecabezasAccessPanel';
import RompecabezasGameView from './components/Games/Rompecabezas/RompecabezasGameView';
// Student Dashboard
import StudentDashboard from './pages/StudentDashboard';
import StudentActivities from './pages/StudentActivities';
// Teacher Dashboard
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherResources from './pages/TeacherResources';
import TeacherStudents from './pages/TeacherStudents';
// Admin
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import apiConfig from './services/apiConfig';

function App() {
    useEffect(() => {
        const handleBeforeUnload = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                // Use fetch with keepalive to ensure it fires when the tab/window is closed
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

    // Datos simulados (Mock) actualizados para coincidir con la estructura del Hero
    const mockStats = {
        hero: {
            badge: "Nuevo Curso Interactivo Disponible",
            student_count: "500+"
        },
        daily_phrase: {
            phrase: "Ki jñaa kjo",
            translation: "Habla bien / Saludo",
            context: "Frase de cortesía tradicional."
        }
    };

    return (
        <Router>
            <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
                <Navbar />
                <Routes>
                    {/* Ruta Raíz: Página de inicio */}
                    <Route path="/" element={<Home stats={mockStats} />} />

                    {/* Ruta de autenticación */}
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Ruta alternativa de registro */}
                    <Route path="/registro" element={<AuthPage />} />

                    {/* ==========================================
                        RUTAS DE ADMINISTRADOR
                        ========================================== */}

                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/grupos" element={<AdminDashboard />} />
                    <Route path="/admin/estudiantes" element={<AdminDashboard />} />
                    <Route path="/admin/maestros" element={<AdminDashboard />} />
                    <Route path="/admin/palabras" element={<AdminDashboard />} />
                    <Route path="/admin/actividades" element={<AdminDashboard />} />

                    {/* ==========================================
                        RUTAS DEL ESTUDIANTE
                        ========================================== */}

                    <Route path="/estudiante/dashboard" element={<StudentDashboard />} />
                    <Route path="/estudiante/actividades" element={<StudentActivities />} />

                    {/* ==========================================
                        RUTAS DEL MAESTRO
                        ========================================== */}

                    <Route path="/maestro/dashboard" element={<TeacherDashboard />} />
                    <Route path="/maestro/estudiantes" element={<TeacherStudents />} />
                    <Route path="/maestro/recursos" element={<TeacherResources />} />

                    <Route
                        path="/maestro/recursos/crear"
                        element={
                            <ConfigurationGameView
                                onActivityCreated={(activity) => {
                                    console.log('✅ Actividad creada desde Recursos:', activity);
                                    window.location.href = '/maestro/recursos';
                                }}
                            />
                        }
                    />

                    <Route
                        path="/maestro/recursos/editar/:editId"
                        element={
                            <ConfigurationGameView
                                onActivityCreated={(activity) => {
                                    console.log('✅ Actividad actualizada:', activity);
                                    window.location.href = '/maestro/recursos';
                                }}
                            />
                        }
                    />

                    {/* ==========================================
                        RUTAS DEL MEMORAMA
                        ========================================== */}

                    <Route path="/games/memorama" element={<MemoramaAccessPanel />} />

                    <Route
                        path="/games/memorama/crear"
                        element={
                            <ConfigurationGameView
                                onActivityCreated={(activity) => {
                                    console.log('✅ Actividad creada:', activity);
                                    window.location.href = `/games/memorama/jugar/${activity.id}`;
                                }}
                            />
                        }
                    />

                    <Route
                        path="/games/memorama/editar/:editId"
                        element={
                            <ConfigurationGameView
                                onActivityCreated={(activity) => {
                                    console.log('✅ Actividad actualizada:', activity);
                                    window.location.href = `/games/memorama`;
                                }}
                            />
                        }
                    />

                    <Route
                        path="/games/memorama/jugar/:activityId"
                        element={
                            <MemoramaGameView
                                studentId={localStorage.getItem('currentStudentId') || 'student_001'}
                            />
                        }
                    />

                    {/* ==========================================
                        RUTAS DEL QUIZ
                        ========================================== */}

                    <Route path="/games/quiz" element={<QuizAccessPanel />} />

                    <Route
                        path="/games/quiz/editar/:editId"
                        element={
                            <ConfigurationGameView
                                onActivityCreated={(activity) => {
                                    console.log('✅ Quiz actualizado:', activity);
                                    window.location.href = `/games/quiz`;
                                }}
                            />
                        }
                    />

                    <Route
                        path="/games/quiz/jugar/:activityId"
                        element={<QuizGameView />}
                    />

                    {/* ==========================================
                        RUTAS DEL INTRUSO
                        ========================================== */}

                    <Route path="/games/intruso" element={<IntrusoAccessPanel />} />
                    <Route path="/games/intruso/jugar/:activityId" element={<IntrusoGameView />} />

                    {/* ==========================================
                        RUTAS DEL ROMPECABEZAS
                        ========================================== */}

                    <Route path="/games/rompecabezas" element={<RompecabezasAccessPanel />} />
                    <Route path="/games/rompecabezas/jugar/:activityId" element={<RompecabezasGameView />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;