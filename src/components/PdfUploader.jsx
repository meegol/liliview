import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfExtractor';

export default function PdfUploader({ onStudyKitGenerated, apiKey, onOpenApiKeyModal }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
        setError('');
      } else {
        setError('Please upload a valid PDF document (.pdf).');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
        setError('');
      } else {
        setError('Please upload a valid PDF document (.pdf).');
      }
    }
  };

  const handleProcessPdf = async () => {
    if (!file) return;

    if (!apiKey) {
      onOpenApiKeyModal();
      return;
    }

    setExtracting(true);
    setError('');
    setProgress(10);
    setStatusText('Reading PDF pages & extracting text...');

    try {
      const pdfData = await extractTextFromPdf(file, (percent) => {
        setProgress(Math.round(10 + percent * 0.3));
      });

      if (!pdfData.fullText || pdfData.fullText.length < 20) {
        throw new Error('Could not extract readable text from this PDF. It might be scanned images or password protected.');
      }

      setProgress(55);
      setStatusText(`Analyzing ${pdfData.pageCount} document pages...`);

      const { generateStudyMaterial } = await import('../utils/geminiApi');
      
      setProgress(75);
      setStatusText('Building Reviewer, Quiz & 3D Flashcards...');
      
      const studyKit = await generateStudyMaterial(apiKey, pdfData.title, pdfData.fullText);

      setProgress(100);
      setStatusText('Done!');

      setTimeout(() => {
        onStudyKitGenerated({
          title: pdfData.title,
          pageCount: pdfData.pageCount,
          date: new Date().toISOString(),
          data: studyKit
        });
        setExtracting(false);
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while processing the PDF.');
      setExtracting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', width: '92%' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Upload PDF Study Document 🌸
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Liliview will extract all text and automatically build a complete Reviewer, Quiz, and Flashcards for you.
          </p>
        </div>

        {/* Dropzone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-rose)' : 'var(--soft-pink-border)'}`,
            backgroundColor: isDragging ? 'var(--soft-pink-bg)' : 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            marginBottom: '1.5rem',
            position: 'relative'
          }}
        >
          <input 
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer'
            }}
          />

          {!file ? (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--soft-pink-bg)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-pink)',
                marginBottom: '1rem'
              }} className="animate-float">
                <UploadCloud size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Drag & Drop your PDF here
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                or click to browse files from your computer
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--soft-pink-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-rose)'
              }}>
                <FileText size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{file.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB PDF Document
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div style={{
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Extraction Progress */}
        {extracting && (
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-pink)' }}>
                <Loader2 size={16} className="animate-spin" />
                {statusText}
              </span>
              <span>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--soft-pink-bg)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary-pink) 0%, var(--accent-rose) 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleProcessPdf}
          disabled={!file || extracting}
          className="btn-pink"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.05rem',
            justifyContent: 'center'
          }}
        >
          {extracting ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Creating Study Kit...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Generate Complete Study Kit ✨
            </>
          )}
        </button>

      </div>
    </div>
  );
}
