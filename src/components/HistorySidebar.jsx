import React from 'react';
import { X, History, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react';

export default function HistorySidebar({ isOpen, onClose, historyList, onLoadSession, onDeleteSession }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(20, 9, 18, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        height: '100%',
        borderRadius: '0',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Sidebar Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-pink)' }}>
            <History size={22} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Saved Study Kits
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* History List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {historyList.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
              <FileText size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.92rem' }}>No saved study sessions yet.</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
                Uploaded PDF study kits will automatically appear here!
              </p>
            </div>
          ) : (
            historyList.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </h4>
                  <button
                    onClick={() => onDeleteSession(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-light)',
                      cursor: 'pointer',
                      padding: '0.2rem'
                    }}
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Calendar size={12} /> {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{item.pageCount} Pages</span>
                </div>

                <button
                  onClick={() => { onLoadSession(item); onClose(); }}
                  className="btn-secondary"
                  style={{
                    padding: '0.45rem',
                    fontSize: '0.82rem',
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}
                >
                  <span>Open Study Kit</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
