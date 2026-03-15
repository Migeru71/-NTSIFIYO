import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de progreso actual con anillo circular
 */
const CurrentProgress = ({ experience = 0, level = 1 }) => {
    
    // Una lógica rápida para calcular progreso: suponiendo que cada nivel requiere ~1000 XP
    // Idealmente el backend nos daría % o nextLevelExp
    const percentage = Math.round((experience % 1000) / 10) || 0;
    const lessonsRemaining = Math.max(1, Math.round((100 - percentage) / 10));

    const levelName = `Nivel ${level}`;
    const message = `¡Estás progresando muy bien! Obtén más XP o completa ~${lessonsRemaining} lecciones para superar el nivel actual.`;

    // Calculate circle progress
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = Math.max(0, circumference - (percentage / 100) * circumference);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Progreso Actual</h3>

            {/* Progress Ring */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <svg className="transform -rotate-90" width="150" height="150">
                        {/* Background circle */}
                        <circle
                            cx="75"
                            cy="75"
                            r={radius}
                            stroke="#f3f4f6"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="75"
                            cy="75"
                            r={radius}
                            stroke="#f59e0b"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
                        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                            Completado
                        </span>
                    </div>
                </div>
            </div>

            {/* Level Info */}
            <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">{levelName}</h4>
                <p className="text-sm text-gray-500 mb-4">{message}</p>

                <Link
                    to="/estudiante/progreso"
                    className="inline-block w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Ver Ruta Completa
                </Link>
            </div>
        </div>
    );
};

export default CurrentProgress;
