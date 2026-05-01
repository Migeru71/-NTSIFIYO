import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MediaService from '../../services/MediaService';
import '../../styles/components/common/mediaPlayerStyles.css';

const MediaPlayerView = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    // Estado de carga y datos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mediaData, setMediaData] = useState(null);
    
    // Subtítulos
    const [currentMazText, setCurrentMazText] = useState('');
    const [currentEspText, setCurrentEspText] = useState('');
    
    // Controles del video
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Configuración heredada (o por defecto)
    const title = location.state?.title || 'Contenido Multimedia';
    const allowSpanishToggle = location.state?.allowSpanishToggle ?? true;
    const [showSpanish, setShowSpanish] = useState(false);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const streamData = await MediaService.getMediaStream(id);
                setMediaData(streamData);
            } catch (err) {
                console.error("Error cargando el reproductor:", err);
                setError("No se pudo cargar el contenido. Por favor intenta más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [id]);

    useEffect(() => {
        // Asegurar que las pistas (tracks) estén en modo 'hidden' para que no se rendericen
        // nativamente sobre el video, pero sí disparen eventos de cuechange.
        if (videoRef.current && mediaData) {
            const tracks = videoRef.current.textTracks;
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = 'hidden';
            }
        }
    }, [mediaData]);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleMazahuaCueChange = (e) => {
        const activeCues = e.target.track.activeCues;
        if (activeCues && activeCues.length > 0) {
            setCurrentMazText(activeCues[0].text);
        } else {
            setCurrentMazText('');
        }
    };

    const handleSpanishCueChange = (e) => {
        const activeCues = e.target.track.activeCues;
        if (activeCues && activeCues.length > 0) {
            setCurrentEspText(activeCues[0].text);
        } else {
            setCurrentEspText('');
        }
    };

    if (loading) {
        return (
            <div className="media-player-container player-loading">
                <div className="spinner"></div>
                <p>Cargando multimedia...</p>
            </div>
        );
    }

    if (error || !mediaData) {
        return (
            <div className="media-player-container player-loading">
                <p style={{ color: '#ef4444' }}>{error || 'Error desconocido'}</p>
                <button className="btn-back" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    return (
        <div className="media-player-container">
            <div className="player-header">
                <h2 className="player-title">{title}</h2>
                <button className="btn-back" onClick={() => navigate(-1)}>✕ Cerrar</button>
            </div>

            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    className="main-video"
                    crossOrigin="anonymous"
                    src={mediaData.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                >
                    {mediaData.mazSubtitlesUrl && (
                        <track
                            kind="metadata"
                            src={mediaData.mazSubtitlesUrl}
                            srcLang="maz"
                            label="Mazahua"
                            default
                            onCueChange={handleMazahuaCueChange}
                        />
                    )}
                    {mediaData.espSubtitlesUrl && (
                        <track
                            kind="metadata"
                            src={mediaData.espSubtitlesUrl}
                            srcLang="es"
                            label="Español"
                            default
                            onCueChange={handleSpanishCueChange}
                        />
                    )}
                </video>
            </div>

            <div className="custom-controls">
                <div className="progress-bar-wrapper">
                    <span className="time-display">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="progress-slider"
                    />
                    <span className="time-display">{formatTime(duration)}</span>
                </div>
                
                <div className="controls-row">
                    <button className="btn-control" onClick={togglePlay}>
                        {isPlaying ? '⏸' : '▶️'}
                    </button>

                    {allowSpanishToggle && (
                        <div className="subtitles-options">
                            <span className="subtitles-label">Traducción (Esp)</span>
                            <label className="subtitle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={showSpanish} 
                                    onChange={e => setShowSpanish(e.target.checked)} 
                                />
                                <span className="subtitle-slider"></span>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            <div className="subtitles-display">
                <p className="sub-mazahua">{currentMazText || '...'}</p>
                {allowSpanishToggle && showSpanish && (
                    <p className="sub-spanish">{currentEspText || '...'}</p>
                )}
            </div>
        </div>
    );
};

export default MediaPlayerView;
