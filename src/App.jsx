import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PdfUploader from './components/PdfUploader';
import ReviewerTab from './components/ReviewerTab';
import QuizTab from './components/QuizTab';
import FlashcardTab from './components/FlashcardTab';
import ApiKeyModal from './components/ApiKeyModal';
import HistorySidebar from './components/HistorySidebar';
import { BookOpen, HelpCircle, Layers, UploadCloud, Heart, Sparkles } from 'lucide-react';

export default function App() {
  // Theme State: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('liliview_theme') || 'light';
  });

  // API Key State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('liliview_api_key') || '';
  });

  // UI Modals & Drawers
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
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

  // Prompt user for API key on first load if missing
  useEffect(() => {
    if (!apiKey) {
      setTimeout(() => setIsApiKeyModalOpen(true), 600);
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('liliview_api_key', key);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '3rem' }}>
      
      {/* App Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyList.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '92%', margin: '0 auto' }}>
        
        {!currentKit ? (
          /* PDF Upload View */
          <PdfUploader 
            onStudyKitGenerated={handleStudyKitGenerated}
            apiKey={apiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        ) : (
          /* Active Study Kit Dashboard */
          <div>
            
            {/* Top Toolbar & Tab Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-rose)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Study Document
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentKit.title}</h2>
              </div>

              {/* Tab Selector */}
              <div className="glass-panel" style={{
                display: 'inline-flex',
                padding: '0.35rem',
                borderRadius: 'var(--radius-md)',
                gap: '0.25rem'
              }}>
                <button
                  onClick={() => setActiveTab('reviewer')}
                  className={activeTab === 'reviewer' ? 'btn-pink' : 'btn-secondary'}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.88rem',
                    boxShadow: activeTab === 'reviewer' ? undefined : 'none',
                    border: 'none',
                    backgroundColor: activeTab === 'reviewer' ? undefined : 'transparent'
                  }}
                >
                  <BookOpen size={16} /> Reviewer
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={activeTab === 'quiz' ? 'btn-pink' : 'btn-secondary'}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.88rem',
                    boxShadow: activeTab === 'quiz' ? undefined : 'none',
                    border: 'none',
                    backgroundColor: activeTab === 'quiz' ? undefined : 'transparent'
                  }}
                >
                  <HelpCircle size={16} /> Quiz ({currentKit.data.quiz?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={activeTab === 'flashcards' ? 'btn-pink' : 'btn-secondary'}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.88rem',
                    boxShadow: activeTab === 'flashcards' ? undefined : 'none',
                    border: 'none',
                    backgroundColor: activeTab === 'flashcards' ? undefined : 'transparent'
                  }}
                >
                  <Layers size={16} /> Flashcards ({currentKit.data.flashcards?.length || 0})
                </button>

                <button
                  onClick={() => setCurrentKit(null)}
                  className="btn-secondary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.88rem',
                    border: 'none',
                    backgroundColor: 'transparent'
                  }}
                  title="Upload another PDF"
                >
                  <UploadCloud size={16} /> New PDF
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
        marginTop: '4rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          Crafted with <Heart size={14} fill="var(--accent-rose)" color="var(--accent-rose)" /> for your special study sessions • <strong>Liliview</strong>
        </p>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

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
