import Roles from '../utils/roles';

/**
 * activityConfig.js
 * Centralized configuration for all games and activities across the platform.
 * Unifies the old activityTypes.js and gameConfig.js
 */

export const ActivityTypes = Object.freeze({
    QUESTIONNAIRE: "QUESTIONNAIRE",
    FAST_MEMORY: "FAST_MEMORY",
    INTRUDER: "INTRUDER",
    FIND_THE_WORD: "FIND_THE_WORD",
    MEDIA_SONG: "MEDIA_SONG",
    MEDIA_ANECDOTE: "MEDIA_ANECDOTE",
    MEDIA_LEGEND: "MEDIA_LEGEND",
    PUZZLE: "PUZZLE",
    MEMORY_GAME: "MEMORY_GAME",
    LOTTERY: "LOTTERY",
    MAZE: "MAZE",
});

export const ACTIVITY_CONFIG = {
    [ActivityTypes.FAST_MEMORY]: {
        id: 'memoria_rapida',
        value: ActivityTypes.FAST_MEMORY,
        type: ActivityTypes.FAST_MEMORY,
        title: 'Memoria Rápida',
        label: '⚡ Memoria Rápida',
        subtitle: 'Tarjetas de Memoria',
        description: 'Aprende vocabulario y pronunciación mazahua emparejando tarjetas interactivas. Ejercita tu memoria mientras descubres nuevas palabras.',
        icon: '🎴',
        materialIcon: 'style',
        basePath: '/games/memoria_rapida',
        color: '#E65100',
        stats: [
            { icon: 'style', label: 'Tarjetas' },
            { icon: 'timer', label: 'Memoria' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.QUESTIONNAIRE]: {
        id: 'quiz',
        value: ActivityTypes.QUESTIONNAIRE,
        type: ActivityTypes.QUESTIONNAIRE,
        title: 'Quiz',
        label: '❓ Quiz',
        subtitle: 'Preguntas y Respuestas',
        description: 'Pon a prueba tus conocimientos del idioma mazahua con preguntas desafiantes. Evalúa gramática, vocabulario y comprensión.',
        icon: '❓',
        materialIcon: 'quiz',
        basePath: '/games/quiz',
        color: '#7c3aed',
        stats: [
            { icon: 'quiz', label: 'Preguntas' },
            { icon: 'psychology', label: 'Conocimiento' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.INTRUDER]: {
        id: 'intruso',
        value: ActivityTypes.INTRUDER,
        type: ActivityTypes.INTRUDER,
        title: 'El Intruso',
        label: '🕵️ Intruso',
        subtitle: 'Encuentra al Intruso',
        description: 'Identifica qué palabra no pertenece al grupo. Mejora tu vocabulario y capacidad de categorización.',
        icon: '🕵️',
        materialIcon: 'psychology',
        basePath: '/games/intruso',
        color: '#d97706',
        stats: [
            { icon: 'search', label: 'Atención' },
            { icon: 'category', label: 'Lógica' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.PUZZLE]: {
        id: 'rompecabezas',
        value: ActivityTypes.PUZZLE,
        type: ActivityTypes.PUZZLE,
        title: 'Rompecabezas',
        label: '🧩 Rompecabezas',
        subtitle: 'Completa la Frase',
        description: 'Selecciona la pieza correcta para completar la frase. Aprende vocabulario mazahua a través de frases contextuales en ejercicios prácticos.',
        icon: '🧩',
        materialIcon: 'extension',
        basePath: '/games/rompecabezas',
        color: '#2563eb',
        stats: [
            { icon: 'extension', label: 'Frases' },
            { icon: 'lightbulb', label: 'Contexto' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.MEMORY_GAME]: {
        id: 'memorama',
        value: ActivityTypes.MEMORY_GAME,
        type: ActivityTypes.MEMORY_GAME,
        title: 'Memorama',
        label: '🎴 Memory Game',
        subtitle: 'Emparejar Pares',
        description: 'Voltea las cartas y encuentra todas las parejas. Aprende vocabulario mazahua emparejando palabras con su significado en español o imágenes.',
        icon: '🎴',
        materialIcon: 'style',
        basePath: '/games/memorama',
        color: '#E65100',
        stats: [
            { icon: 'style', label: 'Pares' },
            { icon: 'psychology', label: 'Memoria' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.LOTTERY]: {
        id: 'loteria',
        value: ActivityTypes.LOTTERY,
        type: ActivityTypes.LOTTERY,
        title: 'Lotería',
        label: '🎰 Lotería',
        subtitle: 'Selecciona las cartas',
        description: 'Selecciona las cartas de tu tablero que coincidan con las que van apareciendo en la pila. ¡Rápido y sin penalizaciones para ganar más puntos!',
        icon: '🎰',
        materialIcon: 'casino',
        basePath: '/games/loteria',
        color: '#b45309',
        stats: [
            { icon: 'casino', label: 'Cartas' },
            { icon: 'timer', label: 'Velocidad' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.MAZE]: {
        id: 'laberinto',
        value: ActivityTypes.MAZE,
        type: ActivityTypes.MAZE,
        title: 'Laberinto',
        label: '🕹️ Laberinto',
        subtitle: 'Traza el camino',
        description: 'Encuentra tu camino en el laberinto y une los conceptos sin equivocarte.',
        icon: '🕹️',
        materialIcon: 'route',
        basePath: '/games/laberinto',
        color: '#10b981',
        stats: [
            { icon: 'route', label: 'Rutas' },
            { icon: 'timer', label: 'Velocidad' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.FIND_THE_WORD]: {
        id: 'encuentra_palabra',
        value: ActivityTypes.FIND_THE_WORD,
        type: ActivityTypes.FIND_THE_WORD,
        title: 'Encuentra Palabra',
        label: '🔍 Encuentra Palabra',
        subtitle: 'Localiza la palabra correcta',
        description: 'Localiza la palabra correcta basándote en su definición o pista.',
        icon: '🔍',
        materialIcon: 'search',
        basePath: '/games/encuentra_palabra',
        color: '#0284c7',
        stats: [
            { icon: 'search', label: 'Atención' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.MEDIA_SONG]: {
        id: 'cancion',
        value: ActivityTypes.MEDIA_SONG,
        type: ActivityTypes.MEDIA_SONG,
        title: 'Canción',
        label: '🎵 Canción',
        subtitle: 'Actividad con canción',
        description: 'Disfruta y aprende con esta actividad musical en mazahua.',
        icon: '🎵',
        materialIcon: 'music_note',
        basePath: '/games/cancion',
        color: '#db2777',
        stats: [
            { icon: 'music_note', label: 'Ritmo' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.MEDIA_ANECDOTE]: {
        id: 'anecdota',
        value: ActivityTypes.MEDIA_ANECDOTE,
        type: ActivityTypes.MEDIA_ANECDOTE,
        title: 'Anécdota',
        label: '📖 Anécdota',
        subtitle: 'Actividad con anécdota',
        description: 'Aprende del contexto y la historia mediante anécdotas.',
        icon: '📖',
        materialIcon: 'menu_book',
        basePath: '/games/anecdota',
        color: '#059669',
        stats: [
            { icon: 'menu_book', label: 'Lectura' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    },
    [ActivityTypes.MEDIA_LEGEND]: {
        id: 'leyenda',
        value: ActivityTypes.MEDIA_LEGEND,
        type: ActivityTypes.MEDIA_LEGEND,
        title: 'Leyenda',
        label: '🗺️ Leyenda',
        subtitle: 'Actividad con leyenda',
        description: 'Descubre historias tradicionales y expande tu conocimiento cultural.',
        icon: '🗺️',
        materialIcon: 'map',
        basePath: '/games/leyenda',
        color: '#7c3aed',
        stats: [
            { icon: 'map', label: 'Historia' },
            { icon: 'emoji_events', label: 'XP' }
        ]
    }
};

/** Categorías de Tipos de Juegos */
export const QUESTIONNAIRE_TYPES = [
    ActivityTypes.QUESTIONNAIRE,
    ActivityTypes.FAST_MEMORY,
    ActivityTypes.INTRUDER,
    ActivityTypes.FIND_THE_WORD,
    ActivityTypes.MEDIA_SONG,
    ActivityTypes.MEDIA_ANECDOTE,
    ActivityTypes.MEDIA_LEGEND,
    ActivityTypes.PUZZLE,
];

export const PAIR_TYPES = [
    ActivityTypes.MEMORY_GAME,
    ActivityTypes.LOTTERY,
    ActivityTypes.MAZE
];

/** Helpers */
export const getGameBasePath = (type) => ACTIVITY_CONFIG[type]?.basePath || '/dashboard';
export const getGameIcon = (type) => ACTIVITY_CONFIG[type]?.icon || '🎮';
export const getActivitiesList = () => Object.values(ACTIVITY_CONFIG);

export const getGameTypeInfo = (type) => {
    const activity = ACTIVITY_CONFIG[type];
    if (activity) {
        const [icon, ...rest] = activity.label.split(' ');
        return { label: rest.join(' '), icon, color: activity.color || '#6b7280' };
    }
    return { label: type, icon: '🎮', color: '#6b7280' };
};

/**
 * Builds the navigation routes struct for `navigation.js`
 * Only returns types that have an active setup (some might not have create/edit routes yet, but all have play)
 */
export const getNavigationRoutes = () => {
    // Solo listamos los juegos que tienen rutas completas en App.js
    const activeGames = [
        ActivityTypes.MEMORY_GAME,
        ActivityTypes.QUESTIONNAIRE,
        ActivityTypes.INTRUDER,
        ActivityTypes.LOTTERY,
        ActivityTypes.PUZZLE,
        ActivityTypes.FAST_MEMORY,
        ActivityTypes.MAZE
    ];

    return activeGames.map(type => {
        const config = ACTIVITY_CONFIG[type];
        return {
            id: config.id,
            label: config.title,
            path: config.basePath,
            icon: config.materialIcon,
            roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR],
            children: [
                { id: `${config.id}-create`, label: `Crear ${config.title}`, path: `${config.basePath}/crear`, roles: [Roles.TEACHER] },
                { id: `${config.id}-edit`, label: `Editar ${config.title}`, path: `${config.basePath}/editar/:editId`, roles: [Roles.TEACHER] },
                { id: `${config.id}-play`, label: `Jugar ${config.title}`, path: `${config.basePath}/jugar/:activityId`, roles: [Roles.STUDENT, Roles.TEACHER, Roles.VISITOR] },
            ],
        };
    });
};

export default ACTIVITY_CONFIG;
