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
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      margin: '1rem auto',
      maxWidth: '1200px',
      width: '94%'
    }} className="glass-panel">
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FF9EBB 0%, #FF6584 50%, #F72585 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(247, 37, 133, 0.25)',
          color: '#FFFFFF',
          flexShrink: 0
        }}>
          <BookOpen size={20} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <h1 style={{ 
              fontSize: '1.35rem', 
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--text-main) 30%, var(--primary-pink) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Liliview
            </h1>
            <Sparkles size={16} color="var(--primary-pink)" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Study Kit Maker
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Saved History Button */}
        <button 
          onClick={onOpenHistory} 
          className="btn-secondary"
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', minHeight: '38px' }}
          title="Past Saved Study Kits"
        >
          <History size={16} />
          <span>Saved</span>
          {historyCount > 0 && (
            <span style={{
              background: 'var(--primary-pink)',
              color: '#FFF',
              borderRadius: '99px',
              padding: '1px 6px',
              fontSize: '0.72rem',
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
          style={{ padding: '0.5rem', minHeight: '38px', width: '38px', borderRadius: 'var(--radius-md)' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} color="var(--text-main)" />
          ) : (
            <Sun size={18} color="var(--primary-pink)" />
          )}
        </button>
      </div>
    </header>
  );
}
