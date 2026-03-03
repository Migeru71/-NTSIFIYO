import React from 'react';

const CategoryGrid = ({ categories, onSelectCategory, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((skel) => (
                    <div key={skel} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center justify-center animate-pulse min-h-[160px]">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-4"></div>
                        <div className="w-24 h-4 bg-gray-50 rounded-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined">error</span>
                <span className="font-medium">{error}</span>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl text-blue-300">category</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no hay categorías</h3>
                <p className="text-gray-500 max-w-md">No se han encontrado categorías de palabras registradas en el diccionario actualmente.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelectCategory(cat)}
                    className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group flex items-center gap-4 text-left"
                >
                    <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                        <span className="material-symbols-outlined text-2xl">label</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-lg truncate group-hover:text-primary transition-colors">{cat}</h4>
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
