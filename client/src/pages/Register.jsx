import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

/**
 * Componente de Registro de Usuario.
 * Integra validaciones frontend y comunicación con el backend PHP.
 */
const Register = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // Estado del formulario siguiendo el esquema de la base de datos
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'student' // 'student' por defecto según el diseño
    });

    // Estado para mensajes de error de validación
    const [errors, setErrors] = useState({});

    /**
     * Valida los campos del formulario antes de intentar la conexión.
     */
    const validateForm = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.fullName.trim()) tempErrors.fullName = "El nombre es obligatorio.";
        if (!formData.email) {
            tempErrors.email = "El correo es obligatorio.";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "El formato de correo no es válido.";
        }
        if (formData.password.length < 8) {
            tempErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    /**
     * Maneja el envío de datos al backend Node.js de forma asíncrona.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('https://mild-donella-daniel7g-b3e46241.koyeb.app/api/auth/visitor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok && result.status === "success") {
                    showAlert({
                        mode: 'success',
                        title: '¡Éxito!',
                        message: result.message
                    });
                    // Opcional: Redirigir al usuario al login tras éxito
                    // navigate('/login'); 
                } else {
                    showAlert({
                        mode: 'error',
                        title: 'Error del servidor',
                        message: result.message
                    });
                }
            } catch (error) {
                console.error("Error de conexión:", error);
                showAlert({
                    mode: 'error',
                    title: 'Error de conexión',
                    message: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
                });
            }
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/5">
                <h2 className="text-3xl font-bold mb-2">Crear cuenta</h2>
                <p className="text-text-sub-light dark:text-text-sub-dark mb-8 text-sm">
                    Inicia tu camino hacia la fluidez hoy mismo.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* SELECCIÓN DE ROL (Añadido) */}
                    <div>
                        <label className="block text-sm font-bold mb-3 text-text-main-light dark:text-white">Yo soy un...</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'student', label: 'Alumno', icon: 'school' },
                                { id: 'teacher', label: 'Docente', icon: 'cast_for_education' },
                                { id: 'guest', label: 'Visitante', icon: 'person' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: item.id })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.role === item.id
                                        ? 'border-primary bg-primary/10 text-primary-dark dark:text-primary'
                                        : 'border-gray-100 dark:border-white/10 opacity-60'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-2xl mb-1">{item.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CAMPO: NOMBRE COMPLETO */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Ej. Maria Gonzalez"
                            className={`w-full h-11 px-4 rounded-lg border bg-transparent outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    {/* CAMPO: CORREO */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                        <input
                            type="text"
                            placeholder="nombre@ejemplo.com"
                            className={`w-full h-11 px-4 rounded-lg border bg-transparent outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* CAMPO: CONTRASEÑA */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full h-11 px-4 rounded-lg border bg-transparent outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {errors.password ? (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        ) : (
                            <p className="text-[10px] text-text-sub-light mt-1">Mínimo 8 caracteres</p>
                        )}
                    </div>

                    <button type="submit" className="w-full h-12 bg-primary text-surface-dark font-bold rounded-lg hover:bg-primary-dark transition-all transform active:scale-95 shadow-lg shadow-primary/20">
                        Crear Cuenta
                    </button>
                </form>

                {/* BOTONES SOCIALES (Añadido para completar el diseño) */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-white/10"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-surface-dark px-2 text-text-sub-light">O continuar con</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center h-11 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4 mr-2" alt="Google" />
                        <span className="text-xs font-bold">Google</span>
                    </button>
                    <button className="flex items-center justify-center h-11 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <img src="https://www.svgrepo.com/show/448206/apple.svg" className="h-4 w-4 mr-2" alt="Apple" />
                        <span className="text-xs font-bold">Apple</span>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Register;