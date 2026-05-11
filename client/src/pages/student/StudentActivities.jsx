import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import PageShell from '../../components/common/PageShell';
import { getActivitiesList } from '../../config/activityConfig';

/**
 * Página de actividades de aprendizaje
 * Muestra una tarjeta por cada tipo de juego: Memorama y Quiz
 */
const StudentActivities = () => {
    // Datos del usuario desde localStorage
    const userData = (() => {
        try {
            return JSON.parse(localStorage.getItem('appUser')) || {};
        } catch { return {}; }
    })();

    // Actividades generales (obtenidas desde la configuración centralizada)
    const games = getActivitiesList();

    return (
        <PageShell>
            <SectionHeader
                        title="Actividades de Aprendizaje"
                        subtitle="Selecciona una actividad para practicar y ganar XP."
                    />

                    {/* Game Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map((game) => (
                            <Link
                                key={game.id}
                                to={game.basePath}
                                className="group bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                                style={{ borderColor: game.color + '40' }}
                            >
                                {/* Icon Header */}
                                <div className="p-8 flex flex-col items-center justify-center shrink-0" style={{ backgroundColor: game.color + '15' }}>
                                    <span className="text-7xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {game.icon}
                                    </span>
                                    <h2 className="text-2xl font-bold" style={{ color: game.color }}>{game.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{game.subtitle}</p>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-sm text-gray-600 mb-5 leading-relaxed grow">
                                        {game.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-around mb-5 py-3 bg-gray-50 rounded-xl shrink-0">
                                        {game.stats.map((stat, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-1">
                                                <span className="material-symbols-outlined text-lg" style={{ color: game.color }}>
                                                    {stat.icon}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium min-w-[60px] text-center">{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="w-full py-3 text-center text-white font-semibold rounded-xl transition-colors shrink-0" style={{ backgroundColor: game.color }}>
                                        ▶️ Entrar
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Challenge Banner */}
                    <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">¿Listo para un desafío?</h3>
                                <p className="text-sm text-gray-500">¡Completa actividades para mantener tu racha y ganar XP!</p>
                            </div>
                        </div>
                        <Link
                            to="/estudiante/leaderboard"
                            className="px-6 py-3 bg-amber-400 text-white font-semibold rounded-xl hover:bg-amber-500 transition-colors whitespace-nowrap"
                        >
                            Ver Tabla de Líderes
                        </Link>
                    </div>
        </PageShell>
    );
};

export default StudentActivities;
