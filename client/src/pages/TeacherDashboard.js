import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../components/Dashboard/SideBar';
import Roles from '../utils/roles';
import Breadcrumb from '../components/common/Breadcrumb';

/**
 * Dashboard principal del maestro
 * Muestra grupos de clase, estadísticas y herramientas de gestión
 * Textos en español con traducciones en mazahua
 */
const TeacherDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Datos del maestro (mock)
    const user = {
        id: 'teacher_001',
        name: 'Maria Gonzalez',
        email: 'maria.g@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'
    };

    // Estadísticas del maestro
    const stats = {
        totalStudents: 156,
        studentsChange: '+12%',
        activeGroups: 8,
        avgFluency: 'B1',
        fluencyChange: '+5%'
    };

    // Grupos de clase (mock data)
    const classGroups = [
        {
            id: 'group_1',
            name: 'Grupo Águila',
            subtitle: '(Mañana)',
            mazahua: "Ts'ijña",
            level: 'Principiante A1',
            levelColor: 'bg-green-500',
            progress: 68,
            students: 22,
            studentAvatars: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student1',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student2'
            ],
            nextClass: 'Lun, 9:00 AM'
        },
        {
            id: 'group_2',
            name: 'Grupo Venado',
            subtitle: '(Tarde)',
            mazahua: "Mboku",
            level: 'Intermedio A2',
            levelColor: 'bg-amber-500',
            progress: 45,
            students: 18,
            studentAvatars: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student3',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student4'
            ],
            nextClass: 'Mar, 2:00 PM'
        },
        {
            id: 'group_3',
            name: 'Conversación Avanzada',
            subtitle: '',
            mazahua: "Jñatjo nu'u",
            level: 'Avanzado B1',
            levelColor: 'bg-green-600',
            progress: 82,
            students: 10,
            studentAvatars: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student5',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student6'
            ],
            nextClass: 'Mié, 5:00 PM'
        },
        {
            id: 'group_4',
            name: 'Principiantes Fin de Semana',
            subtitle: '',
            mazahua: "Jñaa ts'ike",
            level: 'Principiante A1',
            levelColor: 'bg-blue-500',
            progress: 12,
            students: 35,
            studentAvatars: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Student7'
            ],
            nextClass: 'Sáb, 10:00 AM'
        }
    ];

    // Filtrar grupos por búsqueda
    const filteredGroups = classGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.level.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Componente de tarjeta de estadísticas
    const StatCard = ({ icon, label, value, change, changeColor }) => (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-600 text-2xl">{icon}</span>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-800">{value}</span>
                    {change && (
                        <span className={`text-sm font-medium ${changeColor || 'text-green-500'}`}>
                            {change}
                        </span>
                    )}
                </div>
            </div>
            {icon === 'trending_up' && (
                <span className="material-symbols-outlined text-green-500">trending_up</span>
            )}
        </div>
    );

    // Componente de tarjeta de grupo
    const GroupCard = ({ group }) => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {/* Barra de color superior */}
            <div className={`h-2 ${group.levelColor}`}></div>

            <div className="p-5">
                {/* Header con nombre y menú */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                            {group.name}
                            {group.subtitle && (
                                <span className="text-gray-500 font-normal ml-1">{group.subtitle}</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-500">Nivel: {group.level}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-gray-400">more_horiz</span>
                    </button>
                </div>

                {/* Progreso del curso */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">Progreso del Curso</span>
                        <span className="font-semibold text-green-600">{group.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${group.progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Estudiantes y próxima clase */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex -space-x-2">
                            {group.studentAvatars.slice(0, 2).map((avatar, idx) => (
                                <img
                                    key={idx}
                                    src={avatar}
                                    alt="Estudiante"
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            +{group.students}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Próxima Clase:</p>
                        <p className="text-sm font-medium text-gray-700">{group.nextClass}</p>
                    </div>
                </div>

                {/* Botón de gestionar */}
                <Link
                    to={`/maestro/grupo/${group.id}`}
                    className="block w-full mt-4 py-2.5 text-center text-green-600 font-semibold hover:bg-green-50 rounded-xl transition-colors"
                >
                    Gestionar Grupo
                </Link>
            </div>
        </div>
    );

    // Componente de tarjeta para crear nuevo grupo
    const CreateGroupCard = () => (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-400 text-3xl">add</span>
            </div>
            <h3 className="font-semibold text-green-600 text-lg mb-1">Crear Nuevo Grupo</h3>
            <p className="text-sm text-gray-500 text-center">Agregar una nueva clase a tu horario</p>
        </div>
    );

    return (
        <div className="w-full bg-gray-50">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    {/* Breadcrumbs */}
                    <Breadcrumb />

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Mis Grupos de Clase</h1>
                            <p className="text-gray-500 mt-1">Gestiona tus clases activas del idioma Mazahua.</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                            <span className="material-symbols-outlined">add</span>
                            Crear Nuevo Grupo
                        </button>
                    </header>

                    {/* Stats Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <StatCard
                            icon="groups"
                            label="Total de Estudiantes"
                            value={stats.totalStudents}
                            change={stats.studentsChange}
                        />
                        <StatCard
                            icon="calendar_month"
                            label="Grupos Activos"
                            value={stats.activeGroups}
                            change="Este Periodo"
                            changeColor="text-gray-500"
                        />
                        <StatCard
                            icon="trending_up"
                            label="Fluidez Promedio"
                            value={stats.avgFluency}
                            change={stats.fluencyChange}
                        />
                    </section>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar grupos por nombre o nivel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Groups Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                        <CreateGroupCard />
                    </section>

                    {/* Empty State */}
                    {filteredGroups.length === 0 && searchQuery && (
                        <div className="text-center py-16">
                            <span className="text-6xl mb-4 block">🔍</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron grupos</h3>
                            <p className="text-gray-500">Intenta con una búsqueda diferente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
