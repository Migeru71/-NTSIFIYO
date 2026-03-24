import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import apiConfig from '../../services/apiConfig';
import ActivityApiService from '../../services/ActivityApiService';
import { useAlert } from '../../context/AlertContext';
import { QUESTIONNAIRE_TYPES, PAIR_TYPES } from '../../utils/activityTypes';
import { ReactComponent as QuestionMarkIcon } from '../../assets/svgs/QuestionMark.svg';
import SectionHeader from '../../components/common/SectionHeader';
import { useTeacherData } from '../../context/TeacherDataContext';

// ── Game type filter options (built from activityTypes) ──
const ALL_ACTIVITY_TYPES = [...QUESTIONNAIRE_TYPES, ...PAIR_TYPES];
const GAME_TYPE_FILTERS = [
    { value: 'ALL', label: 'Todos' },
    ...ALL_ACTIVITY_TYPES.map(t => ({ value: t.value, label: t.label })),
];

const TABS = [
    { id: 'mine', label: 'Mis Actividades', icon: 'person' },
    { id: 'all', label: 'Todas las Actividades', icon: 'public' },
];

/**
 * Página de Recursos del Maestro
 * Muestra las actividades/juegos creados por el maestro autenticado.
 * GET /api/activities/teacher  — el teacher se resuelve por JWT.
 */
const TeacherResources = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const { showAlert } = useAlert();

    // ── Context-cached data ──
    const { resources } = useTeacherData();
    const { data, loading, error, fetch, reload: reloadResources } = resources;
    const activities = data?.activities || [];
    const instances = data?.instances || [];

    // ── Local UI state ──
    const [activeTab, setActiveTab] = useState('mine');
    const [filterType, setFilterType] = useState('ALL');
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState('');

    // ── Delete activity ──
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
                            reloadResources();
                            showToast('Actividad eliminada correctamente.');
                        } catch (err) {
                            showAlert({
                                mode: 'error',
                                title: 'Error al eliminar',
                                message: err.message || 'Error desconocido'
                            });
                        } finally {
                            setDeletingId(null);
                        }
                    }
                }
            ]
        });
    };

    // ── Assign activity to teacher's group ──
    const handleAssign = async (activity) => {
        try {
            await apiConfig.post('/api/activities/assign', { gameId: activity.id });
            showToast(`✅ "${activity.title}" asignada al grupo exitosamente.`);
        } catch (err) {
            const status = err?.status || err?.response?.status;
            if (status === 404) {
                showToast(`❌ Juego o grupo no encontrado.`);
            } else if (status === 409) {
                showToast(`⚠️ Este juego ya está asignado o el grupo no te pertenece.`);
            } else {
                showToast(`❌ Error al asignar: ${err.message || 'Error desconocido'}`);
            }
        }
    };

    // ── Toggle activity instance (Activar/Desactivar) ──
    const handleToggleInstance = async (activityId, state) => {
        const instance = instances.find(inst => (inst.game?.id === activityId || inst.gameId === activityId));
        if (!instance) return;

        const groupId = instance.group?.id || instance.groupId;
        if (!groupId) return;

        try {
            const res = await ActivityApiService.toggleInstance(groupId, activityId, state);
            if (res.success) {
                reloadResources();
                showToast(`Actividad ${instance.isActive ? 'desactivada' : 'activada'} correctamente.`);
            } else {
                showAlert({
                    mode: 'error',
                    title: 'Error de actualización',
                    message: res.error || 'No se pudo cambiar el estado de la actividad.'
                });
            }
        } catch (err) {
            console.error(err);
            showToast('❌ Error de conexión al cambiar estado.');
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    useEffect(() => {
        if (activeTab === 'mine') fetch();
    }, [activeTab, fetch]);

    // ── Helpers ──
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
            'FAST_MEMORY': { label: 'Memoria Rápida', icon: '⚡', color: '#E65100' },
            'QUESTIONNAIRE': { label: 'Cuestionario', icon: '❓', color: '#7c3aed' },
            'INTRUDER': { label: 'Intruso', icon: '🕵️', color: '#d97706' },
            'FIND_THE_WORD': { label: 'Encuentra Palabra', icon: '🔍', color: '#0284c7' },
            'MEDIA_SONG': { label: 'Canción', icon: '🎵', color: '#db2777' },
            'MEDIA_ANECDOTE': { label: 'Anécdota', icon: '📖', color: '#059669' },
            'MEDIA_LEGEND': { label: 'Leyenda', icon: '🗺️', color: '#7c3aed' },
            'PUZZLE': { label: 'Rompecabezas', icon: '🧩', color: '#2563eb' },
            'MEMORY_GAME': { label: 'Memory Game', icon: '🎴', color: '#E65100' },
        };
        return map[gameType] || { label: gameType, icon: '🎮', color: '#6b7280' };
    };

    // ── Filtered list ──
    const filteredActivities = activities.filter(a => {
        const matchesType = filterType === 'ALL' || a.gameType === filterType;
        return matchesType;
    });

    // ── Stats ──
    const quizValues = new Set(QUESTIONNAIRE_TYPES.map(t => t.value));
    const pairValues = new Set(PAIR_TYPES.map(t => t.value));
    const quizCount = activities.filter(a => quizValues.has(a.gameType)).length;
    const pairsCount = activities.filter(a => pairValues.has(a.gameType)).length;
    const assignedCount = instances.filter(i => i.isActive).length;
    const pausedCount = instances.filter(i => !i.isActive).length;

    // ── Categorized Lists ──
    const activeActivities = filteredActivities.filter(a => {
        const inst = instances.find(i => i.gameId === a.id || i.game?.id === a.id);
        return inst && inst.isActive;
    });
    const inactiveActivities = filteredActivities.filter(a => {
        const inst = instances.find(i => i.gameId === a.id || i.game?.id === a.id);
        return inst && !inst.isActive;
    });

    const renderActivityCard = (activity, extraClasses = "") => {
        const typeInfo = getGameTypeInfo(activity.gameType);
        const diffBadge = getDifficultyBadge(activity.difficult);
        const configSummary = activity.assignActivityGameConfigDTO || [];
        const inst = instances.find(i => (i.game?.id === activity.id || i.gameId === activity.id));

        return (
            <div
                key={activity.id}
                className={`bg-white rounded-2xl border ${inst ? (inst.isActive ? 'border-green-200 shadow-green-100' : 'border-red-100 shadow-red-50') : 'border-gray-100'} shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col ${extraClasses}`}
            >
                {/* Color bar */}
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
                        {/* Instance Badge */}
                        {inst && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${inst.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {inst.isActive ? '✅ Activa' : '❌ Inactiva'}
                            </span>
                        )}
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

                    {/* Game config badges */}
                    {configSummary.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap mt-auto">
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

                    {/* 3 action buttons */}
                    <div className="flex gap-2 pt-1 mt-auto">
                        <button
                            onClick={() => navigate(`/maestro/recursos/editar/${activity.id}`)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                            title="Editar"
                        >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            <span className="hidden sm:inline lg:hidden xl:inline">Editar</span>
                        </button>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                handleDelete(activity.id, activity.title);
                            }}
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

                        {/* Asignar or Toggle button */}
                        {!inst ? (
                            <button
                                onClick={() => handleAssign(activity)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                title="Asignar"
                            >
                                <span className="material-symbols-outlined text-[16px]">group_add</span>
                                <span className="hidden sm:inline lg:hidden xl:inline">Asignar</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => handleToggleInstance(activity.id, !inst.isActive)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-xl transition-colors ${inst.isActive ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                                title={inst.isActive ? 'Desactivar' : 'Activar'}
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {inst.isActive ? 'block' : 'check_circle'}
                                </span>
                                <span className="hidden sm:inline lg:hidden xl:inline">{inst.isActive ? 'Desactivar' : 'Activar'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        //min height 100% tailwind 
        <div className="w-full bg-gray-50 flex-1 min-h-full">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">

                    <SectionHeader
                        title="Mis Recursos"
                        subtitle="Gestiona las actividades y juegos que has creado."
                        onReload={reloadResources}
                    />

                    {/* ── TABS ── */}
                    <div className="flex gap-1 mb-6 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-green-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── "All" tab placeholder ── */}
                    {activeTab === 'all' ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-6xl mb-4">🚧</span>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Próximamente</h3>
                            <p className="text-gray-400 text-sm">La vista de todas las actividades estará disponible en una próxima versión.</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Summary */}
                            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                                        <QuestionMarkIcon className="w-10 h-10" />
                                    </div>
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
                                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Asignadas</p>
                                        <span className="text-2xl font-bold text-gray-800">{assignedCount}</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">⏸️</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pausadas</p>
                                        <span className="text-2xl font-bold text-gray-800">{pausedCount}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Filter chips */}
                            <div className="flex gap-2 flex-wrap mb-6">
                                {GAME_TYPE_FILTERS.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => setFilterType(f.value)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterType === f.value
                                            ? 'bg-green-500 text-white shadow-sm'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── Content ── */}
                            {loading ? (
                                <div className="text-center py-16">
                                    <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-gray-500">Cargando recursos...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
                                    <span className="text-5xl block mb-4">⚠️</span>
                                    <h3 className="text-lg font-bold text-red-600 mb-2">Error al cargar</h3>
                                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                                    <button
                                        onClick={reloadResources}
                                        className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : filteredActivities.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                    <span className="text-6xl block mb-4">📭</span>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {filterType !== 'ALL' ? 'Sin resultados' : 'Aún no has creado actividades'}
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {filterType !== 'ALL'
                                            ? 'Intenta con otro filtro.'
                                            : 'Crea tu primera actividad para que tus alumnos puedan practicar.'}
                                    </p>
                                    {filterType === 'ALL' && (
                                        <button
                                            onClick={() => navigate('/maestro/recursos/crear')}
                                            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                                        >
                                            🚀 Crear Primera Actividad
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8 w-full">
                                    {activeActivities.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🟢 Actividades Activas</h3>
                                            <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
                                                {activeActivities.map(activity => renderActivityCard(activity, "min-w-[320px] max-w-[360px] snap-start shrink-0"))}
                                            </div>
                                        </div>
                                    )}

                                    {inactiveActivities.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🔴 Actividades Inactivas</h3>
                                            <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
                                                {inactiveActivities.map(activity => renderActivityCard(activity, "min-w-[320px] max-w-[360px] snap-start shrink-0"))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        {(activeActivities.length > 0 || inactiveActivities.length > 0) && (
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 mt-4">🎮 Todas las Actividades</h3>
                                        )}
                                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredActivities.map((activity) => renderActivityCard(activity))}

                                            {/* Create Card */}
                                            <div
                                                onClick={() => navigate('/maestro/recursos/crear')}
                                                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer"
                                            >
                                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                    <span className="material-symbols-outlined text-gray-400 text-3xl">add</span>
                                                </div>
                                                <h3 className="font-semibold text-green-600 text-lg mb-1">Crear Nueva Actividad</h3>
                                                <p className="text-sm text-gray-500 text-center">Diseña juegos y cuestionarios</p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
            {
                toast && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50">
                        {toast}
                    </div>
                )
            }
        </div>
    );
};

export default TeacherResources;
