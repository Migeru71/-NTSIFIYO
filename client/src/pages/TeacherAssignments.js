// client/src/pages/TeacherAssignments.js
// Vista de asignaciones del maestro — lista actividades activas asignadas a su grupo
// Incluye sección expandible por actividad para ver las respuestas de cada estudiante
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import ActivityApiService from '../services/ActivityApiService';
import apiConfig from '../services/apiConfig';
import { useStudents } from '../context/StudentsContext';
import Breadcrumb from '../components/common/Breadcrumb';

// ── Helpers ──

const GAME_TYPE_MAP = {
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

const DIFFICULTY_MAP = {
    'EASY': { label: 'Fácil', color: 'bg-green-100 text-green-700', dot: '🟢' },
    'MEDIUM': { label: 'Medio', color: 'bg-amber-100 text-amber-700', dot: '🟡' },
    'HARD': { label: 'Difícil', color: 'bg-red-100 text-red-700', dot: '🔴' },
};

const getGameType = (type) => GAME_TYPE_MAP[type] || { label: type, icon: '🎮', color: '#6b7280' };
const getDifficulty = (diff) => DIFFICULTY_MAP[diff] || { label: diff, color: 'bg-gray-100 text-gray-700', dot: '⚪' };

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch { return dateStr; }
};

// ── Student Detail Row (accordion inside the expanded section) ──
const StudentResponseRow = ({ student, activityId }) => {
    const [open, setOpen] = useState(false);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const handleToggle = async () => {
        if (!open && !loaded) {
            setLoading(true);
            const result = await ActivityApiService.getStudentResponses(activityId, student.username);
            if (result.success) {
                setResponses(result.data);
            }
            setLoaded(true);
            setLoading(false);
        }
        setOpen(prev => !prev);
    };

    const correctCount = responses.filter(r => r.isCorrect).length;
    const totalCount = responses.length;

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            {/* Student header row */}
            <button
                onClick={handleToggle}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(student.firstname || student.username || '?').charAt(0).toUpperCase()}
                </div>

                {/* Name / username */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                        {student.lastname ? `${student.lastname}, ${student.firstname}` : student.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{student.username}</p>
                </div>

                {/* Quick badge if loaded */}
                {loaded && !loading && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${correctCount === totalCount && totalCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {correctCount}/{totalCount} correctas
                    </span>
                )}

                {/* Chevron */}
                <span className="material-symbols-outlined text-gray-400 text-[20px] flex-shrink-0">
                    {open ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {/* Responses detail */}
            {open && (
                <div className="border-t border-gray-50 bg-gray-50/60 px-4 py-3">
                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                            <div className="w-4 h-4 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
                            Cargando respuestas...
                        </div>
                    ) : responses.length === 0 ? (
                        <p className="text-sm text-gray-400 py-2">Sin respuestas registradas.</p>
                    ) : (
                        <div className="space-y-2">
                            {/* Summary bar */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all"
                                        style={{ width: totalCount > 0 ? `${(correctCount / totalCount) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-600">
                                    {totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0}%
                                </span>
                            </div>

                            {/* Individual responses */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {responses.map((resp, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${resp.isCorrect
                                            ? 'bg-green-50 border-green-100 text-green-700'
                                            : 'bg-red-50 border-red-100 text-red-600'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {resp.isCorrect ? 'check_circle' : 'cancel'}
                                        </span>
                                        <span>Pregunta {idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Main Component ──

const TeacherAssignments = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [groupId, setGroupId] = useState(null);

    // Student list from shared context (cached across teacher views)
    const { students, fetchStudents: loadStudents } = useStudents();

    // Step 1: Discover the teacher's groupId from their instances
    const resolveGroupId = useCallback(async () => {
        // Try from user object first
        const currentUser = AuthService.getCurrentUser();
        if (currentUser?.grade) {
            return currentUser.grade;
        }
        // Fallback: get from group instances (resolved by JWT on backend)
        try {
            const instResult = await ActivityApiService.getGroupInstances();
            if (instResult.success && instResult.data.length > 0) {
                const id = instResult.data[0].group?.id || instResult.data[0].groupId;
                if (id) return id;
            }
        } catch (e) {
            console.error('Error resolving groupId:', e);
        }
        return null;
    }, []);

    // Step 2: Load assignments once we have a groupId
    const loadAssignments = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            let gId = groupId;
            if (!gId) {
                gId = await resolveGroupId();
                if (gId) setGroupId(gId);
            }
            if (!gId) {
                setError('No se pudo determinar tu grupo. Contacta al administrador.');
                setLoading(false);
                return;
            }
            const result = await ActivityApiService.getActiveAssignments(gId, true);
            if (result.success) {
                setActivities(result.data);
            } else {
                setError(result.error || 'Error al cargar las asignaciones.');
            }
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError(err.message || 'Error de conexión.');
        } finally {
            setLoading(false);
        }
    }, [groupId, resolveGroupId]);

    // loadStudents is now provided by useStudents() (aliased from fetchStudents)
    // It will only fetch from the backend if students haven't been loaded yet

    useEffect(() => {
        loadAssignments();
    }, [loadAssignments]);

    const toggleExpand = async (gameId) => {
        if (expandedId !== gameId) {
            // Load students on first expand
            await loadStudents();
        }
        setExpandedId(prev => (prev === gameId ? null : gameId));
    };

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="w-full">
                <div className="max-w-5xl mx-auto p-8">

                    {/* Breadcrumb */}
                    <Breadcrumb />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Asignaciones Activas</h1>
                            <p className="text-gray-500 mt-1">
                                Actividades asignadas y su progreso en el grupo.
                            </p>
                        </div>
                        <button
                            onClick={loadAssignments}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm disabled:opacity-50"
                            title="Recargar asignaciones"
                        >
                            <span className={`material-symbols-outlined text-xl ${loading ? 'animate-spin' : ''}`}>
                                sync
                            </span>
                            Actualizar
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Cargando asignaciones...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-red-100 shadow-sm">
                            <span className="text-5xl block mb-4">⚠️</span>
                            <h3 className="text-lg font-bold text-red-600 mb-2">Error al cargar</h3>
                            <p className="text-gray-500 text-sm mb-6">{error}</p>
                            <button
                                onClick={loadAssignments}
                                className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-6xl block mb-4">📭</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Sin asignaciones activas</h3>
                            <p className="text-gray-500">No hay actividades asignadas a tu grupo en este momento.</p>
                            <p className="text-gray-400 text-sm mt-2">Asigna actividades desde la sección de <Link to="/maestro/recursos" className="text-green-600 font-semibold hover:underline">Recursos</Link>.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Summary badge */}
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100">
                                    {activities.length} {activities.length === 1 ? 'actividad' : 'actividades'} activas
                                </span>
                            </div>

                            {/* Activities list */}
                            {activities.map((activity) => {
                                const gameType = getGameType(activity.gameType);
                                const difficulty = getDifficulty(activity.difficult);
                                const isExpanded = expandedId === activity.gameId;
                                const progressPercent = activity.totalCount > 0
                                    ? Math.round((activity.completedCount / activity.totalCount) * 100)
                                    : 0;

                                return (
                                    <div
                                        key={activity.gameId}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                                    >
                                        {/* Color bar */}
                                        <div className="h-1.5" style={{ background: gameType.color }} />

                                        <div className="p-5">
                                            {/* Main row */}
                                            <div className="flex items-center gap-4">
                                                {/* Icon */}
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                                    style={{ background: gameType.color + '15' }}
                                                >
                                                    {gameType.icon}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-gray-800 text-lg leading-tight truncate">
                                                            {activity.title}
                                                        </h3>
                                                        <span
                                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                                            style={{ background: gameType.color + '15', color: gameType.color }}
                                                        >
                                                            {gameType.label}
                                                        </span>
                                                    </div>

                                                    {/* Meta row */}
                                                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                                                            {difficulty.dot} {difficulty.label}
                                                        </span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                            {formatDate(activity.assignedDate)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Progress */}
                                                <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 min-w-[120px]">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-500">Progreso:</span>
                                                        <span className="font-bold text-gray-800">{activity.completedCount}/{activity.totalCount}</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${progressPercent}%`,
                                                                background: progressPercent === 100 ? '#22c55e' : gameType.color
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] text-gray-400 font-medium">{progressPercent}% completado</span>
                                                </div>

                                                {/* Expand button */}
                                                <button
                                                    onClick={() => toggleExpand(activity.gameId)}
                                                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors flex-shrink-0 ${isExpanded
                                                        ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                        }`}
                                                    title="Ver resultados de estudiantes"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {isExpanded ? 'expand_less' : 'groups'}
                                                    </span>
                                                    <span className="hidden md:inline">
                                                        {isExpanded ? 'Ocultar' : 'Ver Resultados'}
                                                    </span>
                                                </button>
                                            </div>

                                            {/* Mobile progress (visible on small screens) */}
                                            <div className="flex sm:hidden flex-col gap-1 mt-3 pt-3 border-t border-gray-50">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Progreso:</span>
                                                    <span className="font-bold text-gray-800">{activity.completedCount}/{activity.totalCount} ({progressPercent}%)</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${progressPercent}%`,
                                                            background: progressPercent === 100 ? '#22c55e' : gameType.color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded section — student results */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="material-symbols-outlined text-gray-400">groups</span>
                                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Resultados por Estudiante
                                                    </h4>
                                                    <span className="ml-auto text-xs text-gray-400">
                                                        {students.length} estudiantes
                                                    </span>
                                                </div>

                                                {students.length === 0 ? (
                                                    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                                                        <p className="text-gray-400 text-sm">No se encontraron estudiantes en tu grupo.</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        {students.map((student) => (
                                                            <StudentResponseRow
                                                                key={student.username || student.id}
                                                                student={student}
                                                                activityId={activity.gameId}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignments;
