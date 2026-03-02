import React, { useState, useEffect } from 'react';
import DictionaryService from '../../../services/DictionaryService';
import apiConfig from '../../../services/apiConfig';

const WordsSection = () => {
    // Categories
    const [dictionaryCategories, setDictionaryCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [dictionaryCategoryError, setDictionaryCategoryError] = useState('');

    // Words in category
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryWords, setCategoryWords] = useState([]);
    const [wordsCurrentPage, setWordsCurrentPage] = useState(0);
    const [wordsTotalPages, setWordsTotalPages] = useState(1);
    const [isLoadingWords, setIsLoadingWords] = useState(false);
    const [categoryWordsError, setCategoryWordsError] = useState('');

    // Create Word Modal
    const [isCreateWordModalOpen, setIsCreateWordModalOpen] = useState(false);
    const [createWordForm, setCreateWordForm] = useState({ spanishText: '', mazahuaText: '', category: '' });
    const [createWordMedia, setCreateWordMedia] = useState({ image: null, audio: null });
    const [isCreatingWord, setIsCreatingWord] = useState(false);
    const [createWordError, setCreateWordError] = useState('');

    useEffect(() => {
        fetchDictionaryCategories();
    }, []);

    const fetchDictionaryCategories = async () => {
        setIsLoadingCategories(true);
        setDictionaryCategoryError('');
        try {
            const result = await DictionaryService.getCategories();
            if (result.success) {
                setDictionaryCategories(result.data);
            } else {
                setDictionaryCategoryError(result.error || 'Error al cargar las categorías.');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setDictionaryCategoryError(error.message);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchCategoryWords = async (category, page = 0) => {
        setIsLoadingWords(true);
        setCategoryWordsError('');
        try {
            const response = await fetch(
                `${apiConfig.baseUrl}/api/dictionary/words/${category}?page=${page}`,
                { headers: apiConfig.getHeaders() }
            );
            if (!response.ok) {
                if (response.status === 400 || response.status === 404) throw new Error('Categoría o página inválida/no encontrada.');
                throw new Error('Error al cargar las palabras.');
            }
            const data = await response.json();
            const fetchedWords = data.content || data.words || [];
            setCategoryWords(fetchedWords);
            setWordsCurrentPage(data.number ?? page);
            setWordsTotalPages(data.totalPages ?? (fetchedWords.length < 20 ? page + 1 : page + 2));
        } catch (error) {
            console.error(`Error fetching words for ${category}:`, error);
            setCategoryWordsError(error.message);
            setCategoryWords([]);
        } finally {
            setIsLoadingWords(false);
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        fetchCategoryWords(category, 0);
    };

    const handleCreateWordFormChange = (e) => {
        setCreateWordForm({ ...createWordForm, [e.target.name]: e.target.value });
    };

    const handleCreateWordMediaChange = (e) => {
        setCreateWordMedia({ ...createWordMedia, [e.target.name]: e.target.files[0] });
    };

    const submitCreateWord = async (e) => {
        e.preventDefault();
        setIsCreatingWord(true);
        setCreateWordError('');
        try {
            const formData = new FormData();
            formData.append('spanishText', createWordForm.spanishText);
            formData.append('mazahuaText', createWordForm.mazahuaText);
            formData.append('category', createWordForm.category);
            if (createWordMedia.image) formData.append('image', createWordMedia.image);
            if (createWordMedia.audio) formData.append('audio', createWordMedia.audio);

            await DictionaryService.createWord(formData);

            setIsCreateWordModalOpen(false);
            setCreateWordForm({ spanishText: '', mazahuaText: '', category: '' });
            setCreateWordMedia({ image: null, audio: null });

            if (selectedCategory) {
                if (selectedCategory === createWordForm.category) fetchCategoryWords(selectedCategory, wordsCurrentPage);
                else fetchDictionaryCategories();
            } else {
                fetchDictionaryCategories();
            }
        } catch (error) {
            console.error('Error creating word:', error);
            setCreateWordError(error.message);
        } finally {
            setIsCreatingWord(false);
        }
    };

    // ─── Create Word Modal ───
    const renderCreateWordModal = () => {
        if (!isCreateWordModalOpen) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined">add_circle</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Crear Nueva Palabra</h3>
                        </div>
                        <button onClick={() => setIsCreateWordModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-xl hover:bg-gray-100">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <form id="createWordForm" onSubmit={submitCreateWord} className="space-y-4">
                            {createWordError && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">error</span>{createWordError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Palabra en Español *</label>
                                <input type="text" name="spanishText" required value={createWordForm.spanishText} onChange={handleCreateWordFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ej. Perro" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Palabra en Mazahua *</label>
                                <input type="text" name="mazahuaText" required value={createWordForm.mazahuaText} onChange={handleCreateWordFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ej. T'sïbue" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoría *</label>
                                <input type="text" name="category" required list="categories-list" value={createWordForm.category} onChange={handleCreateWordFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ej. Animales" />
                                <datalist id="categories-list">
                                    {dictionaryCategories.map((cat, idx) => (<option key={idx} value={cat} />))}
                                </datalist>
                                <p className="text-xs text-gray-500 mt-1">Selecciona una existente o escribe una nueva.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Imagen *</label>
                                    <input type="file" name="image" required accept="image/png, image/jpeg, image/webp" onChange={handleCreateWordMediaChange}
                                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Audio *</label>
                                    <input type="file" name="audio" required accept="audio/wav, audio/mpeg" onChange={handleCreateWordMediaChange}
                                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                        <button type="button" onClick={() => setIsCreateWordModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" form="createWordForm" disabled={isCreatingWord}
                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-70">
                            {isCreatingWord ? (<><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>Guardando...</>) : (<><span className="material-symbols-outlined text-[20px]">save</span>Guardar Palabra</>)}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Category Words View ───
    if (selectedCategory) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                {renderCreateWordModal()}
                <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button onClick={() => setSelectedCategory(null)} className="hover:text-primary transition-colors font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>Categorías
                        </button>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="font-bold text-primary truncate max-w-[200px]">{selectedCategory}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setCreateWordForm({ ...createWordForm, category: selectedCategory }); setIsCreateWordModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>Nueva Palabra
                        </button>
                        <span className="w-px h-6 bg-gray-200 hidden sm:block"></span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
                                Página {wordsCurrentPage + 1} de {wordsTotalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchCategoryWords(selectedCategory, wordsCurrentPage - 1)}
                                    disabled={wordsCurrentPage === 0 || isLoadingWords}
                                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 bg-white"
                                >
                                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                </button>
                                <button
                                    onClick={() => fetchCategoryWords(selectedCategory, wordsCurrentPage + 1)}
                                    disabled={wordsCurrentPage >= wordsTotalPages - 1 || isLoadingWords}
                                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 bg-white"
                                >
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {categoryWordsError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-sm">
                        <span className="material-symbols-outlined">error</span>
                        <span className="font-medium flex-1">{categoryWordsError}</span>
                        <button onClick={() => fetchCategoryWords(selectedCategory, wordsCurrentPage)} className="text-sm border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">Reintentar</button>
                    </div>
                )}

                {isLoadingWords ? (
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
                ) : categoryWords.length === 0 && !categoryWordsError ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-300">hourglass_empty</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No hay palabras</h3>
                        <p className="text-gray-500 mt-1 max-w-sm">No se encontraron palabras en esta página para la categoría seleccionada.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryWords.map((wordObj, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col h-full">
                                <div className="aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden mb-4 relative flex items-center justify-center">
                                    {wordObj.imageUrl ? (
                                        <img src={wordObj.imageUrl} alt={wordObj.spanishWord} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center flex-col text-gray-300 gap-2">
                                            <span className="material-symbols-outlined text-4xl opacity-50">image_not_supported</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1" title={wordObj.mazahuaWord || wordObj.spanishWord}>{wordObj.mazahuaWord || wordObj.spanishWord}</h3>
                                    {wordObj.mazahuaWord && <p className="text-sm text-gray-500 font-medium mt-0.5 line-clamp-1">{wordObj.spanishWord}</p>}
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                        <div className="bg-primary/5 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Palabra</div>
                                        {wordObj.audioUrl ? (
                                            <button
                                                onClick={() => new Audio(wordObj.audioUrl).play().catch(e => console.log('Audio disabled/missing'))}
                                                className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                                title="Reproducir Audio"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">volume_up</span>
                                            </button>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center cursor-not-allowed" title="Sin Audio">
                                                <span className="material-symbols-outlined text-[18px]">volume_off</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ─── Categories Grid ───
    return (
        <div className="space-y-6 animate-fade-in-up">
            {renderCreateWordModal()}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold text-gray-800">Diccionario</h2>
                        <button
                            onClick={fetchDictionaryCategories}
                            disabled={isLoadingCategories}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-primary transition-colors disabled:opacity-50 mt-1"
                            title="Recargar categorías"
                        >
                            <span className={`material-symbols-outlined text-xl ${isLoadingCategories ? 'animate-spin' : ''}`}>sync</span>
                        </button>
                    </div>
                    <p className="text-gray-500 mt-1">Explora las palabras categorizadas en el sistema.</p>
                </div>
                <button
                    onClick={() => { setCreateWordForm({ spanishText: '', mazahuaText: '', category: '' }); setIsCreateWordModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>Crear Palabra
                </button>
            </div>

            {dictionaryCategoryError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-sm">
                    <span className="material-symbols-outlined">error</span>
                    <span className="font-medium">{dictionaryCategoryError}</span>
                </div>
            )}

            {isLoadingCategories ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((skel) => (
                        <div key={skel} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center justify-center animate-pulse min-h-[160px]">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-4"></div>
                            <div className="w-24 h-4 bg-gray-50 rounded-full"></div>
                        </div>
                    ))}
                </div>
            ) : dictionaryCategories.length === 0 && !dictionaryCategoryError ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-blue-300">category</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no hay categorías</h3>
                    <p className="text-gray-500 max-w-md">No se han encontrado categorías de palabras registradas en el diccionario actualmente.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {dictionaryCategories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelectCategory(cat)}
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
            )}
        </div>
    );
};

export default WordsSection;
