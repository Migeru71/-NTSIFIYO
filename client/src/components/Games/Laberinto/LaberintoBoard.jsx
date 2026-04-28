import React, { useRef, useEffect, useState } from 'react';
import GameCard from '../GameCard/GameCard';

const LaberintoBoard = ({
    grid,
    entrances,
    exits,
    avatarPos,
    activeItem,
    pathTraced,
    completedPairs
}) => {
    const boardRef = useRef(null);
    const [cellSize, setCellSize] = useState(0);

    useEffect(() => {
        const updateSize = () => {
            if (boardRef.current && grid.length > 0) {
                const rect = boardRef.current.getBoundingClientRect();
                setCellSize(rect.width / grid[0].length);
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [grid]);

    if (!grid || grid.length === 0) return null;

    const width = grid[0].length;
    const height = grid.length;

    const renderSVGPath = () => {
        if (pathTraced.length < 2) return null;
        const d = pathTraced.map((p, index) => {
            const cx = p.x * cellSize + cellSize / 2;
            const cy = p.y * cellSize + cellSize / 2;
            return `${index === 0 ? 'M' : 'L'} ${cx} ${cy}`;
        }).join(' ');

        return (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                <path d={d} fill="none" stroke="#E84C0A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    const renderSideItem = (item, side) => {
        const isDone = completedPairs.has(item.pairId);
        const isActive = activeItem?.id === item.id;
        return (
            <div
                key={item.id}
                className="laberinto-side-slot"
                style={{ gridRow: item.row + 1 }}
            >
                {!isDone && (
                    <div className={`laberinto-item ${side === 'left' ? 'laberinto-entrance' : 'laberinto-exit'} ${isActive ? 'active' : ''}`}>
                        <GameCard
                            text={item.showText ? item.text : null}
                            imageUrl={item.showImage ? item.imageUrl : null}
                            audioUrl={item.playAudio ? item.audioUrl : null}
                            disabled={true}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="laberinto-wrapper">
            {/* Left panel — A items (entrances), selectable at x=0 */}
            <div
                className="laberinto-side laberinto-side-left"
                style={{ gridTemplateRows: `repeat(${height}, 1fr)` }}
            >
                {entrances.map(item => renderSideItem(item, 'left'))}
            </div>

            {/* Maze grid */}
            <div className="laberinto-board-container" ref={boardRef}>
                <div
                    className="laberinto-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${width}, 1fr)`,
                        gridTemplateRows: `repeat(${height}, 1fr)`,
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}
                >
                    {grid.map((row, y) =>
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                className="laberinto-cell"
                                style={{
                                    gridColumn: x + 1,
                                    gridRow: y + 1,
                                    borderTop: cell.top ? '2px solid #1E3A8A' : '1px solid transparent',
                                    borderRight: cell.right ? '2px solid #1E3A8A' : '1px solid transparent',
                                    borderBottom: cell.bottom ? '2px solid #1E3A8A' : '1px solid transparent',
                                    borderLeft: cell.left ? '2px solid #1E3A8A' : '1px solid transparent',
                                }}
                            />
                        ))
                    )}

                    {/* Avatar */}
                    <div
                        className="laberinto-avatar"
                        style={{ gridColumn: avatarPos.x + 1, gridRow: avatarPos.y + 1, zIndex: 20 }}
                    >
                        <div className="laberinto-avatar-circle" />
                    </div>
                </div>

                {cellSize > 0 && renderSVGPath()}
            </div>

            {/* Right panel — B items (exits), completed at x=width-1 */}
            <div
                className="laberinto-side laberinto-side-right"
                style={{ gridTemplateRows: `repeat(${height}, 1fr)` }}
            >
                {exits.map(item => renderSideItem(item, 'right'))}
            </div>
        </div>
    );
};

export default LaberintoBoard;
