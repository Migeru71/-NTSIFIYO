import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ConfiguracionActividadView from './components/Games/Memorama/ConfiguracionActividadView';
import MemoramaGameView from './components/Games/Memorama/MemoramaGameView';
import MemoramaAccessPanel from './components/Games/Memorama/MemoramaAccessPanel';
// Quiz imports
import QuizAccessPanel from './components/Games/Quiz/QuizAccessPanel';
import QuizConfigView from './components/Games/Quiz/QuizConfigView';
import QuizGameView from './components/Games/Quiz/QuizGameView';
// Student Dashboard
import StudentDashboard from './pages/StudentDashboard';
import StudentActivities from './pages/StudentActivities';
// Teacher Dashboard
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
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
                        RUTAS DEL ESTUDIANTE
                        ========================================== */}

                    <Route path="/estudiante/dashboard" element={<StudentDashboard />} />
                    <Route path="/estudiante/actividades" element={<StudentActivities />} />

                    {/* ==========================================
                        RUTAS DEL MAESTRO
                        ========================================== */}

                    <Route path="/maestro/dashboard" element={<TeacherDashboard />} />

                    {/* ==========================================
                        RUTAS DEL MEMORAMA
                        ========================================== */}

                    <Route path="/games/memorama" element={<MemoramaAccessPanel />} />

                    <Route
                        path="/games/memorama/crear"
                        element={
                            <ConfiguracionActividadView
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
                            <ConfiguracionActividadView
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
                        path="/games/quiz/crear"
                        element={
                            <QuizConfigView
                                onActivityCreated={(activity) => {
                                    console.log('✅ Quiz creado:', activity);
                                }}
                            />
                        }
                    />

                    <Route
                        path="/games/quiz/editar/:editId"
                        element={
                            <ConfiguracionActividadView
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;