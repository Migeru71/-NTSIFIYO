import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import NextLessonCard from '../components/Dashboard/NextLessonCard';
import CurrentProgress from '../components/Dashboard/CurrentProgress';
import LearningActivities from '../components/Dashboard/LearningActivities';
import DailyWisdom from '../components/Dashboard/DailyWisdom';
import TopLearners from '../components/Dashboard/TopLearners';
import Roles from '../utils/roles';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import ActivityApiService from '../services/ActivityApiService';

/**
 * Dashboard principal del estudiante
 * Esta página se muestra después de que un estudiante inicia sesión
 */
const StudentDashboard = () => {
    // Mock user data - en producción vendría del contexto de autenticación
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                setLoading(true);
                const result = await ActivityApiService.getStudentDashboard();
                if (result.success) {
                    setDashboardData(result.data);
                } else {
                    setError('Hubo un problema al cargar el dashboard.');
                }
            } catch (err) {
                setError('Error en la conexión.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardInfo();
    }, []);

    const mazahuaGreeting = 'Jñatjo';

    if (loading) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide">Cargando tu progreso...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex-1 flex items-center justify-center py-20">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center max-w-sm">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <h3 className="text-lg font-bold">¡Uy! Algo salió mal</h3>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    const {
        level = 1,
        experience = 0,
        inrow = 0,
        finished = 0,
        pending = [],
        classmates = []
    } = dashboardData || {};

    return (
        <div className="w-full flex-1 relative">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    <Breadcrumb />
                    {/* Welcome Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">
                            ¡Bienvenido de nuevo, {user?.firstname || user?.username}!
                            <span className="text-primary ml-3 text-2xl">- {mazahuaGreeting}</span>
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Continuemos tu camino para dominar el idioma Mazahua. ¡Lo estás haciendo muy bien!
                        </p>
                    </header>

                    {/* Stats Cards */}
                    <section className="mb-8">
                        <StatsCards
                            level={level}
                            experience={experience}
                            inrow={inrow}
                            finished={finished}
                        />
                    </section>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - 2/3 width */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Next Lesson */}
                            <NextLessonCard pendingActivities={pending} />

                            {/* Learning Activities */}
                            <LearningActivities />
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="space-y-6">
                            {/* Current Progress */}
                            <CurrentProgress experience={experience} level={level} />

                            {/* Daily Wisdom */}
                            <DailyWisdom />

                            {/* Top Learners */}
                            <TopLearners learners={classmates} currentUserName={user?.username} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
