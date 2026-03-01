import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AdminSidebar from '../../components/Dashboard/AdminSidebar';
import apiConfig from '../../services/apiConfig';

const AdminDashboard = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Teacher creation modal state
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [teacherForm, setTeacherForm] = useState({ firstname: '', lastname: '' });
    const [createdTeacherCredentials, setCreatedTeacherCredentials] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Teacher list state
    const [teachersList, setTeachersList] = useState([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [teacherFetchError, setTeacherFetchError] = useState('');
    const [hasFetchedTeachers, setHasFetchedTeachers] = useState(false);

    // Student modal & list state
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [studentForm, setStudentForm] = useState({ firstname: '', lastname: '', grade: '' });
    const [createdStudentCredentials, setCreatedStudentCredentials] = useState(null);
    const [isCreatingStudent, setIsCreatingStudent] = useState(false);
    const [createStudentError, setCreateStudentError] = useState('');

    const [studentsList, setStudentsList] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [studentFetchError, setStudentFetchError] = useState('');
    const [hasFetchedStudents, setHasFetchedStudents] = useState(false);

    // Multi-select & Delete state
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedUsernames, setSelectedUsernames] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // Groups state
    const [groupsList, setGroupsList] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [groupFetchError, setGroupFetchError] = useState('');
    const [hasFetchedGroups, setHasFetchedGroups] = useState(false);

    // Group Details Page State
    const [activeGroupView, setActiveGroupView] = useState(null); // stores grade number
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupStudentsList, setGroupStudentsList] = useState([]);
    const [isLoadingGroupStudents, setIsLoadingGroupStudents] = useState(false);
    const [groupStudentsError, setGroupStudentsError] = useState('');

    // Group Action Modal State (for Move, Add Teacher/Students)
    const [groupActionModal, setGroupActionModal] = useState({
        isOpen: false,
        type: '', // 'ADD_TEACHER', 'MOVE_TEACHER', 'ADD_STUDENTS', 'MOVE_STUDENT'
        targetUser: null // username of student/teacher being moved
    });
    const [groupActionTargetGrade, setGroupActionTargetGrade] = useState('');
    const [groupActionError, setGroupActionError] = useState('');
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);

    // Create Group State
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [createGroupStep, setCreateGroupStep] = useState('MAIN'); // MAIN, SELECT_TEACHER, SELECT_STUDENTS
    const [createGroupForm, setCreateGroupForm] = useState({ grade: '', teacherUsername: '', studentsUsername: [] });
    const [isGradeLocked, setIsGradeLocked] = useState(false);
    const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
    const [createGroupError, setCreateGroupError] = useState('');

    const [availableStudents, setAvailableStudents] = useState([]);
    const [isLoadingAvailableStudents, setIsLoadingAvailableStudents] = useState(false);
    const [hasFetchedAvailableStudents, setHasFetchedAvailableStudents] = useState(false);

    // Dictionary Words State
    const [dictionaryCategories, setDictionaryCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [dictionaryCategoryError, setDictionaryCategoryError] = useState('');
    const [hasFetchedCategories, setHasFetchedCategories] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryWords, setCategoryWords] = useState([]);
    const [wordsCurrentPage, setWordsCurrentPage] = useState(0);
    const [wordsTotalPages, setWordsTotalPages] = useState(1);
    const [isLoadingWords, setIsLoadingWords] = useState(false);
    const [categoryWordsError, setCategoryWordsError] = useState('');

    // Create Word Modal State
    const [isCreateWordModalOpen, setIsCreateWordModalOpen] = useState(false);
    const [createWordForm, setCreateWordForm] = useState({
        spanishText: '',
        mazahuaText: '',
        category: ''
    });
    const [createWordMedia, setCreateWordMedia] = useState({
        image: null,
        audio: null
    });
    const [isCreatingWord, setIsCreatingWord] = useState(false);
    const [createWordError, setCreateWordError] = useState('');

    // Temp state for multi-select in students view
    const [tempSelectedStudents, setTempSelectedStudents] = useState([]);

    useEffect(() => {
        setIsMultiSelectMode(false);
        setSelectedUsernames([]);

        if (currentPath === '/admin/maestros' && !hasFetchedTeachers) {
            fetchTeachers();
        } else if (currentPath === '/admin/estudiantes' && !hasFetchedStudents) {
            fetchStudents();
        } else if (currentPath === '/admin/grupos' && !hasFetchedGroups) {
            fetchGroups();
        } else if (currentPath === '/admin/palabras' && !hasFetchedCategories) {
            fetchDictionaryCategories();
        }
    }, [currentPath, hasFetchedTeachers, hasFetchedStudents, hasFetchedGroups, hasFetchedCategories]);

    // Keep selectedGroup in sync with groupsList updates
    useEffect(() => {
        if (activeGroupView && groupsList.length > 0) {
            const updatedGroup = groupsList.find(g => g.grade === activeGroupView);
            if (updatedGroup) {
                setSelectedGroup(updatedGroup);
            }
        }
    }, [groupsList, activeGroupView]);

    const fetchGroups = async () => {
        setIsLoadingGroups(true);
        setGroupFetchError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/groups`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener la lista de grupos.');
            }
            const data = await response.json();
            setGroupsList(data.groups || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setGroupFetchError(error.message || 'Error de conexión al cargar grupos.');
        } finally {
            setIsLoadingGroups(false);
            setHasFetchedGroups(true);
        }
    };

    const fetchGroupStudents = async (grade) => {
        setIsLoadingGroupStudents(true);
        setGroupStudentsError('');
        setGroupStudentsList([]);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/groups/${grade}/students`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener los estudiantes del grupo.');
            }
            const data = await response.json();
            setGroupStudentsList(data.students || []);
        } catch (error) {
            console.error('Error fetching group students:', error);
            setGroupStudentsError(error.message || 'Error de conexión al cargar estudiantes del grupo.');
        } finally {
            setIsLoadingGroupStudents(false);
        }
    };

    const openGroupPage = (groupInfo) => {
        setSelectedGroup(groupInfo);
        setActiveGroupView(groupInfo.grade);
        fetchGroupStudents(groupInfo.grade);
    };

    const closeGroupPage = () => {
        setActiveGroupView(null);
        setSelectedGroup(null);
        setGroupStudentsList([]);
        setGroupStudentsError('');
    };

    const closeGroupActionModal = () => {
        setGroupActionModal({ isOpen: false, type: '', targetUser: null });
        setGroupActionTargetGrade('');
        setGroupActionError('');
        setTempSelectedStudents([]);
    };

    const handleGroupActionSubmit = async () => {
        setIsSubmittingAction(true);
        setGroupActionError('');

        try {
            let url = '';
            let method = '';
            const currentGrade = activeGroupView;

            switch (groupActionModal.type) {
                case 'ADD_TEACHER':
                    if (!groupActionModal.targetUser) throw new Error('Selecciona un maestro.');
                    url = `${apiConfig.baseUrl}/api/groups/${currentGrade}/teacher/${groupActionModal.targetUser}`;
                    method = 'POST';
                    break;
                case 'MOVE_TEACHER':
                    if (!groupActionTargetGrade) throw new Error('Selecciona el grupo destino.');
                    url = `${apiConfig.baseUrl}/api/groups/${groupActionTargetGrade}/teacher/${groupActionModal.targetUser}`;
                    method = 'PUT';
                    break;
                case 'ADD_STUDENTS':
                    if (tempSelectedStudents.length === 0) throw new Error('Selecciona al menos un estudiante.');
                    break;
                case 'MOVE_STUDENT':
                    if (!groupActionTargetGrade) throw new Error('Selecciona el grupo destino.');
                    url = `${apiConfig.baseUrl}/api/groups/${groupActionTargetGrade}/students/${groupActionModal.targetUser}`;
                    method = 'PUT';
                    break;
                default:
                    throw new Error('Acción no válida.');
            }

            if (groupActionModal.type === 'ADD_STUDENTS') {
                await Promise.all(
                    tempSelectedStudents.map(studentUsr =>
                        fetch(`${apiConfig.baseUrl}/api/groups/${currentGrade}/students/${studentUsr}`, {
                            method: 'POST',
                            headers: apiConfig.getHeaders()
                        }).then(async res => {
                            if (!res.ok) {
                                const err = await res.json().catch(() => ({}));
                                let msg = err.message || `Error al agregar estudiante`;
                                if (err.validationErrors) msg += ` ${Object.values(err.validationErrors).join(' ')}`;
                                throw new Error(msg);
                            }
                        })
                    )
                );
            } else {
                const response = await fetch(url, {
                    method,
                    headers: apiConfig.getHeaders()
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    let errorMsg = errorData.message || 'Error al ejecutar la acción.';
                    if (errorData.validationErrors) {
                        const validationMsgs = Object.values(errorData.validationErrors).join(' ');
                        errorMsg = `${errorMsg} ${validationMsgs}`;
                    }
                    throw new Error(errorMsg);
                }
            }

            fetchGroups();
            if (activeGroupView) fetchGroupStudents(activeGroupView);

            setHasFetchedStudents(false);
            setHasFetchedTeachers(false);
            setHasFetchedAvailableStudents(false);

            closeGroupActionModal();
        } catch (error) {
            setGroupActionError(error.message);
        } finally {
            setIsSubmittingAction(false);
        }
    };

    const removeTeacherFromGroup = async (teacherUsername, grade) => {
        if (!window.confirm('¿Estás seguro de remover al maestro de este grupo?')) return;
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/groups/${grade}/teacher/${teacherUsername}`, {
                method: 'DELETE',
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Error al remover maestro');
            }
            fetchGroups();
            setSelectedGroup(prev => ({ ...prev, teacher: null }));
            setHasFetchedTeachers(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const removeStudentFromGroup = async (studentUsername, grade) => {
        if (!window.confirm('¿Estás seguro de remover a este estudiante del grupo?')) return;
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/groups/${grade}/students/${studentUsername}`, {
                method: 'DELETE',
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Error al remover estudiante');
            }
            fetchGroups();
            fetchGroupStudents(grade);
            setHasFetchedStudents(false);
            setHasFetchedAvailableStudents(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const openCreateGroupModal = (gradeLocked = false, gradeVal = '') => {
        setIsGradeLocked(gradeLocked);
        setCreateGroupForm({ grade: gradeVal, teacherUsername: '', studentsUsername: [] });
        setCreateGroupStep('MAIN');
        setCreateGroupError('');
        setIsCreateGroupModalOpen(true);
    };

    const closeCreateGroupModal = () => {
        setIsCreateGroupModalOpen(false);
        setCreateGroupForm({ grade: '', teacherUsername: '', studentsUsername: [] });
        setCreateGroupStep('MAIN');
        setCreateGroupError('');
    };

    const fetchAvailableStudents = async () => {
        setIsLoadingAvailableStudents(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/user/available`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener estudiantes disponibles.');
            }
            const data = await response.json();
            setAvailableStudents(data.students || []);
        } catch (error) {
            console.error('Error fetching available students:', error);
        } finally {
            setIsLoadingAvailableStudents(false);
            setHasFetchedAvailableStudents(true);
        }
    };

    const submitCreateGroup = async () => {
        if (!createGroupForm.grade) {
            setCreateGroupError('Selecciona un grado válido.');
            return;
        }

        setIsSubmittingGroup(true);
        setCreateGroupError('');

        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/groups/${createGroupForm.grade}`, {
                method: 'POST',
                headers: {
                    ...apiConfig.getHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentsUsername: createGroupForm.studentsUsername,
                    teacherUsername: createGroupForm.teacherUsername || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMsg = errorData.message || 'Error al crear el grupo.';
                if (errorData.validationErrors) {
                    const validationMsgs = Object.values(errorData.validationErrors).join(' ');
                    errorMsg = `${errorMsg} ${validationMsgs}`;
                }
                throw new Error(errorMsg);
            }

            // Success
            fetchGroups(); // Refresh groups
            setHasFetchedTeachers(false);
            setHasFetchedStudents(false);
            setHasFetchedAvailableStudents(false);
            closeCreateGroupModal();
        } catch (error) {
            console.error('Error creating group:', error);
            setCreateGroupError(error.message || 'Ocurrió un error al crear el grupo.');
        } finally {
            setIsSubmittingGroup(false);
        }
    };

    const fetchTeachers = async () => {
        setIsLoadingTeachers(true);
        setTeacherFetchError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/teacher`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener la lista de maestros en el servidor.');
            }
            const data = await response.json();
            setTeachersList(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeacherFetchError(error.message || 'Error de conexión.');
        } finally {
            setIsLoadingTeachers(false);
            setHasFetchedTeachers(true);
        }
    };

    const fetchStudents = async () => {
        setIsLoadingStudents(true);
        setStudentFetchError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/students`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener la lista de estudiantes.');
            }
            const data = await response.json();
            setStudentsList(data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudentFetchError(error.message || 'Error de conexión al cargar estudiantes.');
        } finally {
            setIsLoadingStudents(false);
            setHasFetchedStudents(true);
        }
    };

    const fetchDictionaryCategories = async () => {
        setIsLoadingCategories(true);
        setDictionaryCategoryError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/dictionary/words/categories`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) throw new Error('Error al cargar las categorías del diccionario.');
            const data = await response.json();
            setDictionaryCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setDictionaryCategoryError(error.message);
        } finally {
            setIsLoadingCategories(false);
            setHasFetchedCategories(true);
        }
    };

    const fetchCategoryWords = async (category, page = 0) => {
        setIsLoadingWords(true);
        setCategoryWordsError('');
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/dictionary/words/${category}?page=${page}`, {
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    throw new Error('Categoría o página inválida/no encontrada.');
                }
                throw new Error('Error al cargar las palabras.');
            }
            const data = await response.json();

            // Assume the main array might be under 'content' (spring boot standard) or 'words' as specified.
            const fetchedWords = data.content || data.words || [];
            setCategoryWords(fetchedWords);

            // Try to extract pagination data if present, otherwise default to infinite/assumptions.
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

            const response = await fetch(`${apiConfig.baseUrl}/api/dictionary/word/media`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Error al crear la palabra.');
            }

            // Success
            setIsCreateWordModalOpen(false);
            setCreateWordForm({ spanishText: '', mazahuaText: '', category: '' });
            setCreateWordMedia({ image: null, audio: null });

            // Refresh Data
            if (selectedCategory) {
                if (selectedCategory === createWordForm.category) {
                    fetchCategoryWords(selectedCategory, wordsCurrentPage);
                } else {
                    fetchDictionaryCategories();
                }
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

    const handleTeacherFormChange = (e) => {
        setTeacherForm({ ...teacherForm, [e.target.name]: e.target.value });
    };

    const handleStudentFormChange = (e) => {
        setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        setCreateError('');
        setCreatedTeacherCredentials(null);

        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/users`, {
                method: 'POST',
                headers: {
                    ...apiConfig.getHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...teacherForm,
                    userType: 'TEACHER'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear el maestro');
            }

            const data = await response.json();
            setCreatedTeacherCredentials(data);
            setTeacherForm({ firstname: '', lastname: '' });
            fetchTeachers();
            setHasFetchedGroups(false);
        } catch (error) {
            console.error('Error creating teacher:', error);
            setCreateError(error.message || 'Ocurrió un error al crear el maestro.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();

        // Validate grade
        const gradeNum = parseInt(studentForm.grade);
        if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 6) {
            setCreateStudentError('El grado debe ser un número entre 1 y 6.');
            return;
        }

        setIsCreatingStudent(true);
        setCreateStudentError('');
        setCreatedStudentCredentials(null);

        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/users`, {
                method: 'POST',
                headers: {
                    ...apiConfig.getHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: studentForm.firstname,
                    lastname: studentForm.lastname,
                    userType: 'STUDENT',
                    grade: gradeNum
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear el estudiante');
            }

            const data = await response.json();
            setCreatedStudentCredentials(data);
            setStudentForm({ firstname: '', lastname: '', grade: '' });
            fetchStudents();
            setHasFetchedGroups(false);
            setHasFetchedAvailableStudents(false);
        } catch (error) {
            console.error('Error creating student:', error);
            setCreateStudentError(error.message || 'Ocurrió un error al crear el estudiante.');
        } finally {
            setIsCreatingStudent(false);
        }
    };

    const closeTeacherModal = () => {
        setIsTeacherModalOpen(false);
        setCreatedTeacherCredentials(null);
        setTeacherForm({ firstname: '', lastname: '' });
        setCreateError('');
    };

    const closeStudentModal = () => {
        setIsStudentModalOpen(false);
        setCreatedStudentCredentials(null);
        setStudentForm({ firstname: '', lastname: '', grade: '' });
        setCreateStudentError('');
    };

    // --- Delete Methods ---
    const toggleMultiSelect = () => {
        setIsMultiSelectMode(!isMultiSelectMode);
        setSelectedUsernames([]);
    };

    const handleSelectUser = (username) => {
        if (selectedUsernames.includes(username)) {
            setSelectedUsernames(selectedUsernames.filter(u => u !== username));
        } else {
            setSelectedUsernames([...selectedUsernames, username]);
        }
    };

    const handleSelectAll = (users) => {
        if (selectedUsernames.length === users.length) {
            setSelectedUsernames([]);
        } else {
            setSelectedUsernames(users.map(u => u.username));
        }
    };

    const deleteUser = async (username) => {
        if (!window.confirm(`¿Estás seguro de eliminar permanentemente a ${username}?`)) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/api/admin/users/${username}`, {
                method: 'DELETE',
                headers: apiConfig.getHeaders()
            });
            if (!response.ok) throw new Error('Error al eliminar el usuario');

            if (currentPath === '/admin/maestros') fetchTeachers();
            if (currentPath === '/admin/estudiantes') fetchStudents();
            setHasFetchedGroups(false);
            setHasFetchedAvailableStudents(false);
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteSelectedUsers = async () => {
        if (selectedUsernames.length === 0) return;
        if (!window.confirm(`¿Estás seguro de eliminar a los ${selectedUsernames.length} usuarios seleccionados? Esta acción es irreversible.`)) return;

        setIsDeleting(true);
        try {
            await Promise.all(
                selectedUsernames.map(username =>
                    fetch(`${apiConfig.baseUrl}/api/admin/users/${username}`, {
                        method: 'DELETE',
                        headers: apiConfig.getHeaders()
                    }).then(res => {
                        if (!res.ok) throw new Error(`Error eliminando ${username}`);
                    })
                )
            );
            setSelectedUsernames([]);
            setIsMultiSelectMode(false);

            if (currentPath === '/admin/maestros') fetchTeachers();
            if (currentPath === '/admin/estudiantes') fetchStudents();
            setHasFetchedGroups(false);
            setHasFetchedAvailableStudents(false);
        } catch (error) {
            alert('Error durante la eliminación múltiple: ' + error.message);
            // Re-fetch since partial deletion might have occurred
            if (currentPath === '/admin/maestros') fetchTeachers();
            if (currentPath === '/admin/estudiantes') fetchStudents();
        } finally {
            setIsDeleting(false);
        }
    };

    const renderTeacherModalContent = () => {
        return (
            <div className="p-6 overflow-y-auto w-full max-w-md">
                {createdTeacherCredentials ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            El maestro se ha creado exitosamente. Por favor, guarda estas credenciales ya que no se volverán a mostrar.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-200">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase font-semibold">Usuario</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdTeacherCredentials.username}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Contraseña</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdTeacherCredentials.password}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeTeacherModal}
                            className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleCreateTeacher} className="space-y-4">
                        {createError && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                                {createError}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input
                                type="text"
                                name="firstname"
                                required
                                value={teacherForm.firstname}
                                onChange={handleTeacherFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Juan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="lastname"
                                required
                                value={teacherForm.lastname}
                                onChange={handleTeacherFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Pérez"
                            />
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={closeTeacherModal}
                                className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin align-middle" style={{ fontSize: '20px' }}>progress_activity</span>
                                        Creando...
                                    </>
                                ) : 'Crear Maestro'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    };

    const renderStudentModalContent = () => {
        return (
            <div className="p-6 overflow-y-auto w-full max-w-md">
                {createdStudentCredentials ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            El estudiante se ha creado exitosamente. Por favor, guarda estas credenciales.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-200">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase font-semibold">Usuario</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdStudentCredentials.username}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Contraseña</span>
                                <p className="font-mono text-gray-800 font-medium text-lg">{createdStudentCredentials.password}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeStudentModal}
                            className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleCreateStudent} className="space-y-4">
                        {createStudentError && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                                {createStudentError}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input
                                type="text"
                                name="firstname"
                                required
                                value={studentForm.firstname}
                                onChange={handleStudentFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Maria"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="lastname"
                                required
                                value={studentForm.lastname}
                                onChange={handleStudentFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                placeholder="Ej: Gómez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                            <select
                                name="grade"
                                required
                                value={studentForm.grade}
                                onChange={handleStudentFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                            >
                                <option value="" disabled>Selecciona un grado</option>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}º Grado</option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={closeStudentModal}
                                className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isCreatingStudent}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isCreatingStudent ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin align-middle" style={{ fontSize: '20px' }}>progress_activity</span>
                                        Creando...
                                    </>
                                ) : 'Crear Estudiante'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )
    }
    const renderGroupActionModal = () => {
        if (!groupActionModal.isOpen) return null;

        const isMove = groupActionModal.type === 'MOVE_TEACHER' || groupActionModal.type === 'MOVE_STUDENT';
        const isAddStuds = groupActionModal.type === 'ADD_STUDENTS';
        const isAddTeacher = groupActionModal.type === 'ADD_TEACHER';

        return (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full max-w-md animate-slide-up">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined">{isMove ? 'sync_alt' : 'add_circle'}</span>
                            </div>
                            {isMove ? 'Mover de Grupo' : (isAddTeacher ? 'Asignar Maestro' : 'Agregar Estudiantes')}
                        </h3>
                        <button onClick={closeGroupActionModal} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-xl hover:bg-gray-100">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6">
                        {groupActionError && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl mb-4 text-sm animate-pulse flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {groupActionError}
                            </div>
                        )}

                        {isMove && (
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Grupo Destino <span className="text-red-500">*</span>
                                </label>
                                <p className="text-sm text-gray-500 mb-2">Selecciona el grupo al cual deseas mover a {groupActionModal.targetUser}.</p>
                                <select
                                    value={groupActionTargetGrade}
                                    onChange={e => setGroupActionTargetGrade(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                >
                                    <option value="" disabled>Seleccionar grado...</option>
                                    {groupsList.filter(g => g.grade !== activeGroupView).map(g => (
                                        <option key={g.grade} value={g.grade}>{g.grade}º Grado</option>
                                    ))}
                                </select>
                                {groupsList.filter(g => g.grade !== activeGroupView).length === 0 && (
                                    <p className="text-xs text-orange-500 mt-2">No hay otros grupos disponibles a los cuales mover.</p>
                                )}
                            </div>
                        )}

                        {isAddTeacher && (
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Seleccionar Maestro <span className="text-red-500">*</span>
                                </label>
                                {isLoadingTeachers ? (
                                    <p className="text-sm text-gray-500 animate-pulse">Cargando maestros...</p>
                                ) : (
                                    <select
                                        value={groupActionModal.targetUser || ''}
                                        onChange={e => setGroupActionModal(prev => ({ ...prev, targetUser: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    >
                                        <option value="" disabled>Seleccionar maestro...</option>
                                        {teachersList.filter(t => !groupsList.some(g => g.teacher && g.teacher.username === t.username)).map(t => (
                                            <option key={t.username} value={t.username}>{t.lastname}, {t.firstname}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {isAddStuds && (
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide flex justify-between">
                                    <span>Estudiantes Disponibles</span>
                                    <span className="text-primary">{tempSelectedStudents.length} seleccionados</span>
                                </label>
                                {isLoadingAvailableStudents ? (
                                    <div className="flex justify-center p-6"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>
                                ) : (
                                    <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                                        {availableStudents.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500 text-sm">No hay estudiantes sin grupo disponibles.</div>
                                        ) : availableStudents.map(st => (
                                            <label key={st.username} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                    checked={tempSelectedStudents.includes(st.username)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setTempSelectedStudents(prev => [...prev, st.username]);
                                                        else setTempSelectedStudents(prev => prev.filter(u => u !== st.username));
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm">{st.lastname}, {st.firstname}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{st.username}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button onClick={closeGroupActionModal} className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={handleGroupActionSubmit}
                                disabled={isSubmittingAction || (isAddStuds && tempSelectedStudents.length === 0) || (isMove && !groupActionTargetGrade) || (isAddTeacher && !groupActionModal.targetUser)}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-primary/20"
                            >
                                {isSubmittingAction ? (
                                    <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Procesando</>
                                ) : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGroupDetailPage = () => {
        if (!selectedGroup) return null;

        return (
            <div className="space-y-6 animate-fade-in-up">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Detalles del {activeGroupView}º Grado</h2>
                        <p className="text-gray-500 mt-1">Gestiona los estudiantes y el maestro de este grupo.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">person</span>
                            Maestro Asignado
                        </h4>
                        {selectedGroup.teacher ? (
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-50 bg-blue-50/20 p-4 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{selectedGroup.teacher.lastname}, {selectedGroup.teacher.firstname}</p>
                                    <p className="text-sm text-gray-500 font-mono mt-1">{selectedGroup.teacher.username}</p>
                                </div>
                                <div className="flex flex-row sm:flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            setGroupActionModal({ isOpen: true, type: 'MOVE_TEACHER', targetUser: selectedGroup.teacher.username });
                                        }}
                                        className="text-xs px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm font-semibold flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                                        Mover
                                    </button>
                                    <button
                                        onClick={() => removeTeacherFromGroup(selectedGroup.teacher.username, activeGroupView)}
                                        className="text-xs px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">person_remove</span>
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">person_off</span>
                                <p className="text-gray-500 mb-4 text-sm font-medium">Sin maestro asignado</p>
                                <button
                                    onClick={() => {
                                        if (!hasFetchedTeachers) fetchTeachers();
                                        setGroupActionModal({ isOpen: true, type: 'ADD_TEACHER', targetUser: null });
                                    }}
                                    className="px-5 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all text-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                    Asignar Maestro
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">Total Alumnos</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-primary leading-none">{selectedGroup.totalStudents || 0}</span>
                            <span className="text-gray-500 font-medium">inscritos</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
                        <h4 className="font-bold text-gray-800 text-lg uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">groups</span>
                            Lista de Estudiantes
                        </h4>
                        <button
                            onClick={() => {
                                fetchAvailableStudents();
                                setGroupActionModal({ isOpen: true, type: 'ADD_STUDENTS', targetUser: null });
                            }}
                            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm flex items-center gap-2 shadow-md shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-[18px]">group_add</span>
                            Agregar Estudiantes
                        </button>
                    </div>

                    {isLoadingGroupStudents ? (
                        <div className="flex justify-center p-12">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary/50">progress_activity</span>
                        </div>
                    ) : groupStudentsError ? (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-medium shadow-sm">{groupStudentsError}</div>
                    ) : groupStudentsList.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">group_off</span>
                            No hay estudiantes inscritos en este grupo.
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="py-3 px-4 font-bold text-center w-20">Nº Lista</th>
                                        <th className="py-3 px-4 font-bold">Nombre Completo</th>
                                        <th className="py-3 px-4 font-bold">Usuario</th>
                                        <th className="py-3 px-4 font-bold">Contraseña</th>
                                        <th className="py-3 px-4 font-bold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {groupStudentsList.map((student, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                                                    {student.listNumber || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 font-medium">
                                                {student.lastname}, {student.firstname}
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 font-mono text-xs">{student.username}</td>
                                            <td className="py-3 px-4 text-gray-500 font-mono text-xs">{student.password || '******'}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="inline-flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setGroupActionModal({ isOpen: true, type: 'MOVE_STUDENT', targetUser: student.username })}
                                                        title="Mover de Grupo"
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                                                    </button>
                                                    <button
                                                        onClick={() => removeStudentFromGroup(student.username, activeGroupView)}
                                                        title="Remover del Grupo"
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">person_remove</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderCreateGroupModalContent = () => {
        if (createGroupStep === 'MAIN') {
            const selectedTeacherObj = teachersList.find(t => t.username === createGroupForm.teacherUsername);
            const selectedStudentsCount = createGroupForm.studentsUsername.length;

            return (
                <div className="p-6 overflow-y-auto w-full max-w-2xl max-h-[75vh]">
                    {createGroupError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex gap-3 animate-pulse">
                            <span className="material-symbols-outlined">error</span>
                            <span>{createGroupError}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Grade */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Grado Escolar <span className="text-red-500">*</span>
                            </label>
                            {isGradeLocked ? (
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400">lock</span>
                                    {createGroupForm.grade}º Grado
                                </div>
                            ) : (
                                <select
                                    value={createGroupForm.grade}
                                    onChange={(e) => setCreateGroupForm({ ...createGroupForm, grade: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                >
                                    <option value="" disabled>Seleccionar grado...</option>
                                    {[1, 2, 3, 4, 5, 6].map(num => {
                                        // Only show grades that don't already have a group
                                        if (groupsList.some(g => g.grade === num)) return null;
                                        return <option key={num} value={num}>{num}º Grado</option>;
                                    })}
                                </select>
                            )}
                        </div>

                        {/* Teacher */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Maestro Asignado
                            </label>
                            {selectedTeacherObj ? (
                                <div className="flex items-center justify-between p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                            {selectedTeacherObj.firstname.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{selectedTeacherObj.lastname}, {selectedTeacherObj.firstname}</p>
                                            <p className="text-xs text-gray-500 font-mono">{selectedTeacherObj.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (teachersList.length === 0 && !hasFetchedTeachers) fetchTeachers();
                                            setCreateGroupStep('SELECT_TEACHER');
                                        }}
                                        className="text-sm px-4 py-2 text-primary hover:bg-blue-100 rounded-lg font-semibold transition-colors"
                                    >
                                        Cambiar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (teachersList.length === 0 && !hasFetchedTeachers) fetchTeachers();
                                        setCreateGroupStep('SELECT_TEACHER');
                                    }}
                                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-primary/5"
                                >
                                    <span className="material-symbols-outlined">person_add</span>
                                    Seleccionar Maestro
                                </button>
                            )}
                        </div>

                        {/* Students */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Estudiantes ({selectedStudentsCount})
                                </label>
                                <button
                                    onClick={() => {
                                        if (availableStudents.length === 0 && !hasFetchedAvailableStudents) fetchAvailableStudents();
                                        setTempSelectedStudents([...createGroupForm.studentsUsername]);
                                        setCreateGroupStep('SELECT_STUDENTS');
                                    }}
                                    className="text-sm text-primary font-bold hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[18px]">group_add</span>
                                    Agregar / Editar
                                </button>
                            </div>

                            {selectedStudentsCount > 0 ? (
                                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                                    <ul className="divide-y divide-gray-100 bg-white">
                                        {createGroupForm.studentsUsername.map(username => {
                                            const st = availableStudents.find(s => s.username === username);
                                            return (
                                                <li key={username} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                                            {st?.listNumber || '-'}
                                                        </span>
                                                        <span className="font-medium text-gray-800">{st ? `${st.lastname}, ${st.firstname}` : username}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setCreateGroupForm(prev => ({
                                                            ...prev,
                                                            studentsUsername: prev.studentsUsername.filter(u => u !== username)
                                                        }))}
                                                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Remover"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                    <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">group_off</span>
                                    <p className="text-gray-500 text-sm">No hay estudiantes seleccionados.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            onClick={closeCreateGroupModal}
                            className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={submitCreateGroup}
                            disabled={isSubmittingGroup || !createGroupForm.grade}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md shadow-primary/20"
                        >
                            {isSubmittingGroup ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin align-middle text-[20px]">progress_activity</span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Crear Grupo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            );
        }

        if (createGroupStep === 'SELECT_TEACHER') {
            return (
                <div className="flex flex-col h-full max-h-[75vh]">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                        <button
                            onClick={() => setCreateGroupStep('MAIN')}
                            className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        </button>
                        <h4 className="font-bold text-gray-800">Seleccionar Maestro</h4>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                        {isLoadingTeachers ? (
                            <div className="flex justify-center p-12">
                                <span className="material-symbols-outlined animate-spin text-4xl text-primary/50">progress_activity</span>
                            </div>
                        ) : teacherFetchError ? (
                            <div className="text-center p-4 bg-red-50 text-red-600 rounded-xl">{teacherFetchError}</div>
                        ) : teachersList.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No hay maestros registrados en el sistema.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {teachersList.map(t => (
                                    <button
                                        key={t.username}
                                        onClick={() => {
                                            setCreateGroupForm({ ...createGroupForm, teacherUsername: t.username });
                                            setCreateGroupStep('MAIN');
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${createGroupForm.teacherUsername === t.username ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                {t.firstname.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{t.lastname}, {t.firstname}</p>
                                                <p className="text-xs text-gray-500 font-mono">{t.username}</p>
                                            </div>
                                        </div>
                                        {createGroupForm.teacherUsername === t.username && (
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (createGroupStep === 'SELECT_STUDENTS') {
            const handleToggleStudent = (username) => {
                if (tempSelectedStudents.includes(username)) {
                    setTempSelectedStudents(tempSelectedStudents.filter(u => u !== username));
                } else {
                    setTempSelectedStudents([...tempSelectedStudents, username]);
                }
            };

            return (
                <div className="flex flex-col h-full max-h-[85vh] w-[800px] max-w-full">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCreateGroupStep('MAIN')}
                                className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            </button>
                            <div>
                                <h4 className="font-bold text-gray-800">Seleccionar Estudiantes</h4>
                                <p className="text-xs text-gray-500">{availableStudents.length} disponibles</p>
                            </div>
                        </div>
                        <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm">
                            {tempSelectedStudents.length} Seleccionados
                        </div>
                    </div>
                    <div className="p-0 flex-1 overflow-y-auto bg-gray-50/30">
                        {isLoadingAvailableStudents ? (
                            <div className="flex justify-center p-12">
                                <span className="material-symbols-outlined animate-spin text-4xl text-primary/50">progress_activity</span>
                            </div>
                        ) : availableStudents.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">sentiment_dissatisfied</span>
                                No hay estudiantes sin grupo disponibles.
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse bg-white shadow-sm">
                                <thead className="sticky top-0 bg-gray-100/95 backdrop-blur z-10 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1)]">
                                    <tr className="text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="py-4 px-6 w-12 text-center border-b border-gray-200 relative">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer hover:border-primary transition-colors"
                                                checked={availableStudents.length > 0 && tempSelectedStudents.length === availableStudents.length}
                                                onChange={() => {
                                                    if (tempSelectedStudents.length === availableStudents.length) {
                                                        setTempSelectedStudents([]);
                                                    } else {
                                                        setTempSelectedStudents(availableStudents.map(s => s.username));
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="py-4 px-6 font-bold border-b border-gray-200">Nº Lista</th>
                                        <th className="py-4 px-6 font-bold border-b border-gray-200">Nombre Completo</th>
                                        <th className="py-4 px-6 font-bold border-b border-gray-200">Usuario</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {availableStudents.map(s => (
                                        <tr
                                            key={s.username}
                                            onClick={() => handleToggleStudent(s.username)}
                                            className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${tempSelectedStudents.includes(s.username) ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <td className="py-3 px-6 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer pointer-events-none"
                                                    checked={tempSelectedStudents.includes(s.username)}
                                                    readOnly
                                                />
                                            </td>
                                            <td className="py-3 px-6 text-gray-600 font-medium">
                                                {s.listNumber || '-'}
                                            </td>
                                            <td className="py-3 px-6 text-gray-800 font-bold">
                                                {s.lastname}, {s.firstname}
                                            </td>
                                            <td className="py-3 px-6 text-gray-500 font-mono text-sm">
                                                {s.username}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 relative">
                        <button
                            onClick={() => setCreateGroupStep('MAIN')}
                            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                setCreateGroupForm({ ...createGroupForm, studentsUsername: tempSelectedStudents });
                                setCreateGroupStep('MAIN');
                            }}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">check</span>
                            Confirmar {tempSelectedStudents.length > 0 ? `(${tempSelectedStudents.length})` : ''}
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

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
                        <button
                            onClick={() => setIsCreateWordModalOpen(false)}
                            className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-xl hover:bg-gray-100"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        <form id="createWordForm" onSubmit={submitCreateWord} className="space-y-4">
                            {createWordError && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {createWordError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Palabra en Español *</label>
                                <input
                                    type="text"
                                    name="spanishText"
                                    required
                                    value={createWordForm.spanishText}
                                    onChange={handleCreateWordFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ej. Perro"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Palabra en Mazahua *</label>
                                <input
                                    type="text"
                                    name="mazahuaText"
                                    required
                                    value={createWordForm.mazahuaText}
                                    onChange={handleCreateWordFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ej. T'sïbue"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoría *</label>
                                <input
                                    type="text"
                                    name="category"
                                    required
                                    list="categories-list"
                                    value={createWordForm.category}
                                    onChange={handleCreateWordFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ej. Animales"
                                />
                                <datalist id="categories-list">
                                    {dictionaryCategories.map((cat, idx) => (
                                        <option key={idx} value={cat} />
                                    ))}
                                </datalist>
                                <p className="text-xs text-gray-500 mt-1">Selecciona una existente o escribe una nueva.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Imagen *</label>
                                    <input
                                        type="file"
                                        name="image"
                                        required
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleCreateWordMediaChange}
                                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Audio *</label>
                                    <input
                                        type="file"
                                        name="audio"
                                        required
                                        accept="audio/wav, audio/mpeg"
                                        onChange={handleCreateWordMediaChange}
                                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                        <button
                            type="button"
                            onClick={() => setIsCreateWordModalOpen(false)}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="createWordForm"
                            disabled={isCreatingWord}
                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isCreatingWord ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Guardar Palabra
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderWordsPage = () => {
        if (selectedCategory) {
            return (
                <div className="space-y-6 animate-fade-in-up">
                    {renderCreateWordModal()}
                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <button onClick={() => setSelectedCategory(null)} className="hover:text-primary transition-colors font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Categorías
                            </button>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            <span className="font-bold text-primary truncate max-w-[200px]">{selectedCategory}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setCreateWordForm({ ...createWordForm, category: selectedCategory });
                                    setIsCreateWordModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Nueva Palabra
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
                                            <div className="bg-primary/5 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                                Palabra
                                            </div>
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
                        onClick={() => {
                            setCreateWordForm({ spanishText: '', mazahuaText: '', category: '' });
                            setIsCreateWordModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Crear Palabra
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
                                        Explorar
                                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (currentPath === '/admin/maestros') {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Maestros</h2>
                            <p className="text-gray-500 mt-1">Gestiona los maestros del sistema.</p>
                        </div>
                        <button
                            onClick={() => setIsTeacherModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Crear Maestro
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gray-800">Lista de Maestros</h3>
                                    <button
                                        onClick={fetchTeachers}
                                        disabled={isLoadingTeachers}
                                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-primary transition-colors disabled:opacity-50"
                                        title="Recargar datos"
                                    >
                                        <span className={`material-symbols-outlined text-xl ${isLoadingTeachers ? 'animate-spin' : ''}`}>sync</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {isMultiSelectMode && selectedUsernames.length > 0 && (
                                        <button
                                            onClick={deleteSelectedUsers}
                                            disabled={isDeleting}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            Eliminar Seleccionados ({selectedUsernames.length})
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleMultiSelect}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${isMultiSelectMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                            {isMultiSelectMode ? 'close' : 'checklist'}
                                        </span>
                                        {isMultiSelectMode ? 'Cancelar Acción' : 'Seleccionar Varios'}
                                    </button>
                                </div>
                            </div>

                            {isLoadingTeachers ? (
                                <div className="text-center py-8 text-gray-500">Cargando maestros...</div>
                            ) : teacherFetchError ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                    <span className="material-symbols-outlined block text-4xl mb-2">error</span>
                                    {teacherFetchError}
                                </div>
                            ) : teachersList.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay maestros registrados.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                                {isMultiSelectMode && (
                                                    <th className="py-3 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={teachersList.length > 0 && selectedUsernames.length === teachersList.length}
                                                            onChange={() => handleSelectAll(teachersList)}
                                                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                        />
                                                    </th>
                                                )}
                                                <th className="py-3 px-4 font-medium">Nombre</th>
                                                <th className="py-3 px-4 font-medium">Username</th>
                                                <th className="py-3 px-4 font-medium">Alumnos</th>
                                                <th className="py-3 px-4 font-medium">Grado Asignado</th>
                                                <th className="py-3 px-4 font-medium text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teachersList.map((t, idx) => (
                                                <tr key={idx} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedUsernames.includes(t.username) ? 'bg-primary/5' : ''}`}>
                                                    {isMultiSelectMode && (
                                                        <td className="py-3 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsernames.includes(t.username)}
                                                                onChange={() => handleSelectUser(t.username)}
                                                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                                        {t.lastname}, {t.firstname}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{t.username}</td>
                                                    <td className="py-3 px-4 text-gray-600">{t.students_amount || 0}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                            {t.grade || 'No asignado'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        {/* Ir al grupo button could go here */}
                                                        <button
                                                            onClick={() => deleteUser(t.username)}
                                                            disabled={isDeleting}
                                                            className="text-red-500 hover:text-red-700 font-medium p-2 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Eliminar maestro"
                                                        >
                                                            <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {isTeacherModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {createdTeacherCredentials ? 'Maestro Creado' : 'Crear Nuevo Maestro'}
                                    </h3>
                                    <button
                                        onClick={closeTeacherModal}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                {renderTeacherModalContent()}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (currentPath === '/admin/estudiantes') {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Estudiantes</h2>
                            <p className="text-gray-500 mt-1">Gestiona los estudiantes del sistema.</p>
                        </div>
                        <button
                            onClick={() => setIsStudentModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Crear Estudiante
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gray-800">Lista de Estudiantes</h3>
                                    <button
                                        onClick={fetchStudents}
                                        disabled={isLoadingStudents}
                                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-primary transition-colors disabled:opacity-50"
                                        title="Recargar datos"
                                    >
                                        <span className={`material-symbols-outlined text-xl ${isLoadingStudents ? 'animate-spin' : ''}`}>sync</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {isMultiSelectMode && selectedUsernames.length > 0 && (
                                        <button
                                            onClick={deleteSelectedUsers}
                                            disabled={isDeleting}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            Eliminar Seleccionados ({selectedUsernames.length})
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleMultiSelect}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${isMultiSelectMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                            {isMultiSelectMode ? 'close' : 'checklist'}
                                        </span>
                                        {isMultiSelectMode ? 'Cancelar Acción' : 'Seleccionar Varios'}
                                    </button>
                                </div>
                            </div>

                            {isLoadingStudents ? (
                                <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>
                            ) : studentFetchError ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                    <span className="material-symbols-outlined block text-4xl mb-2">error</span>
                                    {studentFetchError}
                                </div>
                            ) : studentsList.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay estudiantes registrados.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                                {isMultiSelectMode && (
                                                    <th className="py-3 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={studentsList.length > 0 && selectedUsernames.length === studentsList.length}
                                                            onChange={() => handleSelectAll(studentsList)}
                                                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                        />
                                                    </th>
                                                )}
                                                <th className="py-3 px-4 font-medium">Username</th>
                                                <th className="py-3 px-4 font-medium">Nombre Completo</th>
                                                <th className="py-3 px-4 font-medium">Nº de Lista</th>
                                                <th className="py-3 px-4 font-medium">Grado</th>
                                                <th className="py-3 px-4 font-medium">Contraseña</th>
                                                <th className="py-3 px-4 font-medium text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentsList.map((s, idx) => (
                                                <tr key={idx} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedUsernames.includes(s.username) ? 'bg-primary/5' : ''}`}>
                                                    {isMultiSelectMode && (
                                                        <td className="py-3 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsernames.includes(s.username)}
                                                                onChange={() => handleSelectUser(s.username)}
                                                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="py-3 px-4 text-gray-600">{s.username}</td>
                                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                                        {s.lastname}, {s.firstname}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 text-center">
                                                        <span className="inline-block w-8 h-8 leading-8 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                                                            {s.listNumber ?? '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                            {Number(s.grade) > 0 ? `${s.grade}º` : 'No asignado'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                                                        {s.password || '******'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() => deleteUser(s.username)}
                                                            disabled={isDeleting}
                                                            className="text-red-500 hover:text-red-700 font-medium p-2 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Eliminar estudiante"
                                                        >
                                                            <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {isStudentModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {createdStudentCredentials ? 'Estudiante Creado' : 'Crear Nuevo Estudiante'}
                                    </h3>
                                    <button
                                        onClick={closeStudentModal}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                {renderStudentModalContent()}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (currentPath === '/admin/grupos') {
            const gradesList = [1, 2, 3, 4, 5, 6];

            if (activeGroupView !== null) {
                return (
                    <div className="relative">
                        {renderGroupDetailPage()}
                        {renderGroupActionModal()}
                    </div>
                );
            }

            return (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold text-gray-800">Grupos</h2>
                                <button
                                    onClick={fetchGroups}
                                    disabled={isLoadingGroups}
                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-primary transition-colors disabled:opacity-50 mt-1"
                                    title="Recargar datos"
                                >
                                    <span className={`material-symbols-outlined text-xl ${isLoadingGroups ? 'animate-spin' : ''}`}>sync</span>
                                </button>
                            </div>
                            <p className="text-gray-500 mt-1">Gestiona los grupos de la escuela.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                className="px-5 py-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-not-allowed opacity-70 flex items-center gap-2"
                                disabled={true}
                                title="Próximamente"
                            >
                                <span className="material-symbols-outlined text-[18px]">fast_forward</span>
                                Avanzar Grado
                            </button>
                            <button
                                className="px-5 py-2.5 text-red-500 bg-red-50/50 rounded-xl font-medium hover:bg-red-50 transition-colors cursor-not-allowed opacity-70 flex items-center gap-2"
                                disabled={true}
                                title="Próximamente"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                Eliminar
                            </button>
                            <button
                                onClick={() => openCreateGroupModal(false)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl transition-all shadow-md shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5"
                                title="Crear Nuevo Grupo"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                Crear Grupo
                            </button>
                        </div>
                    </div>

                    {groupFetchError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-3 shadow-sm animate-pulse">
                            <span className="material-symbols-outlined">error</span>
                            <span className="font-medium">{groupFetchError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gradesList.map(grade => {
                            if (isLoadingGroups) {
                                return (
                                    <div key={grade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[280px]">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                                            <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Cargando {grade}º...</p>
                                    </div>
                                );
                            }

                            const group = groupsList.find(g => g.grade === grade);

                            if (group) {
                                return (
                                    <div key={grade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 duration-300 h-full group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>

                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 text-primary border border-primary/10 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
                                                {grade}º
                                            </div>
                                            <div className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-green-600 border border-green-200/50 text-xs font-bold uppercase rounded-full tracking-wide shadow-sm flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                Activo
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4 text-gray-600">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Maestro Asignado</span>
                                                    <span className="font-semibold text-gray-800 text-sm truncate" title={group.teacher ? `${group.teacher.lastname}, ${group.teacher.firstname}` : 'Sin Asignar'}>
                                                        {group.teacher ? `${group.teacher.lastname}, ${group.teacher.firstname}` : 'Sin Asignar'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-gray-600">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    <span className="material-symbols-outlined text-gray-400 text-[22px]">groups</span>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Estudiantes</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-black text-gray-800 text-lg">{group.totalStudents || 0}</span>
                                                        <span className="text-gray-500 text-sm font-medium">inscritos</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openGroupPage(group)}
                                            className="w-full mt-8 py-3 bg-gray-50 hover:bg-primary text-gray-600 hover:text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/button"
                                        >
                                            Ver Estudiantes
                                            <span className="material-symbols-outlined text-[18px] transition-transform group-hover/button:translate-x-1">arrow_forward</span>
                                        </button>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={grade} className="bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center min-h-[294px] transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 group">
                                        <div className="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center text-3xl font-black mb-5 shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                            {grade}º
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-400 mb-1">Sin Asignar</h3>
                                        <p className="text-sm text-gray-400 text-center mb-8 max-w-[200px] leading-relaxed">
                                            No existe un grupo creado para este grado escolar.
                                        </p>
                                        <button
                                            onClick={() => openCreateGroupModal(true, grade)}
                                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:text-primary hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 transition-all text-sm flex items-center gap-2"
                                            title="Crear este grupo"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                            Crear Grupo
                                        </button>
                                    </div>
                                );
                            }
                        })}
                    </div>

                    {/* Create Group Modal */}
                    {isCreateGroupModalOpen && (
                        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full max-w-2xl max-h-[90vh] animate-slide-up">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined">add_circle</span>
                                        </div>
                                        Crear Nuevo Grupo
                                    </h3>
                                    <button
                                        onClick={closeCreateGroupModal}
                                        className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-xl hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                {renderCreateGroupModalContent()}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (currentPath === '/admin/palabras') {
            return renderWordsPage();
        }

        // Default Admin Dashboard Content
        return (
            <div className="text-center py-20">
                <span className="material-symbols-outlined text-7xl text-gray-300 mb-4 block">construction</span>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sección en Construcción</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Actualmente este panel se encuentra en construcción.
                    Pronto se añadirán herramientas para gestionar {currentPath.split('/').pop()}.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                    <Link to="/admin/dashboard" className="hover:text-primary transition-colors font-medium">Admin Panel</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    {currentPath === '/admin/grupos' && activeGroupView !== null ? (
                        <>
                            <button onClick={closeGroupPage} className="hover:text-primary transition-colors font-medium capitalize">grupos</button>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            <span className="text-gray-800 font-bold">{activeGroupView}º Grado</span>
                        </>
                    ) : (
                        <span className="text-gray-800 font-bold capitalize">
                            {currentPath.split('/').filter(Boolean).pop() || 'Dashboard'}
                        </span>
                    )}
                    <div className="ml-auto">
                        <Link to="/" className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Cerrar Sesión / Salir
                        </Link>
                    </div>
                </nav>

                {renderContent()}
            </main>
        </div>
    );
};
export default AdminDashboard;
