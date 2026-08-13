import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PdfUploader from './components/PdfUploader';
import ReviewerTab from './components/ReviewerTab';
import QuizTab from './components/QuizTab';
import FlashcardTab from './components/FlashcardTab';
import HistorySidebar from './components/HistorySidebar';
import { BookOpen, HelpCircle, Layers, UploadCloud, Heart } from 'lucide-react';

export default function App() {
  // Theme State: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('liliview_theme') || 'light';
  });

  // UI Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Active Generated Study Session
  const [currentKit, setCurrentKit] = useState(null);
  const [activeTab, setActiveTab] = useState('reviewer'); // 'reviewer' | 'quiz' | 'flashcards'

  // History List
  const [historyList, setHistoryList] = useState(() => {
    const saved = localStorage.getItem('liliview_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync theme with body data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('liliview_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleStudyKitGenerated = (newKit) => {
    setCurrentKit(newKit);
    setActiveTab('reviewer');

    // Save to history
    const updatedHistory = [newKit, ...historyList.filter(item => item.title !== newKit.title)];
    setHistoryList(updatedHistory);
    localStorage.setItem('liliview_history', JSON.stringify(updatedHistory));
  };

  const handleLoadSession = (session) => {
    setCurrentKit(session);
    setActiveTab('reviewer');
  };

  const handleDeleteSession = (index) => {
    const updated = historyList.filter((_, idx) => idx !== index);
    setHistoryList(updated);
    localStorage.setItem('liliview_history', JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '2.5rem' }}>
      
      {/* App Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyList.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '94%', margin: '0 auto' }}>
        
        {!currentKit ? (
          /* PDF Upload View */
          <PdfUploader 
            onStudyKitGenerated={handleStudyKitGenerated}
          />
        ) : (
          /* Active Study Kit Dashboard */
          <div>
            
            {/* Top Toolbar & Tab Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.85rem'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Study Document
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentKit.title}</h2>
              </div>

              {/* Scrollable Tab Selector on Mobile */}
              <div className="glass-panel" style={{
                display: 'flex',
                padding: '0.3rem',
                borderRadius: 'var(--radius-md)',
                gap: '0.2rem',
                maxWidth: '100%',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}>
                <button
                  onClick={() => setActiveTab('reviewer')}
                  className={activeTab === 'reviewer' ? 'btn-pink' : 'btn-secondary'}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    minHeight: '36px',
                    whiteSpace: 'nowrap',
                    boxShadow: activeTab === 'reviewer' ? undefined : 'none',
                    border: 'none',
                    backgroundColor: activeTab === 'reviewer' ? undefined : 'transparent'
                  }}
                >
                  <BookOpen size={15} /> Reviewer
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={activeTab === 'quiz' ? 'btn-pink' : 'btn-secondary'}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    minHeight: '36px',
                    whiteSpace: 'nowrap',
                    boxShadow: activeTab === 'quiz' ? undefined : 'none',
                    border: 'none',
                    backgroundColor: activeTab === 'quiz' ? undefined : 'transparent'
                  }}
                >
                  <HelpCircle size={15} /> Quiz ({currentKit.data.quiz?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={activeTab === 'flashcards' ? 'btn-pink' : 'btn-secondary'}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    minHeight: '36px',
                    whiteSpace: 'nowrap',
                    boxShadow: activeTab === 'flashcards' ? undefined : 'none',
                    border: 'none',
                    backgroundColor: activeTab === 'flashcards' ? undefined : 'transparent'
                  }}
                >
                  <Layers size={15} /> Flashcards ({currentKit.data.flashcards?.length || 0})
                </button>

                <button
                  onClick={() => setCurrentKit(null)}
                  className="btn-secondary"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    minHeight: '36px',
                    whiteSpace: 'nowrap',
                    border: 'none',
                    backgroundColor: 'transparent'
                  }}
                  title="Upload another PDF"
                >
                  <UploadCloud size={15} /> New PDF
                </button>
              </div>
            </div>

            {/* Active Tab View */}
            {activeTab === 'reviewer' && (
              <ReviewerTab reviewer={currentKit.data.reviewer} />
            )}

            {activeTab === 'quiz' && (
              <QuizTab quiz={currentKit.data.quiz} />
            )}

            {activeTab === 'flashcards' && (
              <FlashcardTab flashcards={currentKit.data.flashcards} />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          Crafted with <Heart size={13} fill="var(--accent-rose)" color="var(--accent-rose)" /> for your special study sessions • <strong>Liliview</strong>
        </p>
      </footer>

      {/* Saved History Sidebar */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
      />

    </div>
  );
}
