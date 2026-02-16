# DTOs Reference - Mazahua Connect

> Documento de referencia con todos los DTOs del backend. Se irá actualizando conforme se compartan más.

---

## Enumeraciones

### ActivityType
| Valor |
|---|
| `PAIRS` |
| `QUESTIONNAIRE` |
| `MEDIA` |

### Difficult
| Valor |
|---|
| `EASY` |
| `MEDIUM` |
| `HARD` |

### GameType
| Valor |
|---|
| `PAIRS` |
| `QUESTIONNAIRE` |
| `MEDIA_SONG` |
| `MEDIA_ANECDOTE` |
| `MEDIA_LEGEND` |

### MediaType
| Valor |
|---|
| `SONG` |
| `ANECDOTE` |
| `LEGEND` |

### UserType
| Valor |
|---|
| `STUDENT` |
| `TEACHER` |
| `ADMIN` |
| `VISITOR` |

---

## DTOs de Juego

### GameDTO (listado/consulta)
| Campo | Tipo |
|---|---|
| `id` | Integer |
| `title` | String |
| `difficult` | Difficult |
| `gameType` | GameType |
| `description` | String |
| `experience` | Integer |
| `totalQuestions` | Integer |
| `gameConfigDTO` | List\<GameConfigDTO\> |
| `teacherDTO` | TeacherDTO |

### GameDTO (creación/detalle con preguntas)
| Campo | Tipo |
|---|---|
| `gameType` | GameType |
| `title` | String |
| `description` | String |
| `totalQuestions` | Integer |
| `experience` | Integer |
| `difficult` | Difficult |
| `wordIds` | List\<Integer\> |
| `questions` | List\<QuestionDTO\> |
| `mediaId` | Integer |
| `gameConfigs` | List\<GameConfigDTO\> |

### GameConfigDTO
| Campo | Tipo |
|---|---|
| `showImage` | Boolean |
| `showText` | Boolean |
| `playAudio` | Boolean |
| `isMazahua` | Boolean |

### QuestionDTO
| Campo | Tipo |
|---|---|
| `question` | String |
| `responseList` | List\<AnswerDTO\> |

### AnswerDTO
| Campo | Tipo |
|---|---|
| `answerText` | String |
| `isCorrect` | Boolean |
| `wordId` | Integer |

### ExperienceRequestDTO
| Campo | Tipo |
|---|---|
| `difficult` | Difficult |
| `totalQuestions` | Integer |
| `gameConfigDTO` | List\<GameConfigDTO\> |

---

## DTOs de Actividad

### ActivityDTO (detallado — vista de actividades asignadas)
| Campo | Tipo |
|---|---|
| `gameInstanceDTO` | GameInstanceDTO |
| `id` | Integer |
| `title` | String |
| `difficult` | Difficult |
| `gameType` | GameType |
| `description` | String |
| `experience` | Integer |
| `totalQuestions` | Integer |
| `gameConfigDTO` | List\<GameConfigDTO\> |
| `teacherDTO` | TeacherDTO |

> Usa `GameConfigDTO` y `TeacherDTO` del paquete `assignActivities`.

### ActivityDTO (simplificado — dentro de login/estudiante)
| Campo | Tipo |
|---|---|
| `activityId` | Integer |
| `activityType` | ActivityType |
| `game` | GameDTO |

### GameInstanceDTO
| Campo | Tipo |
|---|---|
| `isActive` | Boolean |
| `creationDate` | LocalDate |

### AssignActivityRequestDTO
| Campo | Tipo |
|---|---|
| `gameId` | Integer |
| `groupId` | Integer |

### ActivityCompleteRequestDTO
| Campo | Tipo |
|---|---|
| `activityId` | Integer |
| `startDate` | LocalDateTime |
| `correctAnswers` | Integer |
| `responseLogs` | List\<ResponseLogDTO\> |
| `gameId` | Integer |

### ResponseLogDTO
| Campo | Tipo |
|---|---|
| `questionId` | Integer |
| `responseWordId` | Integer |
| `isCorrect` | Boolean |

---

## DTOs de Usuario

### TeacherDTO
| Campo | Tipo |
|---|---|
| `firstName` | String |
| `lastName` | String |

### StudentDTO (en contexto de grupo)
| Campo | Tipo |
|---|---|
| `username` | String |
| `firstname` | String |
| `lastname` | String |
| `listNumber` | String |

### StudentDTO (en contexto de login)
| Campo | Tipo |
|---|---|
| `username` | String |
| `firstname` | String |
| `lastname` | String |
| `listNumber` | Integer |
| `level` | Integer |
| `activities` | List\<ActivityDTO\> |

### StudentListDTO
| Campo | Tipo |
|---|---|
| `students` | List\<StudentDTO\> |

### UserAssignRequestDTO
| Campo | Tipo |
|---|---|
| `userType` | UserType |
| `grade` | Integer |

---

## DTOs de Grupos

### GroupDTO (completo)
| Campo | Tipo |
|---|---|
| `grade` | Integer |
| `teacher` | TeacherDTO |
| `totalStudents` | Integer |

### GroupDTO (simplificado — en GroupList)
| Campo | Tipo |
|---|---|
| `grade` | Integer |
| `students` | List\<StudentDTO\> |

### GroupDTO (en login de maestro)
| Campo | Tipo |
|---|---|
| `students` | List\<StudentDTO\> |

### GroupList
| Campo | Tipo |
|---|---|
| `groups` | List\<GroupDTO\> |

> Usa `createGroup.GroupDTO` explícitamente.

### ReassignRequestDTO
| Campo | Tipo |
|---|---|
| `studentUsername` | String |
| `newGrade` | Integer |

### RemoveRequestDTO
| Campo | Tipo |
|---|---|
| `studentUsername` | String |

---

## DTOs de Media

### MediaDTO
| Campo | Tipo |
|---|---|
| `title` | String |
| `duration` | Integer |
| `overviewImage` | String |
| `mediaType` | MediaType |
| `seasonMonth` | Integer |
| `description` | String |
| `difficult` | Difficult |

### SubtitleDTO
| Campo | Tipo |
|---|---|
| `spanishText` | String |
| `mazahuaText` | String |
| `timeStart` | Integer |
| `timeEnd` | Integer |

### StreamResourcesDTO
| Campo | Tipo | Nota |
|---|---|---|
| `url` | String | |
| `subtitles` | List\<Subtitle\> | Usa la entidad `Subtitle`, no el DTO |

---

## DTOs de Login / Autenticación

### LoginRequestDTO
| Campo | Tipo |
|---|---|
| `username` | String |
| `password` | String |
| `userType` | UserType |
| `grade` | Integer |

### LoginResponseDTO *(interfaz)*
Implementada por: `LoginTeacherResponseDTO`, `LoginStudentResponseDTO`, `LoginAdminResponseDTO`, `LoginVisitorResponseDTO`

### LoginTeacherResponseDTO
| Campo | Tipo |
|---|---|
| `group` | GroupDTO |

### LoginStudentResponseDTO
| Campo | Tipo |
|---|---|
| `activitiesNotFinished` | List\<ActivityDTO\> |
| `level` | Integer |
| `totalExperience` | Integer |
| `grade` | Integer |

### LoginAdminResponseDTO
| Campo | Tipo |
|---|---|
| `firstname` | String |
| `lastname` | String |
| `userType` | UserType |
| `jwtToken` | String |

### LoginVisitorResponseDTO
| Campo | Tipo |
|---|---|
| `level` | Integer |
| `totalExperience` | Integer |

---

## DTOs de Inicio de Actividad

### StartActivityRequestDTO
| Campo | Tipo |
|---|---|
| `activityId` | Integer |
| `isAssignedActivity` | Boolean |

---

## DTOs de Recomendaciones

### RecommendedResponse
| Campo | Tipo |
|---|---|
| `games` | List\<GameDTO\> |
| `medias` | List\<MediaDTO\> |

---

## DTOs de Registro

### RegisterRequestDTO
| Campo | Tipo |
|---|---|
| `firstname` | String |
| `lastname` | String |
| `userType` | UserType |
| `grade` | Integer |

### RegisterResponseDTO
| Campo | Tipo |
|---|---|
| `username` | String |
| `password` | String |

### RegisterVisitorRequestDTO
| Campo | Tipo |
|---|---|
| `firstname` | String |
| `lastname` | String |
| `email` | String |
| `password` | String |
| `username` | String |

---

## DTOs de Recompensas

### RewardRequestDTO
| Campo | Tipo |
|---|---|
| `username` | String |
| `activityId` | Integer |

### RewardResponseDTO
| Campo | Tipo |
|---|---|
| `xpGained` | Integer |
| `actualXp` | Integer |
| `currentLevel` | Integer |
| `isLevelUp` | Boolean |

---

## DTOs de Palabras y Categorías

### WordDetailsDTO
| Campo | Tipo |
|---|---|
| `spanishWord` | String |
| `mazahuaWord` | String |
| `spanishPronunciation` | String |
| `mazahuaPronunciation` | String |
| `imageUrl` | String |

### CategoryListDTO
| Campo | Tipo |
|---|---|
| `categories` | List\<String\> |

---

## Controladores

### GroupController
| Método | Retorno |
|---|---|
| `getGroup()` | String |

---

## Entidades del Modelo (stubs vacíos)

Las siguientes entidades existen en el backend pero actualmente están como stubs vacíos:

| Entidad | Entidad | Entidad | Entidad | Entidad |
|---|---|---|---|---|
| Activity | Answer | ContentActivity | Game | GameConfig |
| Group | Media | Number | Question | ResponseLog |
| Sentence | Session | Student | Subtitle | Teacher |
| User | Visitor | Word | | |

---

