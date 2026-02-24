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
        // Obtener la palabra del día (GET /api/dictionary/words/daily)
        apiConfig.get('/api/dictionary/words/daily')
            .then(data => setPageData(data))
            .catch(err => {
                console.warn("Usando datos locales por falta de conexión al backend:", err);
                setPageData({
                    id: 0,
                    spanishText: "Habla bien",
                    mazahuaText: "Ki jñaa kjo"
                });
            });
    }, []);

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