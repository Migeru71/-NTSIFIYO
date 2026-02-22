// client/src/pages/TeacherResources.js
// Vista de recursos del maestro — muestra actividades creadas y permite crear nuevas
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TeacherSidebar from '../components/Dashboard/TeacherSidebar';

/**
 * Página de Recursos del Maestro
 * Muestra las actividades/juegos creados por el maestro
 * Endpoint futuro: GET /api/games/{teacher}
 */
const TeacherResources = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    // Datos del maestro (mock)
    const user = {
        id: 'teacher_001',
        name: 'Maria Gonzalez',
        email: 'maria.g@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'
    };

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = () => {
        setLoading(true);
        // Simular respuesta de GET /api/games/{teacher}
        setTimeout(() => {
            setActivities(mockTeacherGames);
            setLoading(false);
        }, 400);
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) {
            setActivities(prev => prev.filter(a => a.id !== id));
        }
    };

    const getDifficultyBadge = (difficult) => {
        const map = {
            'EASY': { label: '🟢 Fácil', color: '#22c55e' },
            'MEDIUM': { label: '🟡 Medio', color: '#f59e0b' },
            'HARD': { label: '🔴 Difícil', color: '#ef4444' }
        };
        return map[difficult] || { label: difficult, color: '#6b7280' };
    };

    const getGameTypeInfo = (gameType) => {
        const map = {
            'FAST_MEMORY': { label: 'Memoria Rápida', icon: '🎴', color: '#E65100' },
            'QUESTIONNAIRE': { label: 'Cuestionario', icon: '❓', color: '#7c3aed' }
        };
        return map[gameType] || { label: gameType, icon: '🎮', color: '#6b7280' };
    };

    // Filtrar actividades
    const filteredActivities = activities.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'ALL' || a.gameType === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherSidebar user={user} />

            <main className="pl-64 min-h-screen">
                <div className="max-w-6xl mx-auto p-8">
                    {/* Breadcrumbs */}
                    <nav className="text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-gray-700">Inicio</Link>
                        <span className="mx-2">›</span>
                        <Link to="/maestro/dashboard" className="hover:text-gray-700">Panel de Control</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-700">Recursos</span>
                    </nav>

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Mis Recursos</h1>
                            <p className="text-gray-500 mt-1">Gestiona las actividades y juegos que has creado.</p>
                        </div>
                        <button
                            onClick={() => navigate('/maestro/recursos/crear')}
                            className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Crear Nueva Actividad
                        </button>
                    </header>

                    {/* Stats Summary */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">🎴</div>
                            <div>
                                <p className="text-sm text-gray-500">Juegos de Pares</p>
                                <span className="text-2xl font-bold text-gray-800">
                                    {activities.filter(a => a.gameType === 'FAST_MEMORY').length}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">❓</div>
                            <div>
                                <p className="text-sm text-gray-500">Cuestionarios</p>
                                <span className="text-2xl font-bold text-gray-800">
                                    {activities.filter(a => a.gameType === 'QUESTIONNAIRE').length}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">⭐</div>
                            <div>
                                <p className="text-sm text-gray-500">XP Total Disponible</p>
                                <span className="text-2xl font-bold text-gray-800">
                                    {activities.reduce((sum, a) => sum + a.experience, 0)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar actividades..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            {[
                                { value: 'ALL', label: 'Todos' },
                                { value: 'FAST_MEMORY', label: '🎴 Pares' },
                                { value: 'QUESTIONNAIRE', label: '❓ Quiz' }
                            ].map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilterType(f.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === f.value
                                        ? 'bg-green-500 text-white shadow-sm'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activities Grid */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Cargando recursos...</p>
                        </div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <span className="text-6xl block mb-4">📭</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {searchQuery || filterType !== 'ALL' ? 'Sin resultados' : 'Aún no has creado actividades'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchQuery || filterType !== 'ALL'
                                    ? 'Intenta con otra búsqueda o filtro.'
                                    : 'Crea tu primera actividad para que tus alumnos puedan practicar.'}
                            </p>
                            {!searchQuery && filterType === 'ALL' && (
                                <button
                                    onClick={() => navigate('/maestro/recursos/crear')}
                                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                                >
                                    🚀 Crear Primera Actividad
                                </button>
                            )}
                        </div>
                    ) : (
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredActivities.map((activity) => {
                                const typeInfo = getGameTypeInfo(activity.gameType);
                                const diffBadge = getDifficultyBadge(activity.difficult);
                                const configSummary = activity.gameConfigs || [];

                                return (
                                    <div
                                        key={activity.id}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                                    >
                                        {/* Color bar */}
                                        <div className="h-2" style={{ background: typeInfo.color }} />

                                        <div className="p-5">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                        style={{ background: typeInfo.color + '15' }}
                                                    >
                                                        {typeInfo.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 leading-tight">{activity.title}</h3>
                                                        <span
                                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block"
                                                            style={{ background: typeInfo.color + '15', color: typeInfo.color }}
                                                        >
                                                            {typeInfo.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => navigate(`/maestro/recursos/editar/${activity.id}`)}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                                        title="Editar"
                                                    >✏️</button>
                                                    <button
                                                        onClick={() => handleDelete(activity.id, activity.title)}
                                                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                                        title="Eliminar"
                                                    >🗑️</button>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{activity.description}</p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <span style={{ color: diffBadge.color, fontWeight: 600 }}>{diffBadge.label}</span>
                                                </span>
                                                <span className="w-px h-3 bg-gray-200" />
                                                <span>⭐ {activity.experience} XP</span>
                                                <span className="w-px h-3 bg-gray-200" />
                                                <span>📝 {activity.totalQuestions} {activity.gameType === 'FAST_MEMORY' ? 'pares' : 'preguntas'}</span>
                                            </div>

                                            {/* Game Configs summary */}
                                            {configSummary.length > 0 && (
                                                <div className="flex gap-2 mb-4">
                                                    {configSummary.map((cfg, i) => (
                                                        <div key={i} className="flex gap-1 text-[10px] bg-gray-50 rounded-lg px-2 py-1">
                                                            {cfg.showImage && <span title="Imagen">🖼️</span>}
                                                            {cfg.showText && <span title="Texto">📝</span>}
                                                            {cfg.playAudio && <span title="Audio">🔊</span>}
                                                            <span className="text-gray-400 ml-1">{cfg.isMazahua ? 'MAZ' : 'ESP'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <button
                                                onClick={() => navigate(`/maestro/recursos/editar/${activity.id}`)}
                                                className="block w-full py-2.5 text-center text-green-600 font-semibold hover:bg-green-50 rounded-xl transition-colors"
                                            >
                                                Gestionar Actividad
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Create Card */}
                            <div
                                onClick={() => navigate('/maestro/recursos/crear')}
                                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-gray-400 text-3xl">add</span>
                                </div>
                                <h3 className="font-semibold text-green-600 text-lg mb-1">Crear Nueva Actividad</h3>
                                <p className="text-sm text-gray-500 text-center">Diseña juegos de pares o cuestionarios</p>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

// ============================================================
// MOCK DATA — Simula respuesta de GET /api/games/{teacher}
// ============================================================
const mockTeacherGames = [
    {
        id: 1,
        gameType: 'FAST_MEMORY',
        title: 'Animales de la Granja',
        description: 'Relaciona los nombres de animales en español con su traducción en mazahua.',
        totalQuestions: 8,
        experience: 200,
        difficult: 'EASY',
        wordIds: [1, 2, 3, 4, 5, 6, 7, 8],
        questions: [],
        mediaId: null,
        gameConfigs: [
            { showImage: true, showText: true, playAudio: false, isMazahua: false, order: 1 },
            { showImage: false, showText: true, playAudio: true, isMazahua: true, order: 2 }
        ]
    },
    {
        id: 2,
        gameType: 'QUESTIONNAIRE',
        title: 'Quiz: Saludos Mazahua',
        description: 'Evalúa tu conocimiento sobre las formas de saludo en la lengua mazahua.',
        totalQuestions: 5,
        experience: 150,
        difficult: 'EASY',
        wordIds: [],
        questions: [
            {
                question: '¿Cómo se dice "Buenos días" en mazahua?',
                wordId: null,
                responseList: [
                    { answerText: 'Ki jñaa kjo', isCorrect: true, wordId: null },
                    { answerText: 'Nu\'u jñatjo', isCorrect: false, wordId: null },
                    { answerText: 'Mboku ts\'ike', isCorrect: false, wordId: null }
                ]
            }
        ],
        mediaId: null,
        gameConfigs: [
            { showImage: false, showText: true, playAudio: false, isMazahua: false, order: 1 },
            { showImage: false, showText: true, playAudio: false, isMazahua: false, order: 2 }
        ]
    },
    {
        id: 3,
        gameType: 'FAST_MEMORY',
        title: 'Colores y Naturaleza',
        description: 'Aprende los colores en mazahua relacionándolos con elementos de la naturaleza.',
        totalQuestions: 6,
        experience: 180,
        difficult: 'MEDIUM',
        wordIds: [10, 11, 12, 13, 14, 15],
        questions: [],
        mediaId: 1,
        gameConfigs: [
            { showImage: true, showText: false, playAudio: false, isMazahua: false, order: 1 },
            { showImage: false, showText: true, playAudio: true, isMazahua: true, order: 2 }
        ]
    },
    {
        id: 4,
        gameType: 'QUESTIONNAIRE',
        title: 'Cultura Mazahua Avanzado',
        description: 'Preguntas sobre tradiciones, vestimenta y costumbres del pueblo mazahua.',
        totalQuestions: 10,
        experience: 350,
        difficult: 'HARD',
        wordIds: [],
        questions: [
            {
                question: '¿Cuál es la prenda tradicional mazahua para las mujeres?',
                wordId: null,
                responseList: [
                    { answerText: 'El quechquémitl', isCorrect: true, wordId: null },
                    { answerText: 'El huipil', isCorrect: false, wordId: null },
                    { answerText: 'El rebozo', isCorrect: false, wordId: null },
                    { answerText: 'La tilma', isCorrect: false, wordId: null }
                ]
            }
        ],
        mediaId: null,
        gameConfigs: [
            { showImage: true, showText: true, playAudio: false, isMazahua: false, order: 1 },
            { showImage: false, showText: true, playAudio: true, isMazahua: true, order: 2 }
        ]
    },
    {
        id: 5,
        gameType: 'FAST_MEMORY',
        title: 'Números del 1 al 20',
        description: 'Practica los números en mazahua emparejando con su forma escrita en español.',
        totalQuestions: 10,
        experience: 250,
        difficult: 'MEDIUM',
        wordIds: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        questions: [],
        mediaId: null,
        gameConfigs: [
            { showImage: false, showText: true, playAudio: true, isMazahua: false, order: 1 },
            { showImage: false, showText: true, playAudio: true, isMazahua: true, order: 2 }
        ]
    }
];

export default TeacherResources;
