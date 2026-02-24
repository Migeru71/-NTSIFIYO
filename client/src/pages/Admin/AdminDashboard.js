import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AdminSidebar from '../../components/Dashboard/AdminSidebar';
import apiConfig from '../../services/apiConfig';

const AdminDashboard = () => {
    const location = useLocation();

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

    const currentPath = location.pathname;

    useEffect(() => {
        if (currentPath === '/admin/maestros') {
            fetchTeachers();
        }
    }, [currentPath]);

    const fetchTeachers = async () => {
        setIsLoadingTeachers(true);
        setTeacherFetchError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/teacher`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                // The endpoint is not fully developed yet, tolerance for errors
                throw new Error('Error al obtener la lista de maestros en el servidor.');
            }
            const data = await response.json();
            setTeachersList(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeacherFetchError(error.message || 'Error de conexión.');
        } finally {
            setIsLoadingTeachers(false);
        }
    };

    const handleTeacherFormChange = (e) => {
        setTeacherForm({ ...teacherForm, [e.target.name]: e.target.value });
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
            setCreatedTeacherCredentials(data); // { username, password, userType }
            setTeacherForm({ firstname: '', lastname: '' });
            fetchTeachers(); // Refresh list after creation
        } catch (error) {
            console.error('Error creating teacher:', error);
            setCreateError(error.message || 'Ocurrió un error al crear el maestro.');
        } finally {
            setIsCreating(false);
        }
    };

    const closeTeacherModal = () => {
        setIsTeacherModalOpen(false);
        setCreatedTeacherCredentials(null);
        setTeacherForm({ firstname: '', lastname: '' });
        setCreateError('');
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

                    {/* Teachers List */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Maestros</h3>

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
                                                <th className="py-3 px-4 font-medium">Nombre</th>
                                                <th className="py-3 px-4 font-medium">Username</th>
                                                <th className="py-3 px-4 font-medium">Contrasena</th>
                                                <th className="py-3 px-4 font-medium">Alumnos</th>
                                                <th className="py-3 px-4 font-medium">Grado Asignado</th>
                                                <th className="py-3 px-4 font-medium text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teachersList.map((t, idx) => (
                                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                                        {t.firstname} {t.lastname}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{t.username}</td>
                                                    <td className="py-3 px-4 text-gray-600">{t.password}</td>
                                                    <td className="py-3 px-4 text-gray-600">{t.students_amount || 0}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                            {t.group_grade || 'No asignado'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
                                                            Ir al grupo
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

                    {/* Teacher Creation Modal */}
                    {isTeacherModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
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

                                <div className="p-6 overflow-y-auto">
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
