import React from 'react';
import { Moon, Sun, History, BookOpen, Sparkles } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onOpenHistory,
  historyCount 
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      borderRadius: 'var(--radius-lg)',
      margin: '1.5rem auto',
      maxWidth: '1200px',
      width: '92%'
    }} className="glass-panel">
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #FF9EBB 0%, #FF6584 50%, #F72585 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(247, 37, 133, 0.3)',
          color: '#FFFFFF'
        }} className="animate-float">
          <BookOpen size={24} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--text-main) 30%, var(--primary-pink) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Liliview
            </h1>
            <Sparkles size={18} color="var(--primary-pink)" />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Pastel PDF Study Companion
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Saved History Button */}
        <button 
          onClick={onOpenHistory} 
          className="btn-secondary"
          style={{ padding: '0.6rem 1rem', fontSize: '0.88rem' }}
          title="Past Saved Study Kits"
        >
          <History size={18} />
          <span>Saved</span>
          {historyCount > 0 && (
            <span style={{
              background: 'var(--primary-pink)',
              color: '#FFF',
              borderRadius: '99px',
              padding: '2px 7px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {historyCount}
            </span>
          )}
        </button>

        {/* Dark/Light Mode Switch */}
        <button 
          onClick={onToggleTheme} 
          className="btn-secondary"
          style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={20} color="var(--text-main)" />
          ) : (
            <Sun size={20} color="var(--primary-pink)" />
          )}
        </button>
      </div>
    </header>
  );
}
