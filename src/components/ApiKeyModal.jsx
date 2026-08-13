import React, { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle, Heart } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(20, 9, 18, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        animation: 'floatSparkle 0.3s ease-out'
      }}>
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '20px',
            background: 'var(--soft-pink-bg)',
            border: '1px solid var(--soft-pink-border)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)',
            marginBottom: '0.85rem'
          }}>
            <Key size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Google API Key Settings</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Liliview turns your PDF study materials into complete reviewers, quizzes, and flashcards.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: 'var(--text-main)', 
              marginBottom: '0.4rem' 
            }}>
              Your Google API Key
            </label>
            <input 
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--card-border)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'var(--transition-smooth)'
              }}
              required
            />
          </div>

          <div style={{
            backgroundColor: 'var(--soft-pink-bg)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--soft-pink-border)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Heart size={20} color="var(--accent-rose)" style={{ flexShrink: 0 }} />
            <div>
              Google API keys are <strong>100% free</strong> from Google AI Studio.
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  color: 'var(--accent-rose)', 
                  fontWeight: 600, 
                  marginLeft: '0.3rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                Get key <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-pink"
              style={{ flex: 1 }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle size={18} /> Saved!
                </>
              ) : (
                "Save Key"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
