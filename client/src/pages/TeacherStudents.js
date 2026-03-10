import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import List from '../components/common/List';
import { useStudents } from '../context/StudentsContext';
import Breadcrumb from '../components/common/Breadcrumb';

/**
 * Página de Estudiantes del Maestro.
 * Obtiene el listado de estudiantes del grupo asignado al maestro autenticado
 * usando el caché compartido de StudentsContext.
 */
const TeacherStudents = () => {
    const { students, isLoading, error, fetchStudents, refreshStudents } = useStudents();

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const tableHeaders = [
        { label: 'Nº Lista', align: 'center' },
        { label: 'Nombre Completo' },
        { label: 'Usuario' },
        { label: 'Contraseña' },
    ];

    const renderStudentRow = (student) => (
        <>
            <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                    {student.listNumber || '-'}
                </span>
            </td>
            <td className="py-3 px-4 text-gray-800 font-medium">
                {student.lastname}, {student.firstname}
            </td>
            <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                {student.username}
            </td>
            <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                {student.password || '******'}
            </td>
        </>
    );

    const renderStudentActions = (student) => (
        <button
            onClick={() => {
                // TODO: navegar al detalle de actividades del estudiante
                console.log('Ver actividades de:', student.username);
            }}
            title="Ver Actividades"
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
        >
            <span className="material-symbols-outlined text-[18px]">assignment</span>
            Actividades
        </button>
    );

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="w-full">
                <div className="max-w-5xl mx-auto p-8">
                    {/* Breadcrumb */}
                    <Breadcrumb />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Mis Estudiantes</h1>
                        </div>
                        <button
                            onClick={refreshStudents}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm disabled:opacity-50"
                            title="Recargar lista"
                        >
                            <span className={`material-symbols-outlined text-xl ${isLoading ? 'animate-spin' : ''}`}>
                                sync
                            </span>
                            Actualizar
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <span className="material-symbols-outlined text-gray-400">groups</span>
                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                Lista de Estudiantes
                            </h3>
                            {students.length > 0 && (
                                <span className="ml-auto px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                    {students.length} alumnos
                                </span>
                            )}
                        </div>

                        <List
                            headers={tableHeaders}
                            items={students}
                            renderRow={renderStudentRow}
                            actions={renderStudentActions}
                            isLoading={isLoading}
                            error={error}
                            emptyMessage="No hay estudiantes inscritos en tu grupo."
                            emptyIcon="group_off"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherStudents;
