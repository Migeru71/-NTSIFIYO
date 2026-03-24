import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import { useTeacherData } from '../../context/TeacherDataContext';

/**
 * Dashboard principal del maestro
 */
const TeacherDashboard = () => {
    const { dashboard } = useTeacherData();
    const { data, loading, error, fetch, reload } = dashboard;

    useEffect(() => {
        fetch();
    }, [fetch]);

    const {
        totalStudents = 0,
        activeAssignments = [],
        alertStudents = [],
        completeStudents = []
    } = data || {};

    // Componente de tarjeta de estadísticas
    const StatCard = ({ icon, label, value, colorClass, bgColorClass, iconColorClass }) => (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${bgColorClass} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined text-3xl ${iconColorClass}`}>{icon}</span>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                <div className="flex items-end gap-2">
                    <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
                </div>
            </div>
        </div>
    );

    // Circular Progress Component
    const CircularProgress = ({ value, max, size = 60, strokeWidth = 6, color = '#22c55e', bg = '#f1f5f9' }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const safeMax = max > 0 ? max : 1;
        const safeValue = value > max ? max : value;
        const percent = (safeValue / safeMax) * 100;
        const offset = circumference - (percent / 100) * circumference;
        return (
            <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bg} strokeWidth={strokeWidth} />
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-gray-700">{Math.round(percent)}%</span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-gray-50 min-h-[calc(100vh-4rem)]">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    <SectionHeader
                        title="Panel de Control"
                        subtitle="Monitorea el progreso de tu grupo estudiantil."
                        onReload={reload}
                    />

                    {loading && (
                        <div className="text-center py-20">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Actualizando métricas de tu grupo...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-red-100 mt-6 shadow-sm">
                            <span className="text-6xl block mb-4">⚠️</span>
                            <h3 className="text-xl font-bold text-red-600 mb-2">Error cargando el panel</h3>
                            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{error}</p>
                            <button onClick={reload} className="px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors">
                                Reintentar conexión
                            </button>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            {/* 4 Main Stat Cards */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                <StatCard icon="groups" label="Total de Estudiantes" value={totalStudents} colorClass="text-gray-800" bgColorClass="bg-blue-50" iconColorClass="text-blue-500" />
                                <StatCard icon="verified" label="Alumnos al Día" value={completeStudents.length} colorClass="text-green-600" bgColorClass="bg-green-50" iconColorClass="text-green-500" />
                                <StatCard icon="notification_important" label="Requieren Atención" value={alertStudents.length} colorClass="text-orange-600" bgColorClass="bg-orange-50" iconColorClass="text-orange-500" />
                                <StatCard icon="assignment" label="Actividades Activas" value={activeAssignments.length} colorClass="text-purple-600" bgColorClass="bg-purple-50" iconColorClass="text-purple-500" />
                            </section>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Middle Column: Active Assignments Progress */}
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-purple-500">trending_up</span>
                                                Progreso de Asignaciones
                                            </h3>
                                            <Link to="/maestro/asignaciones" className="text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
                                                Ver todas
                                            </Link>
                                        </div>
                                        {activeAssignments.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                <span className="text-5xl mb-3 opacity-50">📭</span>
                                                <p className="text-gray-500 font-medium">No hay actividades activas actualmente.</p>
                                                <Link to="/maestro/recursos" className="mt-3 text-sm text-green-600 font-semibold hover:underline">Asignar nueva actividad</Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-5 flex-1">
                                                {activeAssignments.map((assignment, idx) => {
                                                    const total = totalStudents > 0 ? totalStudents : 1;
                                                    const completed = assignment.finishedCount || 0;
                                                    return (
                                                        <div key={idx} className="group">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">extension</span>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-800 leading-tight group-hover:text-purple-600 transition-colors">
                                                                            {assignment.title || 'Actividad Sin Nombre'}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 mt-0.5">{completed} de {totalStudents} alumnos completaron</p>
                                                                    </div>
                                                                </div>
                                                                <div className="shrink-0 ml-4">
                                                                    <CircularProgress value={completed} max={total} color="#9333ea" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Students Lists */}
                                <div className="flex flex-col gap-6">
                                    {/* Alumnos en Alerta */}
                                    <div className="bg-white rounded-3xl border border-orange-100 shadow-sm shadow-orange-50 p-6 flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                            <span className="material-symbols-outlined text-orange-500">warning</span>
                                            Alumnos en Alerta
                                            <span className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{alertStudents.length}</span>
                                        </h3>
                                        {alertStudents.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 text-sm">Ningún alumno en alerta actualmente. ¡Gran trabajo!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                {alertStudents.map((st, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100/50">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700 shrink-0">{st.listNumber || '-'}</div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-800 truncate">{st.lastName ? `${st.lastName}, ${st.firstName}` : st.username}</p>
                                                            <p className="text-[10px] text-gray-500 truncate">Atrasado en {st.missedAssignments || 'actividades'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Alumnos al Día */}
                                    <div className="bg-white rounded-3xl border border-green-100 shadow-sm shadow-green-50 p-6 flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                            <span className="material-symbols-outlined text-green-500">verified</span>
                                            Alumnos al Día
                                            <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{completeStudents.length}</span>
                                        </h3>
                                        {completeStudents.length === 0 ? (
                                            <div className="text-center py-8"><p className="text-gray-400 text-sm">No hay alumnos al día todavía.</p></div>
                                        ) : (
                                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                {completeStudents.map((st, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-green-50/30 p-2.5 rounded-xl border border-green-50">
                                                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0">{st.listNumber || '-'}</div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-bold text-gray-800 truncate">{st.lastName ? `${st.lastName}, ${st.firstName}` : st.username}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
