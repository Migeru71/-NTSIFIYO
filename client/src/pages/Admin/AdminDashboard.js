import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AdminSidebar from '../../components/Dashboard/AdminSidebar';
import apiConfig from '../../services/apiConfig';

const AdminDashboard = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Teacher creation modal state
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [teacherForm, setTeacherForm] = useState({ firstname: '', lastname: '' });
    const [createdTeacherCredentials, setCreatedTeacherCredentials] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Teacher list state
    const [teachersList, setTeachersList] = useState([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [teacherFetchError, setTeacherFetchError] = useState('');
    const [hasFetchedTeachers, setHasFetchedTeachers] = useState(false);

    // Student modal & list state
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [studentForm, setStudentForm] = useState({ firstname: '', lastname: '', grade: '' });
    const [createdStudentCredentials, setCreatedStudentCredentials] = useState(null);
    const [isCreatingStudent, setIsCreatingStudent] = useState(false);
    const [createStudentError, setCreateStudentError] = useState('');

    const [studentsList, setStudentsList] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [studentFetchError, setStudentFetchError] = useState('');
    const [hasFetchedStudents, setHasFetchedStudents] = useState(false);

    // Multi-select & Delete state
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedUsernames, setSelectedUsernames] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setIsMultiSelectMode(false);
        setSelectedUsernames([]);

        if (currentPath === '/admin/maestros' && !hasFetchedTeachers) {
            fetchTeachers();
        } else if (currentPath === '/admin/estudiantes' && !hasFetchedStudents) {
            fetchStudents();
        }
    }, [currentPath, hasFetchedTeachers, hasFetchedStudents]);

    const fetchTeachers = async () => {
        setIsLoadingTeachers(true);
        setTeacherFetchError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/teacher`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener la lista de maestros en el servidor.');
            }
            const data = await response.json();
            setTeachersList(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeacherFetchError(error.message || 'Error de conexión.');
        } finally {
            setIsLoadingTeachers(false);
            setHasFetchedTeachers(true);
        }
    };

    const fetchStudents = async () => {
        setIsLoadingStudents(true);
        setStudentFetchError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/students`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener la lista de estudiantes.');
            }
            const data = await response.json();
            setStudentsList(data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudentFetchError(error.message || 'Error de conexión al cargar estudiantes.');
        } finally {
            setIsLoadingStudents(false);
            setHasFetchedStudents(true);
        }
    };

    const handleTeacherFormChange = (e) => {
        setTeacherForm({ ...teacherForm, [e.target.name]: e.target.value });
    };

    const handleStudentFormChange = (e) => {
        setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        setCreateError('');
        setCreatedTeacherCredentials(null);

        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/users`, {
                method: 'POST',
                headers: {
                    ...apiConfig.getHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...teacherForm,
                    userType: 'TEACHER'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear el maestro');
            }

            const data = await response.json();
            setCreatedTeacherCredentials(data);
            setTeacherForm({ firstname: '', lastname: '' });
            fetchTeachers();
        } catch (error) {
            console.error('Error creating teacher:', error);
            setCreateError(error.message || 'Ocurrió un error al crear el maestro.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();

        // Validate grade
        const gradeNum = parseInt(studentForm.grade);
        if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 6) {
            setCreateStudentError('El grado debe ser un número entre 1 y 6.');
            return;
        }

        setIsCreatingStudent(true);
        setCreateStudentError('');
        setCreatedStudentCredentials(null);

        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/users`, {
                method: 'POST',
                headers: {
                    ...apiConfig.getHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: studentForm.firstname,
                    lastname: studentForm.lastname,
                    userType: 'STUDENT',
                    grade: gradeNum
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear el estudiante');
            }

            const data = await response.json();
            setCreatedStudentCredentials(data);
            setStudentForm({ firstname: '', lastname: '', grade: '' });
            fetchStudents();
        } catch (error) {
            console.error('Error creating student:', error);
            setCreateStudentError(error.message || 'Ocurrió un error al crear el estudiante.');
        } finally {
            setIsCreatingStudent(false);
        }
    };

    const closeTeacherModal = () => {
        setIsTeacherModalOpen(false);
        setCreatedTeacherCredentials(null);
        setTeacherForm({ firstname: '', lastname: '' });
        setCreateError('');
    };

    const closeStudentModal = () => {
        setIsStudentModalOpen(false);
        setCreatedStudentCredentials(null);
        setStudentForm({ firstname: '', lastname: '', grade: '' });
        setCreateStudentError('');
    };

    // --- Delete Methods ---
    const toggleMultiSelect = () => {
        setIsMultiSelectMode(!isMultiSelectMode);
        setSelectedUsernames([]);
    };

    const handleSelectUser = (username) => {
        if (selectedUsernames.includes(username)) {
            setSelectedUsernames(selectedUsernames.filter(u => u !== username));
        } else {
            setSelectedUsernames([...selectedUsernames, username]);
        }
    };

    const handleSelectAll = (users) => {
        if (selectedUsernames.length === users.length) {
            setSelectedUsernames([]);
        } else {
            setSelectedUsernames(users.map(u => u.username));
        }
    };

    const deleteUser = async (username) => {
        if (!window.confirm(`¿Estás seguro de eliminar permanentemente a ${username}?`)) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/users/${username}`, {
                method: 'DELETE',
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) throw new Error('Error al eliminar el usuario');

            if (currentPath === '/admin/maestros') fetchTeachers();
            if (currentPath === '/admin/estudiantes') fetchStudents();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteSelectedUsers = async () => {
        if (selectedUsernames.length === 0) return;
        if (!window.confirm(`¿Estás seguro de eliminar a los ${selectedUsernames.length} usuarios seleccionados? Esta acción es irreversible.`)) return;

        setIsDeleting(true);
        try {
            await Promise.all(
                selectedUsernames.map(username =>
                    fetch(`${apiConfig.baseUrl}/api/admin/users/${username}`, {
                        method: 'DELETE',
                        headers: apiConfig.getHeaders()
                    }).then(res => {
                        if (!res.ok) throw new Error(`Error eliminando ${username}`);
                    })
                )
            );
            setSelectedUsernames([]);
            setIsMultiSelectMode(false);

            if (currentPath === '/admin/maestros') fetchTeachers();
            if (currentPath === '/admin/estudiantes') fetchStudents();
        } catch (error) {
            alert('Error durante la eliminación múltiple: ' + error.message);
            // Re-fetch since partial deletion might have occurred
            if (currentPath === '/admin/maestros') fetchTeachers();
            if (currentPath === '/admin/estudiantes') fetchStudents();
        } finally {
            setIsDeleting(false);
        }
    };

    const renderTeacherModalContent = () => {
        return (
            <div className="p-6 overflow-y-auto w-full max-w-md">
                {createdTeacherCredentials ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            El maestro se ha creado exitosamente. Por favor, guarda estas credenciales ya que no se volverán a mostrar.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-200">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase font-semibold">Usuario</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdTeacherCredentials.username}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Contraseña</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdTeacherCredentials.password}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeTeacherModal}
                            className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleCreateTeacher} className="space-y-4">
                        {createError && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                                {createError}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input
                                type="text"
                                name="firstname"
                                required
                                value={teacherForm.firstname}
                                onChange={handleTeacherFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Juan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="lastname"
                                required
                                value={teacherForm.lastname}
                                onChange={handleTeacherFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Pérez"
                            />
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={closeTeacherModal}
                                className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin align-middle" style={{ fontSize: '20px' }}>progress_activity</span>
                                        Creando...
                                    </>
                                ) : 'Crear Maestro'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    };

    const renderStudentModalContent = () => {
        return (
            <div className="p-6 overflow-y-auto w-full max-w-md">
                {createdStudentCredentials ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            El estudiante se ha creado exitosamente. Por favor, guarda estas credenciales.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-200">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase font-semibold">Usuario</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdStudentCredentials.username}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Contraseña</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdStudentCredentials.password}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeStudentModal}
                            className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleCreateStudent} className="space-y-4">
                        {createStudentError && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                                {createStudentError}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input
                                type="text"
                                name="firstname"
                                required
                                value={studentForm.firstname}
                                onChange={handleStudentFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Maria"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="lastname"
                                required
                                value={studentForm.lastname}
                                onChange={handleStudentFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Gómez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                            <select
                                name="grade"
                                required
                                value={studentForm.grade}
                                onChange={handleStudentFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                            >
                                <option value="" disabled>Selecciona un grado</option>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}º Grado</option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={closeStudentModal}
                                className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isCreatingStudent}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isCreatingStudent ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin align-middle" style={{ fontSize: '20px' }}>progress_activity</span>
                                        Creando...
                                    </>
                                ) : 'Crear Estudiante'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (currentPath === '/admin/maestros') {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Maestros</h2>
                            <p className="text-gray-500 mt-1">Gestiona los maestros del sistema.</p>
                        </div>
                        <button
                            onClick={() => setIsTeacherModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Crear Maestro
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gray-800">Lista de Maestros</h3>
                                    <button
                                        onClick={fetchTeachers}
                                        disabled={isLoadingTeachers}
                                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-primary transition-colors disabled:opacity-50"
                                        title="Recargar datos"
                                    >
                                        <span className={`material-symbols-outlined text-xl ${isLoadingTeachers ? 'animate-spin' : ''}`}>sync</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {isMultiSelectMode && selectedUsernames.length > 0 && (
                                        <button
                                            onClick={deleteSelectedUsers}
                                            disabled={isDeleting}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            Eliminar Seleccionados ({selectedUsernames.length})
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleMultiSelect}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${isMultiSelectMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                            {isMultiSelectMode ? 'close' : 'checklist'}
                                        </span>
                                        {isMultiSelectMode ? 'Cancelar Acción' : 'Seleccionar Varios'}
                                    </button>
                                </div>
                            </div>

                            {isLoadingTeachers ? (
                                <div className="text-center py-8 text-gray-500">Cargando maestros...</div>
                            ) : teacherFetchError ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                    <span className="material-symbols-outlined block text-4xl mb-2">error</span>
                                    {teacherFetchError}
                                </div>
                            ) : teachersList.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay maestros registrados.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                                {isMultiSelectMode && (
                                                    <th className="py-3 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={teachersList.length > 0 && selectedUsernames.length === teachersList.length}
                                                            onChange={() => handleSelectAll(teachersList)}
                                                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                        />
                                                    </th>
                                                )}
                                                <th className="py-3 px-4 font-medium">Nombre</th>
                                                <th className="py-3 px-4 font-medium">Username</th>
                                                <th className="py-3 px-4 font-medium">Alumnos</th>
                                                <th className="py-3 px-4 font-medium">Grado Asignado</th>
                                                <th className="py-3 px-4 font-medium text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teachersList.map((t, idx) => (
                                                <tr key={idx} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedUsernames.includes(t.username) ? 'bg-primary/5' : ''}`}>
                                                    {isMultiSelectMode && (
                                                        <td className="py-3 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsernames.includes(t.username)}
                                                                onChange={() => handleSelectUser(t.username)}
                                                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                                        {t.firstname} {t.lastname}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{t.username}</td>
                                                    <td className="py-3 px-4 text-gray-600">{t.students_amount || 0}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                            {t.group_grade || 'No asignado'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        {/* Ir al grupo button could go here */}
                                                        <button
                                                            onClick={() => deleteUser(t.username)}
                                                            disabled={isDeleting}
                                                            className="text-red-500 hover:text-red-700 font-medium p-2 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Eliminar maestro"
                                                        >
                                                            <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {isTeacherModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {createdTeacherCredentials ? 'Maestro Creado' : 'Crear Nuevo Maestro'}
                                    </h3>
                                    <button
                                        onClick={closeTeacherModal}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                {renderTeacherModalContent()}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (currentPath === '/admin/estudiantes') {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Estudiantes</h2>
                            <p className="text-gray-500 mt-1">Gestiona los estudiantes del sistema.</p>
                        </div>
                        <button
                            onClick={() => setIsStudentModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Crear Estudiante
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gray-800">Lista de Estudiantes</h3>
                                    <button
                                        onClick={fetchStudents}
                                        disabled={isLoadingStudents}
                                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-primary transition-colors disabled:opacity-50"
                                        title="Recargar datos"
                                    >
                                        <span className={`material-symbols-outlined text-xl ${isLoadingStudents ? 'animate-spin' : ''}`}>sync</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {isMultiSelectMode && selectedUsernames.length > 0 && (
                                        <button
                                            onClick={deleteSelectedUsers}
                                            disabled={isDeleting}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            Eliminar Seleccionados ({selectedUsernames.length})
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleMultiSelect}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${isMultiSelectMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                            {isMultiSelectMode ? 'close' : 'checklist'}
                                        </span>
                                        {isMultiSelectMode ? 'Cancelar Acción' : 'Seleccionar Varios'}
                                    </button>
                                </div>
                            </div>

                            {isLoadingStudents ? (
                                <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>
                            ) : studentFetchError ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                    <span className="material-symbols-outlined block text-4xl mb-2">error</span>
                                    {studentFetchError}
                                </div>
                            ) : studentsList.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay estudiantes registrados.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                                {isMultiSelectMode && (
                                                    <th className="py-3 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={studentsList.length > 0 && selectedUsernames.length === studentsList.length}
                                                            onChange={() => handleSelectAll(studentsList)}
                                                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                        />
                                                    </th>
                                                )}
                                                <th className="py-3 px-4 font-medium">Username</th>
                                                <th className="py-3 px-4 font-medium">Nombre Completo</th>
                                                <th className="py-3 px-4 font-medium">Nº de Lista</th>
                                                <th className="py-3 px-4 font-medium">Contraseña</th>
                                                <th className="py-3 px-4 font-medium text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentsList.map((s, idx) => (
                                                <tr key={idx} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedUsernames.includes(s.username) ? 'bg-primary/5' : ''}`}>
                                                    {isMultiSelectMode && (
                                                        <td className="py-3 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsernames.includes(s.username)}
                                                                onChange={() => handleSelectUser(s.username)}
                                                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="py-3 px-4 text-gray-600">{s.username}</td>
                                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                                        {s.firstname} {s.lastname}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 text-center">
                                                        <span className="inline-block w-8 h-8 leading-8 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                                                            {s.listNumber ?? '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                                                        {s.password || '******'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() => deleteUser(s.username)}
                                                            disabled={isDeleting}
                                                            className="text-red-500 hover:text-red-700 font-medium p-2 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Eliminar estudiante"
                                                        >
                                                            <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {isStudentModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {createdStudentCredentials ? 'Estudiante Creado' : 'Crear Nuevo Estudiante'}
                                    </h3>
                                    <button
                                        onClick={closeStudentModal}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                {renderStudentModalContent()}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Default Admin Dashboard Content
        return (
            <div className="text-center py-20">
                <span className="material-symbols-outlined text-7xl text-gray-300 mb-4 block">construction</span>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sección en Construcción</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Actualmente este panel se encuentra en construcción.
                    Pronto se añadirán herramientas para gestionar {currentPath.split('/').pop()}.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                    <Link to="/admin/dashboard" className="hover:text-primary transition-colors">Admin Panel</Link>
                    <span>›</span>
                    <span className="text-gray-800 font-medium capitalize">
                        {currentPath.split('/').filter(Boolean).pop() || 'Dashboard'}
                    </span>
                    <div className="ml-auto">
                        <Link to="/" className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Cerrar Sesión / Salir
                        </Link>
                    </div>
                </nav>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;

