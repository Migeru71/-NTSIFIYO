import React from 'react';

const CategoryGrid = ({ topics, onSelectTopic }) => {
    if (!topics || topics.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl text-blue-300">category</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No hay temas disponibles</h3>
                <p className="text-gray-500 max-w-md">No se han encontrado temas registrados.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {topics.map((topic) => (
                <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.id)}
                    className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group flex items-center gap-4 text-left"
                >
                    <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                        <span className="material-symbols-outlined text-2xl">label</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-lg truncate group-hover:text-primary transition-colors">{topic.label}</h4>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                            Explorar<span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default CategoryGrid;
