import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaService, { ContentType } from '../../services/MediaService';
import '../../styles/components/common/contentSectionStyles.css';

const TABS = [
    { id: ContentType.POEMAS, label: 'Poemas', icon: '📜' },
    { id: ContentType.LEYENDAS, label: 'Leyendas', icon: '🗺️' },
    { id: ContentType.CUENTOS, label: 'Cuentos', icon: '📖' },
    { id: ContentType.CANCIONES, label: 'Canciones', icon: '🎵' }
];

const ContentSection = () => {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        MediaService.getMediaByType(activeTab)
            .then(data => {
                if (Array.isArray(data)) setMediaItems(data);
                else if (data && Array.isArray(data.data)) setMediaItems(data.data);
                else setMediaItems([]);
            })
            .catch(err => {
                console.error("Error fetching media:", err);
                setMediaItems([]);
            })
            .finally(() => setLoading(false));
    }, [activeTab]);

    const handlePlay = (item) => {
        // En una vista de navegación libre (no actividad), podríamos pasar un flag por default.
        // Pero como se requiere que allowSpanishToggle esté en la actividad, aquí asumimos true
        // o navegamos directamente al reproductor con la configuración por defecto.
        navigate(`/reproductor/${item.id}`, { state: { allowSpanishToggle: true, title: item.title } });
    };

    return (
        <div className="content-section-container">
            <div className="content-header">
                <h1 className="content-title">Explorar Contenido</h1>
                <p className="content-subtitle">Descubre y aprende con material multimedia en mazahua.</p>
            </div>

            <div className="content-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`content-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="content-grid">
                {loading ? (
                    <div className="content-loading">Cargando...</div>
                ) : mediaItems.length > 0 ? (
                    mediaItems.map(item => (
                        <div key={item.id} className="media-card" onClick={() => setSelectedItem(item)}>
                            <div className="media-img-wrapper">
                                {item.overviewImage ? (
                                    <img src={item.overviewImage} alt={item.title} className="media-img" />
                                ) : (
                                    <div className="media-img-placeholder">
                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>{TABS.find(t => t.id === activeTab)?.icon}</span>
                                    </div>
                                )}
                                <div className="media-duration">{item.duration}s</div>
                            </div>
                            <div className="media-info">
                                <h3 className="media-title">{item.title}</h3>
                                <p className="media-diff">{item.difficult}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="content-empty">No hay contenido disponible para esta categoría.</div>
                )}
            </div>

            {selectedItem && (
                <div className="media-modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="media-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
                        {selectedItem.overviewImage && (
                            <img src={selectedItem.overviewImage} alt={selectedItem.title} className="modal-img" />
                        )}
                        <h2 className="modal-title">{selectedItem.title}</h2>
                        <div className="modal-meta">
                            <span><span className="material-symbols-outlined" style={{ verticalAlign: 'middle', fontSize: '1rem', marginRight: '4px' }}>schedule</span> {selectedItem.duration}s</span>
                            <span><span className="material-symbols-outlined" style={{ verticalAlign: 'middle', fontSize: '1rem', marginRight: '4px' }}>signal_cellular_alt</span> Dificultad: {selectedItem.difficult}</span>
                        </div>
                        <p className="modal-desc">{selectedItem.description || 'Sin descripción disponible.'}</p>
                        <div className="modal-actions">
                            <button className="btn-play flex items-center justify-center gap-2" onClick={() => handlePlay(selectedItem)}>
                                <span className="material-symbols-outlined">play_circle</span> Comenzar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentSection;
