import React from 'react';
import WordCard from './WordCard';

const WordsGrid = ({ words, isLoading, error, onRetry, renderActions }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((skel) => (
                    <div key={skel} className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-4 animate-pulse">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl"></div>
                        <div className="flex-1 space-y-3 p-2">
                            <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                            <div className="h-3 bg-gray-50 rounded-full w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined">error</span>
                <span className="font-medium flex-1">{error}</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-sm border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        );
    }

    if (words.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-300">hourglass_empty</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">No hay palabras</h3>
                <p className="text-gray-500 mt-1 max-w-sm">No se encontraron palabras en esta página para la categoría seleccionada.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {words.map((wordObj, idx) => (
                <WordCard
                    key={wordObj.id || idx}
                    wordObj={wordObj}
                    renderActions={renderActions}
                />
            ))}
        </div>
    );
};

export default WordsGrid;
