import React, { useState } from 'react';
import '../styles/components/nosotros/NosotrosPage.css';

/* ══════════════════════════════════════════════════════════
   DATOS – nombres ficticios por categoría
   ══════════════════════════════════════════════════════════ */

const sections = [
    {
        id: 'desarrolladores',
        icon: 'code',
        label: 'Desarrolladores',
        color: '#6C63FF',
        gradient: 'linear-gradient(135deg, #6C63FF22 0%, #a78bfa22 100%)',
        border: '#6C63FF',
        description: 'El equipo que diseñó, programó y dio vida a esta plataforma educativa.',
        members: [
            { name: 'Alejandra Morales Soto', role: 'Diseño UI/UX & Frontend' },
            { name: 'Diego Ramírez Fuentes', role: 'Desarrollo Backend & API' },
            { name: 'Camila Torres Mendoza', role: 'Frontend & Animaciones' },
            { name: 'Óscar Hernández Ríos', role: 'Base de datos & DevOps' },
            { name: 'Sofía Vargas Pimentel', role: 'QA & Pruebas de usuario' },
            { name: 'Iván Cruz Delgado', role: 'Integración de audio y media' },
        ],
    },
    {
        id: 'ninos',
        icon: 'child_care',
        label: 'Niños que prestaron sus voces',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B22 0%, #fde68a22 100%)',
        border: '#F59E0B',
        description: 'Pequeños que grabaron palabras, frases y canciones en Mazahua para dar vida a los juegos.',
        members: [
            { name: 'Emiliano Sánchez Juárez', role: 'Vocabulario – Nivel 1' },
            { name: 'Valentina Reyes Ávila', role: 'Canciones tradicionales' },
            { name: 'Mateo González Flores', role: 'Vocabulario – Nivel 2' },
            { name: 'Lucía Benítez Castro', role: 'Cuentos cortos' },
            { name: 'Sebastián López Ortega', role: 'Frases cotidianas' },
            { name: 'Isabella Martínez León', role: 'Vocabulario – Nivel 1' },
            { name: 'Tomás Gutiérrez Peña', role: 'Canciones tradicionales' },
            { name: 'Mía Romero Salinas', role: 'Frases cotidianas' },
        ],
    },
    {
        id: 'maestros',
        icon: 'school',
        label: 'Maestros y adultos hablantes',
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #10B98122 0%, #a7f3d022 100%)',
        border: '#10B981',
        description: 'Maestros bilingües y adultos de la comunidad que grabaron historias y validaron el contenido lingüístico.',
        members: [
            { name: 'Profa. Rosa Elena Chávez', role: 'Revisión lingüística & grabación' },
            { name: 'Prof. Aurelio Jiménez Nava', role: 'Historias tradicionales' },
            { name: 'Doña Carmen Rojas Barrera', role: 'Canciones y refranes' },
            { name: 'Prof. Ernesto Velázquez Mora', role: 'Grabación – Nivel avanzado' },
            { name: 'Profa. Graciela Mondragón', role: 'Corrección fonética' },
            { name: 'Don Felipe Ángeles Cruz', role: 'Narración de cuentos' },
        ],
    },
    {
        id: 'colaboradores',
        icon: 'diversity_3',
        label: 'Otros colaboradores',
        color: '#EC4899',
        gradient: 'linear-gradient(135deg, #EC489922 0%, #fbcfe822 100%)',
        border: '#EC4899',
        description: 'Personas de la comunidad y organizaciones que compartieron historias, canciones y materiales culturales.',
        members: [
            { name: 'Sra. Dolores Estrada Vega', role: 'Recopilación de canciones' },
            { name: 'Lic. Héctor Muñoz Paredes', role: 'Asesoría cultural' },
            { name: 'Centro Comunitario "Raíces"', role: 'Espacios de grabación' },
            { name: 'Familia Pérez Xicotencatl', role: 'Cuentos y tradiciones orales' },
            { name: 'Sra. Bertha Álvarez Lozano', role: 'Canciones de cuna Mazahua' },
            { name: 'INALI – Delegación Estado de México', role: 'Materiales de referencia' },
        ],
    },
];

/* ══════════════════════════════════════════════════════════
   COMPONENTE TARJETA DE MIEMBRO
   ══════════════════════════════════════════════════════════ */
const MemberCard = ({ name, role, color }) => (
    <div
        className="nosotros-member-card"
        style={{ '--accent': color }}
    >
        <div className="nosotros-member-avatar" style={{ background: color + '22', color }}>
            {name.charAt(0)}
        </div>
        <div className="nosotros-member-info">
            <p className="nosotros-member-name">{name}</p>
            <p className="nosotros-member-role">{role}</p>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════
   COMPONENTE SECCIÓN
   ══════════════════════════════════════════════════════════ */
const Section = ({ section }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <section
            id={section.id}
            className="nosotros-section"
            style={{ '--section-color': section.color, '--section-gradient': section.gradient, '--section-border': section.border }}
        >
            {/* Header */}
            <button
                className="nosotros-section-header"
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded}
            >
                <div className="nosotros-section-icon-wrap" style={{ background: section.color + '20', color: section.color }}>
                    <span className="material-symbols-outlined nosotros-section-icon">{section.icon}</span>
                </div>
                <div className="nosotros-section-title-group">
                    <h2 className="nosotros-section-title">{section.label}</h2>
                    <p className="nosotros-section-desc">{section.description}</p>
                </div>
                <span
                    className="material-symbols-outlined nosotros-chevron"
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    expand_more
                </span>
            </button>

            {/* Members grid */}
            {expanded && (
                <div className="nosotros-members-grid">
                    {section.members.map((m, i) => (
                        <MemberCard key={i} {...m} color={section.color} />
                    ))}
                </div>
            )}
        </section>
    );
};

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════════════════════════════════ */
const NosotrosPage = () => {
    return (
        <div className="nosotros-page">
            {/* ── Hero ── */}
            <div className="nosotros-hero">
                <div className="nosotros-hero-glow nosotros-hero-glow-left" />
                <div className="nosotros-hero-glow nosotros-hero-glow-right" />

                <div className="nosotros-hero-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>favorite</span>
                    Hecho con amor por la comunidad
                </div>

                <h1 className="nosotros-hero-title">
                    Quiénes somos
                </h1>
                <p className="nosotros-hero-subtitle">
                    Nts'i Fíyo es un proyecto colectivo. Detrás de cada palabra, juego y sonido
                    hay personas reales que creyeron en la preservación de la lengua Mazahua.
                </p>

                {/* Contador de contribuyentes */}
                <div className="nosotros-stats">
                    {sections.map(s => (
                        <div key={s.id} className="nosotros-stat">
                            <span className="nosotros-stat-number" style={{ color: s.color }}>
                                {s.members.length}
                            </span>
                            <span className="nosotros-stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Secciones ── */}
            <div className="nosotros-sections-container">
                {sections.map(s => (
                    <Section key={s.id} section={s} />
                ))}
            </div>

            {/* ── Cierre ── */}
            <div className="nosotros-footer-note">
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#6C63FF', opacity: 0.6 }}>auto_stories</span>
                <p>
                    Este proyecto fue posible gracias al apoyo de las comunidades Mazahua de
                    San Felipe del Progreso y San José del Rincón, Estado de México.
                </p>
            </div>
        </div>
    );
};

export default NosotrosPage;
