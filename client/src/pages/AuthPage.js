import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

const AuthPage = () => {
    const location = useLocation();
    const [authMode, setAuthMode] = useState(location.state?.mode || 'login');
    const [userType, setUserType] = useState('student');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para el login del estudiante
    const [studentName, setStudentName] = useState('');
    const [magicNumber, setMagicNumber] = useState('');
    const [grade, setGrade] = useState('');
    const [nameError, setNameError] = useState('');

    // Estados para login de maestro/visitante
    const [teacherUsername, setTeacherUsername] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados para registro de visitante
    const [registerName, setRegisterName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');

    // Grados disponibles
    const grades = [
        { value: '1', label: '1º Primero' },
        { value: '2', label: '2º Segundo' },
        { value: '3', label: '3º Tercero' },
        { value: '4', label: '4º Cuarto' },
        { value: '5', label: '5º Quinto' },
        { value: '6', label: '6º Sexto' }
    ];

    // Función para validar y formatear el nombre
    const formatName = (name) => {
        return name
            .split(' ')
            .map(word => {
                if (word.length === 0) return '';
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
    };

    // Función para validar el nombre
    const validateName = (name) => {
        if (!name.trim()) {
            return 'Por favor ingresa tu nombre';
        }

        const words = name.trim().split(/\s+/);
        for (const word of words) {
            if (word.length === 0) continue;

            // Verificar que la primera letra sea mayúscula
            if (word.charAt(0) !== word.charAt(0).toUpperCase()) {
                return 'La primera letra de cada nombre debe ser mayúscula';
            }

            // Verificar que el resto sean minúsculas
            const rest = word.slice(1);
            if (rest !== rest.toLowerCase()) {
                return 'Las demás letras deben ser minúsculas';
            }
        }

        return '';
    };

    // Manejar cambio de nombre con formateo automático
    const handleNameChange = (e) => {
        const value = e.target.value;
        const formatted = formatName(value);
        setStudentName(formatted);
        setNameError('');
    };

    // Validar antes de enviar
    const handleStudentLogin = () => {
        const error = validateName(studentName);
        if (error) {
            setNameError(error);
            return false;
        }
        if (!magicNumber.trim()) {
            setNameError('Por favor ingresa tu número mágico');
            return false;
        }
        if (!grade) {
            setNameError('Por favor selecciona tu grado');
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (location.state?.mode) setAuthMode(location.state.mode);
    }, [location.state]);

    return (
        <div className="flex min-h-screen w-full flex-row overflow-hidden bg-white">
            {/* PANEL IZQUIERDO: Visual (Se mantiene igual) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary-dark flex-col justify-center items-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('../../../public_html/media/images/Traditional Hungarian Patterns.jpeg')" }}
                ></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent"></div>
                <div className="relative z-20 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">language</span>
                        <h3 className="text-white text-xl font-bold uppercase tracking-widest">NTS'I FÍYO</h3>
                    </div>
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">Preserva el patrimonio.<br />Habla el futuro.</h1>
                </div>
            </div>

            {/* PANEL DERECHO: Formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md flex flex-col gap-8">

                    {/* Toggle Login/Register */}
                    <div className="bg-orange-50 p-1.5 rounded-xl flex w-full border border-primary/10">
                        <button onClick={() => setAuthMode('login')} className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>Iniciar Sesión</button>
                        <button onClick={() => { setAuthMode('register'); setUserType('guest'); }} className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all ${authMode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>Registrarse</button>
                    </div>

                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-primary-dark tracking-tight">{authMode === 'login' ? '¡Hola de nuevo!' : 'Crea una cuenta'}</h2>
                        <p className="text-gray-500">{userType === 'student' ? 'Escribe tu nombre y número mágico para entrar.' : 'Nos alegra verte otra vez.'}</p>
                    </div>

                    {authMode === 'login' && (
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-primary-dark pl-1">Soy un...</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['student', 'teacher', 'guest'].map((type) => (
                                    <button key={type} onClick={() => setUserType(type)} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all h-28 ${userType === type ? 'border-primary bg-orange-50' : 'border-transparent bg-white shadow-sm hover:border-primary/30'}`}>
                                        <span className={`material-symbols-outlined text-3xl ${userType === type ? 'text-primary' : 'text-gray-400'}`}>{type === 'student' ? 'face' : type === 'teacher' ? 'school' : 'person'}</span>
                                        <span className="text-xs font-medium text-primary-dark">{type === 'student' ? 'Niño' : type === 'teacher' ? 'Maestro' : 'Visitante'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FORMULARIO DINÁMICO */}
                    <div className="flex flex-col gap-6">
                        {userType === 'student' && authMode === 'login' ? (
                            /* --- LOGIN DEL ESTUDIANTE --- */
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Campo de Nombre */}
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-primary-dark uppercase tracking-wider">Tu Nombre Completo</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 material-symbols-outlined">person</span>
                                        <input
                                            className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl text-lg font-medium text-primary-dark focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-gray-300 ${nameError ? 'border-red-300' : 'border-orange-100'}`}
                                            placeholder="Ej. Maria Gonzalez"
                                            value={studentName}
                                            onChange={handleNameChange}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 pl-1">Primera letra mayúscula, el resto minúsculas</p>
                                </div>

                                {/* Campo de Número Mágico */}
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-primary-dark uppercase tracking-wider">Tu Número Mágico</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 material-symbols-outlined">tag</span>
                                        <input
                                            type="number"
                                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-100 rounded-2xl text-lg font-medium text-center text-primary-dark focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="Ej. 15"
                                            value={magicNumber}
                                            onChange={(e) => setMagicNumber(e.target.value)}
                                            min="1"
                                            max="99"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 pl-1">Tu número de lista o número asignado</p>
                                </div>

                                {/* Selector de Grado */}
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-primary-dark uppercase tracking-wider">Tu Grado Escolar</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 material-symbols-outlined">school</span>
                                        <select
                                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-100 rounded-2xl text-lg font-medium text-primary-dark focus:border-primary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                        >
                                            <option value="" disabled>Selecciona tu grado...</option>
                                            {grades.map((g) => (
                                                <option key={g.value} value={g.value}>{g.label}</option>
                                            ))}
                                        </select>
                                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                {/* Mensaje de Error */}
                                {nameError && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        <span>{nameError}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* --- LOGIN / REGISTRO ESTÁNDAR --- */
                            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                {authMode === 'register' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-primary-dark">Nombre Completo</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 material-symbols-outlined">badge</span>
                                                <input
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    placeholder="Ej. Maria Gonzalez"
                                                    type="text"
                                                    value={registerName}
                                                    onChange={(e) => setRegisterName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-primary-dark">Nombre de Usuario</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 material-symbols-outlined">person</span>
                                                <input
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    placeholder="Ej. maria_gonzalez"
                                                    type="text"
                                                    value={registerUsername}
                                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Usuario para Maestro, Email para Visitante */}
                                {userType === 'teacher' ? (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-primary-dark">Usuario</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 material-symbols-outlined">person</span>
                                            <input
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                placeholder="Ej. maestro.gonzalez"
                                                type="text"
                                                value={teacherUsername}
                                                onChange={(e) => setTeacherUsername(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-primary-dark">Correo Electrónico</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 material-symbols-outlined">mail</span>
                                            <input
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                placeholder="nombre@ejemplo.com"
                                                type="email"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-primary-dark">Contraseña</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 material-symbols-outlined">lock</span>
                                        <input
                                            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </form>
                        )}

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                setNameError('');

                                try {
                                    // Si es estudiante y está haciendo login
                                    if (authMode === 'login' && userType === 'student') {
                                        if (!handleStudentLogin()) {
                                            setIsLoading(false);
                                            return;
                                        }

                                        const response = await AuthService.login({
                                            username: studentName,
                                            password: magicNumber,
                                            userType: 'STUDENT',
                                            grade: parseInt(grade)
                                        });

                                        if (response.success) {
                                            await UserService.startSession();
                                            window.location.href = '/estudiante/dashboard';
                                        } else {
                                            setNameError(response.error || 'Error al iniciar sesión');
                                        }
                                    } else if (authMode === 'login' && userType === 'teacher') {
                                        if (!teacherUsername || !password) {
                                            setNameError('Por favor completa todos los campos');
                                            setIsLoading(false);
                                            return;
                                        }

                                        const response = await AuthService.login({
                                            username: teacherUsername,
                                            password: password,
                                            userType: 'TEACHER'
                                        });

                                        if (response.success) {
                                            await UserService.startSession();
                                            window.location.href = '/maestro/dashboard';
                                        } else {
                                            setNameError(response.error || 'Credenciales incorrectas');
                                        }
                                    } else if (authMode === 'login' && userType === 'guest') {
                                        if (!guestEmail || !password) {
                                            setNameError('Por favor completa todos los campos');
                                            setIsLoading(false);
                                            return;
                                        }

                                        const response = await AuthService.login({
                                            username: guestEmail,
                                            password: password,
                                            userType: 'VISITOR'
                                        });

                                        if (response.success) {
                                            await UserService.startSession();
                                            window.location.href = '/estudiante/dashboard';
                                        } else {
                                            setNameError(response.error || 'Credenciales incorrectas');
                                        }
                                    } else if (authMode === 'register') {
                                        // Registro de visitante
                                        if (!registerName || !guestEmail || !password || !registerUsername) {
                                            setNameError('Por favor completa todos los campos');
                                            setIsLoading(false);
                                            return;
                                        }

                                        const nameParts = registerName.trim().split(' ');
                                        const response = await AuthService.registerVisitor({
                                            firstname: nameParts[0] || '',
                                            lastname: nameParts.slice(1).join(' ') || '',
                                            email: guestEmail,
                                            password: password,
                                            username: registerUsername
                                        });

                                        if (response.success) {
                                            setAuthMode('login');
                                            setNameError('');
                                            alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                                        } else {
                                            setNameError(response.error || 'Error al crear cuenta');
                                        }
                                    }
                                } catch (error) {
                                    setNameError('Error de conexión. Intenta de nuevo.');
                                    console.error('Login error:', error);
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            className={`w-full mt-4 py-4 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 text-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span>Cargando...</span>
                                </>
                            ) : (
                                <>
                                    <span>{authMode === 'login' ? '¡Entrar a Clase!' : 'Crear Cuenta'}</span>
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-sm text-gray-400">O continúa con</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white">
                            <img alt="Google" className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                            <span className="text-sm font-medium">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white">
                            <span className="material-symbols-outlined text-[22px]">apple</span>
                            <span className="text-sm font-medium">Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;