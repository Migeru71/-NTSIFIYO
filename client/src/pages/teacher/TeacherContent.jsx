import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import IconConstruction from '../../assets/svgs/construction.svg';

/**
 * Vista de 'Contenido' del Maestro
 * Por ahora es un placeholder con la misma estructura y diseño de las demás vistas de maestro.
 */
const TeacherContent = () => {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-8">
                    <SectionHeader
                        title="Contenido del Curso"
                        subtitle="Gestiona la estructura de los temas, lecciones y materiales teóricos."
                    />

                    {/* Placeholder Content */}
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <img src={IconConstruction} alt="En construcción" className="w-24 h-24 mx-auto mb-4" />
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
