import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, Sparkles, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizTab({ quiz }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  if (!quiz || quiz.length === 0) return null;

  const currentQ = quiz[currentIndex];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // Prevent changing choice once answered

    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.correctIndex;
    const updatedScore = isCorrect ? score + 1 : score;
    const updatedStreak = isCorrect ? streak + 1 : 0;

    setScore(updatedScore);
    setStreak(updatedStreak);

    setUserAnswers([...userAnswers, { questionId: currentQ.id, selected: idx, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      // Trigger festive pink confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF85A1', '#F72585', '#FFB7C5', '#FFE5EC']
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Quiz Header Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--primary-pink)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Practice Quiz</h2>
        </div>

        {!quizCompleted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {streak > 1 && (
              <div style={{
                backgroundColor: 'var(--soft-pink-bg)',
                border: '1px solid var(--accent-rose)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }} className="animate-glow">
                <Heart size={14} fill="var(--accent-rose)" /> {streak} Streak!
              </div>
            )}

            <div style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--text-muted)'
            }}>
              Score: <span style={{ color: 'var(--accent-rose)' }}>{score}</span> / {quiz.length}
            </div>
          </div>
        )}
      </div>

      {!quizCompleted ? (
        <div className="glass-panel" style={{ padding: '2.25rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          
          {/* Progress bar */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Question {currentIndex + 1} of {quiz.length}</span>
              <span>{Math.round(((currentIndex + 1) / quiz.length) * 100)}% Completed</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--soft-pink-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                width: `${((currentIndex + 1) / quiz.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary-pink) 0%, var(--accent-rose) 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Question Topic Badge */}
          {currentQ.topic && (
            <span style={{
              display: 'inline-block',
              backgroundColor: 'var(--soft-pink-bg)',
              color: 'var(--accent-rose)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.85rem'
            }}>
              {currentQ.topic}
            </span>
          )}

          {/* Question Text */}
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
            {currentQ.options.map((opt, idx) => {
              let btnBg = 'rgba(255, 255, 255, 0.03)';
              let borderCol = 'var(--card-border)';
              let textColor = 'var(--text-main)';
              let icon = null;

              if (selectedOption !== null) {
                if (idx === currentQ.correctIndex) {
                  btnBg = 'var(--success-bg)';
                  borderCol = 'var(--success)';
                  textColor = 'var(--text-main)';
                  icon = <CheckCircle2 size={18} color="var(--success)" />;
                } else if (idx === selectedOption) {
                  btnBg = 'var(--error-bg)';
                  borderCol = 'var(--error)';
                  textColor = 'var(--text-main)';
                  icon = <XCircle size={18} color="var(--error)" />;
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${borderCol}`,
                    backgroundColor: btnBg,
                    color: textColor,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: selectedOption !== null ? 'default' : 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--soft-pink-bg)',
                      color: 'var(--accent-rose)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div style={{
              backgroundColor: 'var(--soft-pink-bg)',
              border: '1px solid var(--soft-pink-border)',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
              animation: 'floatSparkle 0.3s ease-out'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '0.35rem' }}>
                Explanation
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next button */}
          {selectedOption !== null && (
            <div style={{ textAlign: 'right' }}>
              <button onClick={handleNext} className="btn-pink" style={{ padding: '0.8rem 1.75rem' }}>
                <span>{currentIndex + 1 === quiz.length ? 'See Results 🎉' : 'Next Question'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Complete Results Summary */
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--soft-pink-bg)',
            color: 'var(--accent-rose)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }} className="animate-float">
            <Award size={40} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Quiz Complete! 🎉
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem' }}>
            You scored <strong style={{ color: 'var(--accent-rose)', fontSize: '1.2rem' }}>{score}</strong> out of <strong>{quiz.length}</strong> ({Math.round((score / quiz.length) * 100)}%)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={handleRestart} className="btn-pink" style={{ padding: '0.85rem 1.75rem' }}>
              <RotateCcw size={18} /> Retake Quiz
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
