import React, { useState } from 'react';

/**
 * Componente de Pie de Página (Footer).
 * Incluye navegación secundaria, redes sociales y suscripción al boletín.
 */
const Footer = () => {
    const [email, setEmail] = useState("");

    // Función para manejar la suscripción al boletín (Conexión a la API)
    const handleSubscribe = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            const result = await response.json();
            alert(result.message);
            setEmail(""); // Limpiar campo tras éxito
        } catch (error) {
            console.error("Error en suscripción:", error);
        }
    };

    return (
        <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-white/10 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* COLUMNA 1: Identidad y Misión */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-dark dark:text-primary">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h2 className="text-lg font-bold text-text-main-light dark:text-white">NTS'I FÍYO</h2>
                        </div>
                        <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-6">
                            Empoderando a la próxima generación para hablar, vivir y celebrar la lengua Mazahua.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-text-sub-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">public</span>
                            </a>
                            <a href="#" className="text-text-sub-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">mail</span>
                            </a>
                        </div>
                    </div>

                    {/* COLUMNA 2: Enlaces de Aprendizaje */}
                    <div>
                        <h3 className="font-bold text-text-main-light dark:text-white mb-4">Aprender</h3>
                        <ul className="space-y-3 text-sm text-text-sub-light dark:text-text-sub-dark">
                            <li><a className="hover:text-primary transition-colors" href="#">Cursos</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Diccionario</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Guía de Gramática</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Pronunciación</a></li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: Comunidad */}
                    <div>
                        <h3 className="font-bold text-text-main-light dark:text-white mb-4">Comunidad</h3>
                        <ul className="space-y-3 text-sm text-text-sub-light dark:text-text-sub-dark">
                            <li><a className="hover:text-primary transition-colors" href="#">Para Docentes</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Foro de Discusión</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Eventos</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                        </ul>
                    </div>

                    {/* COLUMNA 4: Boletín (Newsletter) */}
                    <div>
                        <h3 className="font-bold text-text-main-light dark:text-white mb-4">Boletín Informativo</h3>
                        <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-4">
                            Suscríbete para recibir lecciones semanales y novedades culturales.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input
                                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/20 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Tu correo electrónico"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="w-full px-4 py-2 text-sm font-bold text-surface-dark bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>

                {/* BARRA INFERIOR: Copyright y Legales */}
                <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        © 2026 NTS'I FÍYO. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 text-xs text-text-sub-light dark:text-text-sub-dark">
                        <a className="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
                        <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;