import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RoleSelection from '../components/RoleSelection';
import CultureSection from '../components/CultureSection';
import FeaturesGrid from '../components/FeaturesGrid';
import Footer from '../components/Footer';
import apiConfig from '../services/apiConfig';

const Home = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        setPageData({
            hero: { badge: "Versión de Desarrollo", student_count: "500+" },
            daily_phrase: { phrase: "Ki jñaa kjo", translation: "Habla bien" }
        });

        //     // Obtener datos del backend Node.js (GET /api/home)
        //     apiConfig.get('/api/home')
        //         .then(data => setPageData(data))
        //         .catch(err => {
        //             console.warn("Usando datos locales por falta de conexión al backend:", err);
        //             // DATOS DE RESPALDO (Para que la página cargue aunque el servidor esté apagado)
        //             setPageData({
        //                 hero: { badge: "Versión de Desarrollo", student_count: "500+" },
        //                 daily_phrase: { phrase: "Ki jñaa kjo", translation: "Habla bien" }
        //             });
        //         });
    }, []);

    if (!pageData) return <div className="p-20 text-center">Cargando herencia Mazahua...</div>;

    return (
        <>
            <Hero stats={pageData} />
            <RoleSelection />
            <CultureSection />
            <FeaturesGrid />
            <Footer />
        </>
    );
};

export default Home;