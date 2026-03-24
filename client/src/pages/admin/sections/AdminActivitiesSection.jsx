import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../../../services/apiConfig';
import { useAlert } from '../../../context/AlertContext';
import { QUESTIONNAIRE_TYPES, PAIR_TYPES } from '../../../utils/activityTypes';
import SectionHeader from '../../../components/common/SectionHeader';
import { useAdminData } from '../../../context/AdminDataContext';

const ALL_ACTIVITY_TYPES = [...QUESTIONNAIRE_TYPES, ...PAIR_TYPES];
const GAME_TYPE_FILTERS = [
    { value: 'ALL', label: 'Todos' },
    ...ALL_ACTIVITY_TYPES.map(t => ({ value: t.value, label: t.label })),
];

const AdminActivitiesSection = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { activities: activitiesSection } = useAdminData();
    const { data, loading, error, fetch, reload } = activitiesSection;

    const activities = Array.isArray(data) ? data : (data?.activities || []);

    const [filterType, setFilterType] = useState('ALL');
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    useEffect(() => {
        fetch();
    }, [fetch]);

    // ── Helpers ──
    const getDifficultyBadge = (difficult) => {
        const map = {
            'EASY':   { label: '🟢 Fácil',   color: '#22c55e' },
            'MEDIUM': { label: '🟡 Medio',   color: '#f59e0b' },
            'HARD':   { label: '🔴 Difícil', color: '#ef4444' },
        };
        return map[difficult] || { label: difficult, color: '#6b7280' };
    };

    const getGameTypeInfo = (gameType) => {
        const map = {
            'FAST_MEMORY':     { label: 'Memoria Rápida',      icon: '⚡', color: '#E65100' },
            'QUESTIONNAIRE':   { label: 'Cuestionario',        icon: '❓', color: '#7c3aed' },
            'INTRUDER':        { label: 'Intruso',             icon: '🕵️', color: '#d97706' },
            'FIND_THE_WORD':   { label: 'Encuentra Palabra',   icon: '🔍', color: '#0284c7' },
            'MEDIA_SONG':      { label: 'Canción',             icon: '🎵', color: '#db2777' },
            'MEDIA_ANECDOTE':  { label: 'Anécdota',            icon: '📖', color: '#059669' },
            'MEDIA_LEGEND':    { label: 'Leyenda',             icon: '🗺️', color: '#7c3aed' },
            'PUZZLE':          { label: 'Rompecabezas',        icon: '🧩', color: '#2563eb' },
            'MEMORY_GAME':     { label: 'Memory Game',         icon: '🎴', color: '#E65100' },
        };
        return map[gameType] || { label: gameType, icon: '🎮', color: '#6b7280' };
    };

    const handleDelete = async (id, title) => {
        showAlert({
            mode: 'alert',
            title: 'Confirmar Eliminación',
            message: `¿Eliminar "${title}"? Esta acción no se puede deshacer.`,
            buttons: [
                { text: 'Cancelar', type: 'cancel' },
                {
                    text: 'Eliminar', type: 'accept', onClick: async () => {
                        setDeletingId(id);
                        try {
                            await apiConfig.delete(`/api/games/${id}`);
                            reload();
                            showToast('Actividad eliminada correctamente.');
                        } catch (err) {
                            showAlert({
                                mode: 'error',
                                title: 'Error al eliminar',
                                message: err.message || 'Error desconocido',
                            });
                        } finally {
                            setDeletingId(null);
                        }
                    }
                }
            ]
        });
    };

    // ── Stats ──
    const quizValues = new Set(QUESTIONNAIRE_TYPES.map(t => t.value));
    const pairValues = new Set(PAIR_TYPES.map(t => t.value));
    const quizCount  = activities.filter(a => quizValues.has(a.gameType)).length;
    const pairsCount = activities.filter(a => pairValues.has(a.gameType)).length;

    const filteredActivities = activities.filter(a =>
        filterType === 'ALL' || a.gameType === filterType
    );

    // ── Card render ──
    const renderActivityCard = (activity) => {
        const typeInfo  = getGameTypeInfo(activity.gameType);
        const diffBadge = getDifficultyBadge(activity.difficult);
        const configSummary = activity.assignActivityGameConfigDTO || [];

        return (
            <div
                key={activity.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
                <div className="h-2" style={{ background: typeInfo.color }} />

                <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{ background: typeInfo.color + '15' }}
                        >
                            {typeInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 leading-tight truncate">{activity.title}</h3>
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block"
                                style={{ background: typeInfo.color + '15', color: typeInfo.color }}
                            >
                                {typeInfo.label}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{activity.description}</p>

                    {/* Teacher info */}
                    {activity.teacher && (
                        <p className="text-xs text-gray-400 mb-3">
                            👤 {activity.teacher.firstName} {activity.teacher.lastName}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span style={{ color: diffBadge.color, fontWeight: 600 }}>{diffBadge.label}</span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span>⭐ {activity.experience} XP</span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span>📝 {activity.totalQuestions} {activity.gameType === 'FAST_MEMORY' ? 'pares' : 'preguntas'}</span>
                    </div>

                    {/* Config badges */}
                    {configSummary.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap mt-auto">
                            {configSummary.map((cfg, i) => (
                                <div key={i} className="flex gap-1 text-[10px] bg-gray-50 rounded-lg px-2 py-1">
                                    {cfg.showImage && <span title="Imagen">🖼️</span>}
                                    {cfg.showText  && <span title="Texto">📝</span>}
                                    {cfg.playAudio && <span title="Audio">🔊</span>}
                                    <span className="text-gray-400 ml-1">{cfg.isMazahua ? 'MAZ' : 'ESP'}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1 mt-auto">
                        <button
                            onClick={() => navigate(`/admin/actividades/editar/${activity.id}`)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                            title="Editar"
                        >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            <span className="hidden sm:inline lg:hidden xl:inline">Editar</span>
                        </button>
                        <button
                            onClick={() => handleDelete(activity.id, activity.title)}
                            disabled={deletingId === activity.id}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                            title="Eliminar"
                        >
                            {deletingId === activity.id
                                ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-[16px]">delete</span>
                            }
                            <span className="hidden sm:inline lg:hidden xl:inline">Eliminar</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-gray-50 flex-1 min-h-full">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    <SectionHeader
                        title="Actividades"
                        subtitle="Gestiona todos los juegos y actividades del sistema."
                        onReload={reload}
                    />

                    {/* Stats */}
                    <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">❓</div>
                            <div>
                                <p className="text-sm text-gray-500">Quiz</p>
                                <span className="text-2xl font-bold text-gray-800">{quizCount}</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">🃏</div>
                            <div>
                                <p className="text-sm text-gray-500">Pares</p>
                                <span className="text-2xl font-bold text-gray-800">{pairsCount}</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">🎮</div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <span className="text-2xl font-bold text-gray-800">{activities.length}</span>
                            </div>
                        </div>
                    </section>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap mb-6">
                        {GAME_TYPE_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFilterType(f.value)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterType === f.value
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Cargando actividades...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
                            <span className="text-5xl block mb-4">⚠️</span>
                            <h3 className="text-lg font-bold text-red-600 mb-2">Error al cargar</h3>
                            <p className="text-gray-500 text-sm mb-6">{error}</p>
                            <button onClick={reload} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredActivities.map(activity => renderActivityCard(activity))}

                            {/* Create card */}
                            <div
                                onClick={() => navigate('/admin/actividades/crear')}
                                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-gray-400 text-3xl">add</span>
                                </div>
                                <h3 className="font-semibold text-blue-600 text-lg mb-1">Crear Nueva Actividad</h3>
                                <p className="text-sm text-gray-500 text-center">Diseña juegos y cuestionarios</p>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default AdminActivitiesSection;
