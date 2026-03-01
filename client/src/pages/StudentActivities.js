import React from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';

/**
 * Página de actividades de aprendizaje
 * Muestra una tarjeta por cada tipo de juego: Memorama y Quiz
 */
const StudentActivities = () => {
    // Datos del usuario desde localStorage
    const userData = (() => {
        try {
            return JSON.parse(localStorage.getItem('userData')) || {};
        } catch { return {}; }
    })();

    const user = {
        id: userData.id || 'student_001',
        name: userData.name || 'Estudiante',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'Student'}`,
        level: 'A1'
    };

    // Actividades generales (una tarjeta por tipo de juego)
    const games = [
        {
            id: 'memorama',
            title: 'Memorama',
            subtitle: 'Tarjetas de Memoria',
            description: 'Aprende vocabulario y pronunciación mazahua emparejando tarjetas interactivas. Ejercita tu memoria mientras descubres nuevas palabras.',
            icon: '🎴',
            iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
            borderColor: 'border-orange-200',
            accentColor: 'text-orange-600',
            btnColor: 'bg-orange-500 hover:bg-orange-600',
            path: '/games/memorama',
            stats: [
                { icon: 'style', label: 'Tarjetas' },
                { icon: 'timer', label: 'Memoria' },
                { icon: 'emoji_events', label: 'XP' }
            ]
        },
        {
            id: 'quiz',
            title: 'Quiz',
            subtitle: 'Preguntas y Respuestas',
            description: 'Pon a prueba tus conocimientos del idioma mazahua con preguntas desafiantes. Evalúa gramática, vocabulario y comprensión.',
            icon: '❓',
            iconBg: 'bg-gradient-to-br from-purple-100 to-indigo-100',
            borderColor: 'border-purple-200',
            accentColor: 'text-purple-600',
            btnColor: 'bg-purple-500 hover:bg-purple-600',
            path: '/games/quiz',
            stats: [
                { icon: 'quiz', label: 'Preguntas' },
                { icon: 'psychology', label: 'Conocimiento' },
                { icon: 'emoji_events', label: 'XP' }
            ]
        },
        {
            id: 'intruso',
            title: 'El Intruso',
            subtitle: 'Encuentra al Intruso',
            description: 'Identifica qué palabra no pertenece al grupo. Mejora tu vocabulario y capacidad de categorización.',
            icon: '🕵️',
            iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
            borderColor: 'border-green-200',
            accentColor: 'text-green-600',
            btnColor: 'bg-green-500 hover:bg-green-600',
            path: '/games/intruso',
            stats: [
                { icon: 'search', label: 'Atención' },
                { icon: 'category', label: 'Lógica' },
                { icon: 'emoji_events', label: 'XP' }
            ]
        },
        {
            id: 'rompecabezas',
            title: 'Rompecabezas',
            subtitle: 'Completa la Frase',
            description: 'Selecciona la pieza correcta para completar la frase. Aprende vocabulario mazahua a través de frases contextuales en 5 ejercicios por lección.',
            icon: '🧩',
            iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
            borderColor: 'border-blue-200',
            accentColor: 'text-blue-600',
            btnColor: 'bg-blue-500 hover:bg-blue-600',
            path: '/games/rompecabezas',
            stats: [
                { icon: 'extension', label: 'Frases' },
                { icon: 'lightbulb', label: 'Contexto' },
                { icon: 'emoji_events', label: 'XP' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background-start to-background-end">
            {/* Sidebar */}
            <DashboardSidebar user={user} />

            {/* Main Content */}
            <main className="pl-64 min-h-screen">
                <div className="max-w-4xl mx-auto p-8">
                    {/* Header */}
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-800">Actividades de Aprendizaje</h1>
                        <p className="text-gray-500 mt-1">Selecciona una actividad para practicar y ganar XP.</p>
                    </header>

                    {/* Game Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {games.map((game) => (
                            <Link
                                key={game.id}
                                to={game.path}
                                className={`group block bg-white rounded-2xl border ${game.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
                            >
                                {/* Icon Header */}
                                <div className={`${game.iconBg} p-8 flex flex-col items-center justify-center`}>
                                    <span className="text-7xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {game.icon}
                                    </span>
                                    <h2 className={`text-2xl font-bold ${game.accentColor}`}>{game.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{game.subtitle}</p>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                                        {game.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-around mb-5 py-3 bg-gray-50 rounded-xl">
                                        {game.stats.map((stat, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-1">
                                                <span className={`material-symbols-outlined text-lg ${game.accentColor}`}>
                                                    {stat.icon}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium min-w-[60px] text-center">{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className={`w-full py-3 text-center text-white font-semibold rounded-xl ${game.btnColor} transition-colors`}>
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
                </div>
            </main>
        </div>
    );
};

export default StudentActivities;
