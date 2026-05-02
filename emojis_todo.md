# Emojis en el Proyecto (Renderizados)

A continuación se detalla la lista de emojis que son visibles en la interfaz de la aplicación, indicando su lugar de aparición y su función específica. Se han omitido los emojis que solo aparecen en archivos que no se renderizan (como el `README.md` o documentación) y en el código CSS.

## Estados, Feedback y Mensajes
- ✅ : **Indicador de éxito** en `ActivitiesPanel` (estado "Activa" o "Asignada"), en las tarjetas de juego (`MemoriaRapidaCard`, `MemoriaRapidaGameView`) y en el resumen `GameSummary` para marcar respuestas correctas.
- ❌ : **Indicador de error/fallo** en `ActivitiesPanel` (estado "Inactiva"), en vistas de juego (`MemoriaRapidaCard`, `LoteriaGameView`, `IntrusoGameView`) para respuestas incorrectas y en `GameSummary`.
- ⚠️ : **Icono de advertencia** utilizado en mensajes de error o pantallas de alerta en `ActivitiesPanel`, `StudentAssignments` y `TeacherDashboard`.
- 😕 : **Ilustración de estado vacío/error** utilizado en pantallas de "Actividad no encontrada" para varios juegos (`LoteriaGameView`, `MemoramaGameView`, `RompecabezasGameView`).
- 📭 : **Ilustración de estado vacío** ("Aún no hay actividades") en `ActivitiesPanel` y pantallas del maestro (`TeacherAssignments`, `TeacherDashboard`).
- 🚧 : **Ilustración de "En Construcción"** para secciones no disponibles en `ActivitiesPanel` y `TeacherContent`.
- 🎉 : **Feedback positivo ("¡PERFECTO!")** en la pantalla de resumen del juego `GameSummary` y por aciertos en `LoteriaGameView`.
- 💪 : **Feedback motivacional ("necesita-mejorar")** en la pantalla de resumen del juego `GameSummary`.
- 😅 : **Feedback de penalización** en `LoteriaGameView` cuando se selecciona una carta que no ha salido.
- ⏳ : **Indicador de carga o espera** en `LoteriaGameView` y `QuizGameView`.

## Interfaz General y Botones
- 🚀 : **Llamado a la acción (CTA)** principal en botones como "Crear Primera Actividad", "Abrir Editor" o "Publicar" en `ActivitiesPanel`, `GameAccessPanel` y en el conteo regresivo de `MemoriaRapidaGameView`.
- ▶️ : **Botón de Play/Comenzar** en `MediaPlayerView`, `ActivityCard`, `GameAccessPanel` y `GameMap` para iniciar actividades o reproducir medios.
- ⏸️ : **Botón de Pausa** en `MediaPlayerView`, y pantallas de juego como `IntrusoGameView` o `MemoriaRapidaGameView`.
- 🔊 : **Botón de reproducción de audio** dentro de juegos (`GameSummary`, `IntrusoGameView`, `QuizGameView`, `RompecabezasGameView`) y como etiqueta de configuración.
- 🔄 : **Botón de Reintentar** una actividad en `GameSummary`.
- ⬅️ / ➡️ : **Botones de navegación ("Regresar")** y también utilizados como instrucciones de deslizamiento en `MemoriaRapidaGameView`.
- ✏️ : **Botón para editar** una actividad existente en `ActivityCard` y `GameAccessPanel`.
- 🗑️ : **Botón para eliminar** elementos (preguntas o tarjetas) en el editor `ConfigurationGameView`.
- 💾 : **Botón de guardar/actualizar** cambios en `ConfigurationGameView`.
- 💡 : **Icono de consejos (Tip)** utilizado para dar sugerencias en `GameAccessPanel` y en el componente de sabiduría diaria `DailyWisdom`.

## Insignias y Estadísticas
- ⭐ : **Puntos de Experiencia (XP)** en listados (`ActivitiesPanel`, `ActivityCard`, `GameAccessPanel`) y en resúmenes de juegos (`GameSummary`, `LoteriaGameView`). También indica calificación de dificultad en pantallas informativas.
- 🎯 : **Número de ítems o preguntas** de una actividad en las tarjetas (`ActivityCard`, `GameAccessPanel`, `GameMap`).
- ⏱️ : **Indicador de tiempo transcurrido o duración** visible en la barra superior de los juegos (`LaberintoGameView`, `MemoramaGameView`, etc.) y resúmenes.
- 👤 : **Nombre del Maestro** que creó o asignó la actividad en `ActivitiesPanel` y tarjetas de juego.
- 🟢 / 🟡 / 🔴 / ⚪ : **Indicadores de dificultad** (Fácil, Medio, Difícil) utilizados en `difficultyBadges.js` y renderizados en las tarjetas de juego y configuración.
- 😊 / 🤔 / 🔥 : **Selectores de dificultad** (Fácil, Medio, Difícil) interactivos dentro del formulario de creación `ConfigurationGameView`.
- 🌿 : **Insignia decorativa** utilizada en el componente de bienvenida `HeroCinematic` ("Plataforma Educativa en Lengua Mazahua").
- ©️ : **Derechos de autor** en el pie de página `Footer`.
- 🏆 : **Icono de trofeos/logros** en las actividades del estudiante (`StudentActivities`).
- 📚 : **Icono de asignaciones/biblioteca** en el panel de tareas del estudiante (`StudentAssignments`).

## Configuraciones y Tipos de Contenido
- 📝 : **Configuración de Texto** en los creadores de juegos y paneles, indicando que el ejercicio incluye palabras escritas.
- 🖼️ : **Configuración de Imagen** indicando que el ejercicio utiliza recursos visuales.
- 🗣️ : **Configuración de Lengua Mazahua**, activando el uso del idioma principal en lugar de español en el editor `ConfigurationGameView`.
- 🇪🇸 : **Toggle de idioma español** (subtítulos) en la configuración del maestro.
- ⚙️ : **Título de la sección de ajustes generales** en `ConfigurationGameView`.
- 🎵 : **Tipo de contenido musical ("Canción")** en `activityConfig.js` y los modales de `ContentSection`.
- 📖 : **Tipo de contenido escrito ("Cuentos", "Anécdota")** en configuraciones y modales.
- 🗺️ : **Tipo de contenido tradicional ("Leyendas")** en configuraciones.
- 📜 : **Tipo de contenido lírico ("Poemas")** en configuraciones.

## Iconos de Juegos Específicos
*Utilizados en `activityConfig.js`, paneles de acceso a juegos y títulos:*
- 🎮 : **General / Total de juegos**.
- ❓ : **Quiz** (Cuestionarios de opción múltiple).
- 🃏 : **Pares** (Icono por defecto en paneles para enlazar y para cartas).
- 🕵️ : **El Intruso** (Encontrar la palabra que no pertenece).
- 🔍 : **Encuentra Palabra** (Buscar palabras por pista/categoría).
- 🀄 / 🕹️ : **Laberinto** (Navegación para unir conceptos).
- 🎰 : **Lotería** (Juego de mesa tradicional con cartas y tablero).
- 🎊 : **Botón de ¡Lotería!** para declarar victoria en `LoteriaGameView`.
- 🎴 : **Memorama** (Emparejar cartas).
- ⚡ : **Memoria Rápida** (Deslizamiento de cartas con temporizador y multiplicador de combos).
- 🧩 : **Rompecabezas** (Seleccionar la pieza correcta para completar frases).
- ◀️ / ▲ / ▼ / ▶️ : **Controles del Laberinto** en el componente `LaberintoControls`.
