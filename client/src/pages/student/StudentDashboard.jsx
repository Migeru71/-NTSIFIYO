import React from 'react';
import StatsCards from '../../components/Dashboard/StatsCards';
import NextLessonCard from '../../components/Dashboard/NextLessonCard';
import CurrentProgress from '../../components/Dashboard/CurrentProgress';
import LearningActivities from '../../components/Dashboard/LearningActivities';
import DailyWisdom from '../../components/Dashboard/DailyWisdom';
import TopLearners from '../../components/Dashboard/TopLearners';
import SectionHeader from '../../components/common/SectionHeader';
import { useAuth } from '../../context/AuthContext';
import { useStudentDashboardQuery, useStudentInvalidate } from '../../hooks/useStudentQueries';

/**
 * Dashboard principal del estudiante.
 * Usa TanStack Query: los datos se cargan una sola vez y se mantienen
 * en caché (staleTime: Infinity). El botón "Actualizar" llama a invalidateQueries.
 */
const StudentDashboard = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useStudentDashboardQuery();
    const { reloadDashboard } = useStudentInvalidate();

    const {
        level = 1,
        experience = 0,
        inrow = 0,
        finished = 0,
        pending = [],
        classmates = []
    } = data || {};

    return (
        <div className="w-full flex-1 relative">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    <SectionHeader
                        title={`¡Bienvenido de nuevo, ${user?.firstname || user?.username}!`}
                        subtitle="Continuemos tu camino para dominar el idioma Mazahua. ¡Lo estás haciendo muy bien!"
                        onReload={reloadDashboard}
                    />

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium tracking-wide">Cargando tu progreso...</p>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center max-w-sm mx-auto">
                            <span className="material-symbols-outlined text-4xl mb-2 block">error</span>
                            <h3 className="text-lg font-bold">¡Uy! Algo salió mal</h3>
                            <p className="text-sm mt-1">{error.message}</p>
                        </div>
                    )}

                    {!isLoading && !error && data && (
                        <>
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
                                    <NextLessonCard pendingActivities={pending} />
                                    <LearningActivities />
                                </div>

                                {/* Right Column - 1/3 width */}
                                <div className="space-y-6">
                                    <CurrentProgress experience={experience} level={level} />
                                    <DailyWisdom />
                                    <TopLearners learners={classmates} currentUserName={user?.username} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
