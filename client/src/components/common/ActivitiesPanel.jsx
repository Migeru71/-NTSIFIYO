import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { QUESTIONNAIRE_TYPES, PAIR_TYPES, getGameTypeInfo } from '../../config/activityConfig';
import { getDifficultyBadge } from '../../utils/difficultyBadges';
import SectionHeader from './SectionHeader';

// ── Filter options built from activityTypes enums ──
const ALL_ACTIVITY_TYPES = [...QUESTIONNAIRE_TYPES, ...PAIR_TYPES];
const GAME_TYPE_FILTERS = [
    { value: 'ALL', label: 'Todos' },
    ...ALL_ACTIVITY_TYPES.map(t => ({ value: t.value, label: t.label })),
];

const TABS = [
    { id: 'mine', label: 'Mis Actividades', icon: 'person' },
    { id: 'all',  label: 'Todas las Actividades', icon: 'public' },
];

/**
 * ActivitiesPanel — componente compartido entre teacher y admin.
 *
 * @param {object}   props
 * @param {Array}    props.activities        Lista de actividades
 * @param {Array}    props.instances         Instancias del maestro ([] para admin)
 * @param {boolean}  props.loading
 * @param {string}   props.error
 * @param {Function} props.onReload          Invalida la query y recarga
 * @param {Function} props.onDeleteActivity  async (id) => void — sin confirmación, el panel la maneja
 * @param {Function} [props.onAssignActivity]  async (activity) => void — solo teacher
 * @param {Function} [props.onToggleInstance]  async (activityId, newState) => void — solo teacher
 * @param {string}   props.editRoute         Prefijo de ruta para editar, ej. '/maestro/recursos/editar'
 * @param {string}   props.createRoute       Ruta para crear nueva actividad
 * @param {string}   props.title
 * @param {string}   props.subtitle
 * @param {boolean}  [props.showTabs]        Mostrar tabs Mine/All (teacher)
 */
const ActivitiesPanel = ({
    activities = [],
    instances  = [],
    loading    = false,
    error      = '',
    onReload,
    onDeleteActivity,
    onAssignActivity,
    onToggleInstance,
    editRoute,
    createRoute,
    title,
    subtitle,
    showTabs = false,
}) => {
    const navigate   = useNavigate();
    const { showAlert } = useAlert();

    const [activeTab,   setActiveTab]   = useState('mine');
    const [filterType,  setFilterType]  = useState('ALL');
    const [deletingId,  setDeletingId]  = useState(null);
    const [assigningId, setAssigningId] = useState(null);
    const [togglingId,  setTogglingId]  = useState(null);
    const [toast,       setToast]       = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleDelete = (id, actTitle) => {
        showAlert({
            mode: 'alert',
            title: 'Confirmar Eliminación',
            message: `¿Eliminar "${actTitle}"? Esta acción no se puede deshacer.`,
            buttons: [
                { text: 'Cancelar', type: 'cancel' },
                {
                    text: 'Eliminar', type: 'accept', onClick: async () => {
                        setDeletingId(id);
                        try {
                            await onDeleteActivity(id);
                            onReload();
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
                    },
                },
            ],
        });
    };

    const handleAssign = async (activity) => {
        if (!onAssignActivity) return;
        setAssigningId(activity.id);
        try {
            await onAssignActivity(activity);
            onReload();
            showToast(`✅ "${activity.title}" asignada al grupo exitosamente.`);
        } catch (err) {
            const status = err?.status || err?.response?.status;
            if (status === 404)       showToast('❌ Juego o grupo no encontrado.');
            else if (status === 409)  showToast('⚠️ Este juego ya está asignado o el grupo no te pertenece.');
            else                      showToast(`❌ Error al asignar: ${err.message || 'Error desconocido'}`);
        } finally {
            setAssigningId(null);
        }
    };

    const handleToggle = async (activityId, inst) => {
        if (!onToggleInstance) return;
        setTogglingId(activityId);
        try {
            await onToggleInstance(activityId, !inst.isActive);
            onReload();
            showToast(`Actividad ${inst.isActive ? 'desactivada' : 'activada'} correctamente.`);
        } catch (err) {
            showAlert({
                mode: 'error',
                title: 'Error de actualización',
                message: err.message || 'No se pudo cambiar el estado.',
            });
        } finally {
            setTogglingId(null);
        }
    };

    // ── Stats ─────────────────────────────────────────────────────────────────
    const quizValues    = new Set(QUESTIONNAIRE_TYPES);
    const pairValues    = new Set(PAIR_TYPES);
    const quizCount     = activities.filter(a => quizValues.has(a.gameType)).length;
    const pairsCount    = activities.filter(a => pairValues.has(a.gameType)).length;
    const assignedCount = instances.filter(i => i.isActive).length;
    const pausedCount   = instances.filter(i => !i.isActive).length;
    const hasInstances  = !!onToggleInstance;

    // ── Filtering ─────────────────────────────────────────────────────────────
    const filteredActivities = activities.filter(
        a => filterType === 'ALL' || a.gameType === filterType
    );

    const findInst = (a) => instances.find(i => i.gameId === a.id || i.game?.id === a.id);

    const activeActivities   = hasInstances
        ? filteredActivities.filter(a => { const i = findInst(a); return i && i.isActive; })
        : [];
    const inactiveActivities = hasInstances
        ? filteredActivities.filter(a => { const i = findInst(a); return i && !i.isActive; })
        : [];

    // ── Card ──────────────────────────────────────────────────────────────────
    const renderCard = (activity, extraClasses = '') => {
        const typeInfo      = getGameTypeInfo(activity.gameType);
        const diffBadge     = getDifficultyBadge(activity.difficult);
        const configSummary = activity.assignActivityGameConfigDTO || [];
        const inst          = findInst(activity);

        return (
            <div
                key={activity.id}
                className={`bg-white rounded-2xl border ${
                    inst
                        ? (inst.isActive ? 'border-green-200 shadow-green-100' : 'border-red-100 shadow-red-50')
                        : 'border-gray-100'
                } shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col ${extraClasses}`}
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

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span style={{ color: diffBadge.hexColor, fontWeight: 600 }}>
                            {diffBadge.dot} {diffBadge.label}
                        </span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span>⭐ {activity.experience} XP</span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span>
                            📝 {activity.totalQuestions}{' '}
                            {activity.gameType === 'FAST_MEMORY' ? 'pares' : 'preguntas'}
                        </span>
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
                            onClick={() => navigate(`${editRoute}/${activity.id}`)}
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

                        {/* Assign / Toggle — solo para teacher */}
                        {onAssignActivity && (
                            !inst ? (
                                <button
                                    onClick={() => handleAssign(activity)}
                                    disabled={assigningId === activity.id}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors disabled:opacity-50"
                                    title="Asignar"
                                >
                                    {assigningId === activity.id
                                        ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                        : <span className="material-symbols-outlined text-[16px]">group_add</span>
                                    }
                                    <span className="hidden sm:inline lg:hidden xl:inline">Asignar</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleToggle(activity.id, inst)}
                                    disabled={togglingId === activity.id}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 ${
                                        inst.isActive
                                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                                    }`}
                                    title={inst.isActive ? 'Desactivar' : 'Activar'}
                                >
                                    {togglingId === activity.id
                                        ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                        : <span className="material-symbols-outlined text-[16px]">
                                            {inst.isActive ? 'block' : 'check_circle'}
                                        </span>
                                    }
                                    <span className="hidden sm:inline lg:hidden xl:inline">
                                        {inst.isActive ? 'Desactivar' : 'Activar'}
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ── Content area ──────────────────────────────────────────────────────────
    const renderContent = () => {
        if (loading) return (
            <div className="text-center py-16">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Cargando actividades...</p>
            </div>
        );

        if (error) return (
            <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
                <span className="text-5xl block mb-4">⚠️</span>
                <h3 className="text-lg font-bold text-red-600 mb-2">Error al cargar</h3>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                    onClick={onReload}
                    className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );

        if (filteredActivities.length === 0) return (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <span className="text-6xl block mb-4">📭</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {filterType !== 'ALL' ? 'Sin resultados' : 'Aún no hay actividades'}
                </h3>
                <p className="text-gray-500 mb-6">
                    {filterType !== 'ALL'
                        ? 'Intenta con otro filtro.'
                        : 'Crea la primera actividad para comenzar.'}
                </p>
                {filterType === 'ALL' && (
                    <button
                        onClick={() => navigate(createRoute)}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                        🚀 Crear Primera Actividad
                    </button>
                )}
            </div>
        );

        return (
            <div className="flex flex-col gap-8 w-full">
                {/* Activas (teacher con instancias) */}
                {activeActivities.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🟢 Actividades Activas
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
                            {activeActivities.map(a => renderCard(a, 'min-w-[320px] max-w-[360px] snap-start shrink-0'))}
                        </div>
                    </div>
                )}

                {/* Inactivas (teacher con instancias) */}
                {inactiveActivities.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🔴 Actividades Inactivas
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
                            {inactiveActivities.map(a => renderCard(a, 'min-w-[320px] max-w-[360px] snap-start shrink-0'))}
                        </div>
                    </div>
                )}

                {/* Grid completo */}
                <div>
                    {(activeActivities.length > 0 || inactiveActivities.length > 0) && (
                        <h3 className="text-xl font-bold text-gray-800 mb-4 mt-4">🎮 Todas las Actividades</h3>
                    )}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredActivities.map(a => renderCard(a))}

                        {/* Create card */}
                        <div
                            onClick={() => navigate(createRoute)}
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
        );
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full bg-gray-50 flex-1 min-h-full">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">

                    <SectionHeader title={title} subtitle={subtitle} onReload={onReload} />

                    {/* Tabs — solo teacher */}
                    {showTabs && (
                        <div className="flex gap-1 mb-6 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-green-500 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tab "all" — placeholder */}
                    {showTabs && activeTab === 'all' ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-6xl mb-4">🚧</span>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Próximamente</h3>
                            <p className="text-gray-400 text-sm">
                                La vista de todas las actividades estará disponible en una próxima versión.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Stats */}
                            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                                {hasInstances ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">🎮</div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <span className="text-2xl font-bold text-gray-800">{activities.length}</span>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Filter chips */}
                            <div className="flex gap-2 flex-wrap mb-6">
                                {GAME_TYPE_FILTERS.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => setFilterType(f.value)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                            filterType === f.value
                                                ? 'bg-green-500 text-white shadow-sm'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {renderContent()}
                        </>
                    )}
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default ActivitiesPanel;
