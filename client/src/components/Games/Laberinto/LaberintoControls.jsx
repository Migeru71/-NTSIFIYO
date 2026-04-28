import React, { useEffect } from 'react';

const LaberintoControls = ({ onMove, onSelect, isSelectEnabled }) => {
    // Escuchar el teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            const consumed = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'];
            if (consumed.includes(e.key)) e.preventDefault();
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    onMove(0, -1);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    onMove(1, 0);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    onMove(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    onMove(-1, 0);
                    break;
                case 'Enter':
                case ' ':
                    if (isSelectEnabled) onSelect();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onMove, onSelect, isSelectEnabled]);

    return (
        <div className="laberinto-controls-container">
            <div className="laberinto-dpad">
                <button className="dpad-btn up" onClick={() => onMove(0, -1)}>▲</button>
                <button className="dpad-btn left" onClick={() => onMove(-1, 0)}>◀</button>
                <div className="dpad-center"></div>
                <button className="dpad-btn right" onClick={() => onMove(1, 0)}>▶</button>
                <button className="dpad-btn down" onClick={() => onMove(0, 1)}>▼</button>
            </div>
            
            <div className="laberinto-actions">
                <button 
                    className={`laberinto-action-btn ${isSelectEnabled ? 'enabled' : 'disabled'}`} 
                    onClick={onSelect}
                    disabled={!isSelectEnabled}
                >
                    Seleccionar
                </button>
            </div>
        </div>
    );
};

export default LaberintoControls;
