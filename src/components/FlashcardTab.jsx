import React, { useState, useEffect } from 'react';
import { Layers, RotateCw, ChevronLeft, ChevronRight, Shuffle, Eye, Heart, Brain, Sparkles } from 'lucide-react';

export default function FlashcardTab({ flashcards }) {
  const [cards, setCards] = useState(flashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [reviewIds, setReviewIds] = useState(new Set());

  useEffect(() => {
    setCards(flashcards || []);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [flashcards]);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleMarkMastered = (e) => {
    e.stopPropagation();
    const newMastered = new Set(masteredIds);
    newMastered.add(currentCard.id);
    setMasteredIds(newMastered);
    const newReview = new Set(reviewIds);
    newReview.delete(currentCard.id);
    setReviewIds(newReview);
    handleNext();
  };

  const handleMarkNeedsReview = (e) => {
    e.stopPropagation();
    const newReview = new Set(reviewIds);
    newReview.add(currentCard.id);
    setReviewIds(newReview);
    const newMastered = new Set(masteredIds);
    newMastered.delete(currentCard.id);
    setMasteredIds(newMastered);
    handleNext();
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      
      {/* Top Header & Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={20} color="var(--primary-pink)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>3D Flashcards</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button onClick={handleShuffle} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', minHeight: '34px' }}>
            <Shuffle size={13} /> Shuffle
          </button>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Mastered: <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>{masteredIds.size}</span> / {cards.length}
          </div>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000" style={{ minHeight: '340px', height: '360px', width: '100%', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={handleFlip}>
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          
          {/* Card Front (Solid Opaque Background) */}
          <div className="flashcard-front" style={{
            border: '2px solid var(--card-border)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: 'var(--soft-pink-bg)',
                  color: 'var(--accent-rose)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {currentCard.topic || 'Concept'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Card {currentIndex + 1} of {cards.length}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: 'auto 0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5 }}>
                {currentCard.question}
              </h3>

              {showHint && currentCard.hint && (
                <p style={{
                  marginTop: '0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--accent-rose)',
                  backgroundColor: 'var(--soft-pink-bg)',
                  border: '1px solid var(--soft-pink-border)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-block'
                }}>
                  💡 Hint: {currentCard.hint}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {currentCard.hint ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', minHeight: '32px' }}
                >
                  <Eye size={13} /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              ) : <div />}

              <span style={{ fontSize: '0.78rem', color: 'var(--primary-pink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <RotateCw size={13} /> Tap to flip
              </span>
            </div>
          </div>

          {/* Card Back (Solid Opaque Background) */}
          <div className="flashcard-back" style={{
            border: '2px solid var(--accent-rose)'
          }}>
            <div>
              <span style={{
                backgroundColor: 'var(--accent-rose)',
                color: '#FFF',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Answer
              </span>
            </div>

            <div style={{ textAlign: 'center', margin: 'auto 0', overflowY: 'auto' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.6 }}>
                {currentCard.answer}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem' }}>
              <button 
                onClick={handleMarkNeedsReview}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', minHeight: '36px', borderColor: 'var(--warning)', color: 'var(--text-main)' }}
              >
                Needs Review 🧠
              </button>
              <button 
                onClick={handleMarkMastered}
                className="btn-pink"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', minHeight: '36px' }}
              >
                Got It! ❤️
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={handlePrev} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', minHeight: '40px' }}>
          <ChevronLeft size={16} /> Prev
        </button>

        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {cards.length}
        </span>

        <button onClick={handleNext} className="btn-pink" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', minHeight: '40px' }}>
          Next <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
