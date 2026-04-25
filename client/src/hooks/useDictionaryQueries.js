// client/src/hooks/useDictionaryQueries.js
// Hooks de TanStack Query para el diccionario Mazahua-Español

import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiConfig from '../services/apiConfig';
import DictionaryService from '../services/DictionaryService';

// ── Query Keys ────────────────────────────────────────────────────────────────
export const dictionaryKeys = {
    categories: () => ['dictionary', 'categories'],
    words: (topicId, page) => ['dictionary', 'words', topicId, page],
};

// ── Fetchers ──────────────────────────────────────────────────────────────────

async function fetchCategories() {
    const result = await DictionaryService.getCategories();
    if (!result.success) throw new Error(result.error || 'Error al cargar categorías.');
    return result.data;
}

async function fetchWords(topicId, page = 0) {
    const response = await fetch(
        `${apiConfig.baseUrl}/api/dictionary/words/${topicId}?page=${page}`,
        { headers: apiConfig.getHeaders() }
    );
    if (!response.ok) {
        if (response.status === 400 || response.status === 404)
            throw new Error('Tema o página inválida/no encontrada.');
        throw new Error('Error al cargar las palabras.');
    }
    const data = await response.json();
    return {
        words: data.content || data.words || [],
        currentPage: data.number ?? page,
        totalPages: data.totalPages ?? (
            (data.content || data.words || []).length < 20 ? page + 1 : page + 2
        ),
    };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Categorías del diccionario — se cargan una sola vez al abrir el panel.
 */
export function useDictionaryCategoriesQuery() {
    return useQuery({
        queryKey: dictionaryKeys.categories(),
        queryFn: fetchCategories,
    });
}

/**
 * Palabras de un tema y página específicos.
 * Solo se ejecuta si topicId está definido (enabled: !!topicId).
 * La página 0 de cada tema queda en caché con staleTime: Infinity heredado del QueryClient.
 * Las imageUrl/audioUrl devueltas son URLs; el navegador las cachea via HTTP cache.
 */
export function useDictionaryWordsQuery(topicId, page = 0) {
    return useQuery({
        queryKey: dictionaryKeys.words(topicId, page),
        queryFn: () => fetchWords(topicId, page),
        enabled: !!topicId,
        keepPreviousData: true,
    });
}

/**
 * Hook para invalidar el caché de palabras de un tema (tras crear/eliminar una palabra).
 */
export function useDictionaryInvalidate() {
    const queryClient = useQueryClient();
    return {
        reloadWords: (topicId) =>
            queryClient.invalidateQueries({ queryKey: ['dictionary', 'words', topicId] }),
        reloadCategories: () =>
            queryClient.invalidateQueries({ queryKey: dictionaryKeys.categories() }),
    };
}
