import Roles from '../utils/roles';

/**
 * gamesConfig.js
 * Centralized configuration for all games across the platform.
 * Includes metadata for UI rendering (Activities, Assignments, Maps)
 * and definitions for internal routing (navigation.js).()
 */

export const GAMES_CONFIG = {
    FAST_MEMORY: {
        id: 'memoria_rapida',
        type: 'FAST_MEMORY',
        title: 'Memoria Rápida',
        subtitle: 'Tarjetas de Memoria',
        description: 'Aprende vocabulario y pronunciación mazahua emparejando tarjetas interactivas. Ejercita tu memoria mientras descubres nuevas palabras.',
        icon: '🎴',
        materialIcon: 'style',
        basePath: '/games/memoria_rapida',
        iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
        borderColor: 'border-orange-200',
        accentColor: 'text-orange-600',
        btnColor: 'bg-orange-500 hover:bg-orange-600',
        stats: [
            { icon: 'style', label: 'Tarjetas' },
            { icon: 'timer', label: 'Memoria' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    QUESTIONNAIRE: {
        id: 'quiz',
        type: 'QUESTIONNAIRE',
        title: 'Quiz',
        subtitle: 'Preguntas y Respuestas',
        description: 'Pon a prueba tus conocimientos del idioma mazahua con preguntas desafiantes. Evalúa gramática, vocabulario y comprensión.',
        icon: '❓',
        materialIcon: 'quiz',
        basePath: '/games/quiz',
        iconBg: 'bg-gradient-to-br from-purple-100 to-indigo-100',
        borderColor: 'border-purple-200',
        accentColor: 'text-purple-600',
        btnColor: 'bg-purple-500 hover:bg-purple-600',
        stats: [
            { icon: 'quiz', label: 'Preguntas' },
            { icon: 'psychology', label: 'Conocimiento' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    INTRUDER: {
        id: 'intruso',
        type: 'INTRUDER',
        title: 'El Intruso',
        subtitle: 'Encuentra al Intruso',
        description: 'Identifica qué palabra no pertenece al grupo. Mejora tu vocabulario y capacidad de categorización.',
        icon: '🕵️',
        materialIcon: 'psychology',
        basePath: '/games/intruso',
        iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
        borderColor: 'border-green-200',
        accentColor: 'text-green-600',
        btnColor: 'bg-green-500 hover:bg-green-600',
        stats: [
            { icon: 'search', label: 'Atención' },
            { icon: 'category', label: 'Lógica' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    PUZZLE: {
        id: 'rompecabezas',
        type: 'PUZZLE',
        title: 'Rompecabezas',
        subtitle: 'Completa la Frase',
        description: 'Selecciona la pieza correcta para completar la frase. Aprende vocabulario mazahua a través de frases contextuales en ejercicios prácticos.',
        icon: '🧩',
        materialIcon: 'extension',
        basePath: '/games/rompecabezas',
        iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
        borderColor: 'border-blue-200',
        accentColor: 'text-blue-600',
        btnColor: 'bg-blue-500 hover:bg-blue-600',
        stats: [
            { icon: 'extension', label: 'Frases' },
            { icon: 'lightbulb', label: 'Contexto' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    MEMORY_GAME: {
        id: 'memorama',
        type: 'MEMORY_GAME',
        title: 'Memorama',
        subtitle: 'Emparejar Pares',
        description: 'Voltea las cartas y encuentra todas las parejas. Aprende vocabulario mazahua emparejando palabras con su significado en español o imágenes.',
        icon: '🎴',
        materialIcon: 'style',
        basePath: '/games/memorama',
        iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100',
        borderColor: 'border-rose-200',
        accentColor: 'text-rose-600',
        btnColor: 'bg-rose-500 hover:bg-rose-600',
        stats: [
            { icon: 'style', label: 'Pares' },
            { icon: 'psychology', label: 'Memoria' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    LOTTERY: {
        id: 'loteria',
        type: 'LOTTERY',
        title: 'Lotería',
        subtitle: 'Selecciona las cartas',
        description: 'Selecciona las cartas de tu tablero que coincidan con las que van apareciendo en la pila. ¡Rápido y sin penalizaciones para ganar más puntos!',
        icon: '🎰',
        materialIcon: 'casino',
        basePath: '/games/loteria',
        iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
        borderColor: 'border-amber-200',
        accentColor: 'text-amber-600',
        btnColor: 'bg-amber-500 hover:bg-amber-600',
        stats: [
            { icon: 'casino', label: 'Cartas' },
            { icon: 'timer', label: 'Velocidad' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    }
};

/** Helpers */
export const getGameBasePath = (type) => GAMES_CONFIG[type]?.basePath || '/dashboard';
export const getGameIcon = (type) => GAMES_CONFIG[type]?.icon || '🎮';
export const getActivitiesList = () => Object.values(GAMES_CONFIG);

/**
 * Builds the navigation routes struct for `navigation.js`
 * Only returns types that have an active setup (some might not have create/edit routes yet, but all have play)
 */
export const getNavigationRoutes = () => {
    return [
        {
            id: 'memorama',
            label: 'Memorama',
            path: '/games/memorama',
            icon: 'style',
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: 'memorama-create', label: 'Crear Memorama', path: '/games/memorama/crear', roles: [Roles.TEACHER] },
                { id: 'memorama-edit', label: 'Editar Memorama', path: '/games/memorama/editar/:editId', roles: [Roles.TEACHER] },
                { id: 'memorama-play', label: 'Jugar Memorama', path: '/games/memorama/jugar/:activityId', roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        },
        {
            id: 'quiz',
            label: 'Quiz',
            path: '/games/quiz',
            icon: 'quiz',
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: 'quiz-edit', label: 'Editar Quiz', path: '/games/quiz/editar/:editId', roles: [Roles.TEACHER] },
                { id: 'quiz-play', label: 'Jugar Quiz', path: '/games/quiz/jugar/:activityId', roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        },
        {
            id: 'intruso',
            label: 'Intruso',
            path: '/games/intruso',
            icon: 'psychology',
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: 'intruso-play', label: 'Jugar Intruso', path: '/games/intruso/jugar/:activityId', roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        },
        {
            id: 'loteria',
            label: 'Lotería',
            path: '/games/loteria',
            icon: 'casino',
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: 'loteria-play', label: 'Jugar Lotería', path: '/games/loteria/jugar/:activityId', roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        },
        {
            id: 'rompecabezas',
            label: 'Rompecabezas',
            path: '/games/rompecabezas',
            icon: 'extension',
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: 'rompecabezas-play', label: 'Jugar Rompecabezas', path: '/games/rompecabezas/jugar/:activityId', roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        },
        {
            id: 'memoria_rapida',
            label: 'Memoria Rápida',
            path: '/games/memoria_rapida',
            icon: 'style',
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: 'memoria_rapida-play', label: 'Jugar Memoria Rápida', path: '/games/memoria_rapida/jugar/:activityId', roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        }
    ];
};
