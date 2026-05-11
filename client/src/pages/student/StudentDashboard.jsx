import React from 'react';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import PageShell from '../../components/common/PageShell';
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
        <PageShell>
            <SectionHeader
                title={`¡Bienvenido de nuevo, ${user?.firstname || user?.username}!`}
                subtitle="Continuemos tu camino para dominar el idioma Mazahua. ¡Lo estás haciendo muy bien!"
                onReload={reloadDashboard}
            />

            {isLoading && <LoadingState message="Cargando tu progreso..." />}

            {error && !isLoading && (
                <ErrorState
                    message={error.message}
                    onRetry={reloadDashboard}
                    dashboardPath={null}
                />
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
        </PageShell>
    );
};

export default StudentDashboard;
