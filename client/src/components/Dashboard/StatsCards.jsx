import React from 'react';

/**
 * Tarjetas de estadísticas del estudiante
 */
const StatsCards = ({ level, experience, inrow, finished }) => {
    const cards = [
        {
            id: 'level',
            label: 'Nivel Actual',
            value: level || 1,
            subText: 'Rango actual',
            subLabel: '',
            icon: 'verified',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-500',
            accentColor: 'text-green-500'
        },
        {
            id: 'streak',
            label: 'Racha de Días',
            value: `${inrow || 0} Días`,
            subText: inrow > 0 ? '¡En racha!' : 'Vuelve mañana',
            subLabel: '',
            icon: 'local_fire_department',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            accentColor: 'text-orange-500'
        },
        {
            id: 'xp',
            label: 'Total XP',
            value: (experience || 0).toLocaleString(),
            subText: 'Puntos globales',
            subLabel: '',
            icon: 'emoji_events',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-500',
            accentColor: 'text-amber-500'
        },
        {
            id: 'finished',
            label: 'Actividades Completadas',
            value: finished || 0,
            subText: 'Lecciones domindas',
            subLabel: '',
            icon: 'fact_check',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-500',
            accentColor: 'text-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
                            <p className="text-xs mt-2">
                                <span className={`font-semibold ${card.accentColor}`}>{card.subText}</span>
                                <span className="text-gray-400 ml-1">{card.subLabel}</span>
                            </p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${card.iconColor}`}>
                                {card.icon}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
