import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';

/**
 * Vista de 'Contenido' del Maestro
 * Por ahora es un placeholder con la misma estructura y diseño de las demás vistas de maestro.
 */
const TeacherContent = () => {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    {/* Breadcrumbs */}
                    <Breadcrumb />

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Contenido del Curso</h1>
                            <p className="text-gray-500 mt-1">
                                Gestiona la estructura de los temas, lecciones y materiales teóricos.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                            <span className="material-symbols-outlined">add</span>
                            Añadir Módulo
                        </button>
                    </header>

                    {/* Placeholder Content */}
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-6xl block mb-4">🚧</span>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sección en Construcción</h3>
                        <p className="text-gray-500 mb-6">
                            Próximamente podrás estructurar aquí el contenido teórico para tus estudiantes.
                        </p>
                        <Link
                            to="/maestro/recursos"
                            className="px-6 py-3 bg-green-50 text-green-600 font-semibold rounded-xl hover:bg-green-100 transition-colors inline-block"
                        >
                            Ir a Mis Recursos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherContent;
