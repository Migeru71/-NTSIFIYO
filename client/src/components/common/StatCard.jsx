import React from 'react';

/**
 * StatCard — Tarjeta de estadística unificada para Student, Visitor y Teacher dashboards.
 *
 * Props:
 *   label        {string}   — Etiqueta descriptiva (ej. "Nivel Actual")
 *   value        {string|number} — Valor principal a mostrar
 *   subText      {string}   — Texto secundario debajo del valor
 *   icon         {string}   — Nombre del Material Symbol (ej. "verified")
 *   iconBg       {string}   — Clase Tailwind para el fondo del ícono (ej. "bg-green-50")
 *   iconColor    {string}   — Clase Tailwind para el color del ícono (ej. "text-green-500")
 *   accentColor  {string}   — Clase Tailwind para el color de acento del subText
 *   gradient     {string}   — Clases Tailwind del gradiente para la barra superior (ej. "from-emerald-500 to-teal-600")
 *                             Si se omite, no se muestra la barra de gradiente.
 *   animDelay    {number}   — Delay de animación en ms para el stagger del grid (default: 0)
 */
const StatCard = ({
    label,
    value,
    subText,
    icon,
    iconBg = 'bg-gray-100',
    iconColor = 'text-gray-500',
    accentColor = 'text-gray-500',
    gradient,
    animDelay = 0,
}) => {
    return (
        <div
            className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
            style={animDelay ? { animationDelay: `${animDelay}ms` } : undefined}
        >
            {/* Barra decorativa de gradiente superior (opcional) */}
            {gradient && (
                <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity`}
                />
            )}

            <div className="flex items-start justify-between">
                {/* Texto */}
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                    {subText && (
                        <p className="text-xs mt-2">
                            <span className={`font-semibold ${accentColor}`}>{subText}</span>
                        </p>
                    )}
                </div>

                {/* Ícono */}
                <div
                    className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}
                >
                    <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
