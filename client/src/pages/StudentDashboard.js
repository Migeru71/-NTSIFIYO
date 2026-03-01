import React from 'react';
import SideBar from '../components/Dashboard/SideBar';
import StatsCards from '../components/Dashboard/StatsCards';
import NextLessonCard from '../components/Dashboard/NextLessonCard';
import CurrentProgress from '../components/Dashboard/CurrentProgress';
import LearningActivities from '../components/Dashboard/LearningActivities';
import DailyWisdom from '../components/Dashboard/DailyWisdom';
import TopLearners from '../components/Dashboard/TopLearners';

/**
 * Dashboard principal del estudiante
 * Esta página se muestra después de que un estudiante inicia sesión
 */
const StudentDashboard = () => {
    // Mock user data - en producción vendría del contexto de autenticación
    const user = {
        id: 'student_001',
        name: 'Maria Gonzalez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        level: 'A1',
        xp: 1450
    };

    // Saludo en mazahua
    const mazahuaGreeting = 'Jñatjo';

    return (
        <div className="min-h-screen bg-gradient-to-b from-background-start to-background-end">
            {/* Sidebar */}
            <SideBar
                menuItems={[
                    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/estudiante/dashboard' },
                    { id: 'assignments', label: 'Asignaciones', icon: 'assignment', path: '/estudiante/asignaciones' },
                    { id: 'activities', label: 'Actividades', icon: 'sports_esports', path: '/estudiante/actividades' },
                    { id: 'content', label: 'Contenido', icon: 'article', path: '/estudiante/contenido' },
                    { id: 'dictionary', label: 'Diccionario', icon: 'translate', path: '/estudiante/diccionario' },
                ]}
                roleLabel="Estudiante"
                userName={user?.name || 'Estudiante'}
                accentColor="amber"
                homePath="/estudiante/dashboard"
            />

            {/* Main Content */}
            <main className="pl-64 min-h-screen">
                <div className="max-w-6xl mx-auto p-8">
                    {/* Welcome Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">
                            ¡Bienvenido de nuevo, {user.name.split(' ')[0]}!
                            <span className="text-primary ml-3 text-2xl">- {mazahuaGreeting}</span>
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Continuemos tu camino para dominar el idioma Mazahua. ¡Lo estás haciendo muy bien!
                        </p>
                    </header>

                    {/* Stats Cards */}
                    <section className="mb-8">
                        <StatsCards />
                    </section>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - 2/3 width */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Next Lesson */}
                            <NextLessonCard />

                            {/* Learning Activities */}
                            <LearningActivities />
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="space-y-6">
                            {/* Current Progress */}
                            <CurrentProgress />

                            {/* Daily Wisdom */}
                            <DailyWisdom />

                            {/* Top Learners */}
                            <TopLearners />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
