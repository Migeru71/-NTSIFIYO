// client/src/components/Games/Memorama/GameCard.js
import React from 'react';

function GameCard({ card, isFlipped, isMatched, onClick }) {
    return (
        <div
            className={`game-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
        >
            <div className="card-inner">
                {/* Dorso */}
                <div className="card-back">
                    <span className="card-icon">❓</span>
                </div>

                {/* Frente */}
                <div className="card-front">
                    {card.type === 'image' ? (
                        <div className="card-image">
                            <img src={card.content} alt={card.label} />
                        </div>
                    ) : (
                        <div className="card-word">
                            <span className="word-text">{card.content}</span>
                            <span className="word-label">{card.label}</span>
                        </div>
                    )}
                </div>

                {/* Overlay */}
                {isMatched && (
                    <div className="card-matched-overlay">
                        <span className="matched-icon">✅</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameCard;