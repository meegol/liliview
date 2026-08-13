import React, { useState } from 'react';
import { BookOpen, Copy, Download, Printer, Check, Lightbulb, Bookmark, FileText } from 'lucide-react';

export default function ReviewerTab({ reviewer }) {
  const [copied, setCopied] = useState(false);

  if (!reviewer) return null;

  const handleCopyText = () => {
    let markdownText = `# ${reviewer.title || 'Study Reviewer'}\n\n`;
    markdownText += `## Overview\n${reviewer.overview}\n\n`;

    markdownText += `## Core Concepts\n`;
    reviewer.coreConcepts?.forEach(c => {
      markdownText += `### ${c.concept}\n${c.summary}\n`;
      c.details?.forEach(d => {
        markdownText += `- ${d}\n`;
      });
      markdownText += `\n`;
    });

    markdownText += `## Key Definitions\n`;
    reviewer.keyDefinitions?.forEach(k => {
      markdownText += `- **${k.term}**: ${k.definition}\n`;
    });

    markdownText += `\n## Deep Dive Breakdown\n`;
    reviewer.deepDive?.forEach(d => {
      markdownText += `### ${d.topic}\n${d.content}\n\n`;
    });

    markdownText += `## Cheat Sheet & Core Takeaways\n`;
    reviewer.cheatSheet?.forEach(cs => {
      markdownText += `- ${cs}\n`;
    });

    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Top Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-pink)' }}>
          <BookOpen size={22} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Complete Study Reviewer
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleCopyText} className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
            {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Markdown' : 'Copy Text'}</span>
          </button>

          <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Reviewer Content Sheet */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Title & Overview */}
        <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1.75rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            {reviewer.title || 'Document Reviewer'}
          </h1>
          <div style={{
            backgroundColor: 'var(--soft-pink-bg)',
            borderLeft: '4px solid var(--accent-rose)',
            padding: '1.25rem 1.5rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lightbulb size={16} /> Executive Summary & Overview
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.65 }}>
              {reviewer.overview}
            </p>
          </div>
        </div>

        {/* Core Concepts */}
        {reviewer.coreConcepts && reviewer.coreConcepts.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bookmark size={20} /> Core Concepts
            </h3>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {reviewer.coreConcepts.map((item, idx) => (
                <div key={idx} style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    {idx + 1}. {item.concept}
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {item.summary}
                  </p>
                  {item.details && item.details.length > 0 && (
                    <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {item.details.map((detail, dIdx) => (
                        <li key={dIdx} style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Terminology & Definitions */}
        {reviewer.keyDefinitions && reviewer.keyDefinitions.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} /> Key Terminology & Definitions
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem'
            }}>
              {reviewer.keyDefinitions.map((def, idx) => (
                <div key={idx} style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--soft-pink-bg)',
                  border: '1px solid var(--soft-pink-border)'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--accent-rose)', display: 'block', marginBottom: '0.3rem' }}>
                    {def.term}
                  </span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {def.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deep Dive Breakdown */}
        {reviewer.deepDive && reviewer.deepDive.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-rose)' }}>
              Deep Dive Topic Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reviewer.deepDive.map((dd, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--card-border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-pink)', marginBottom: '0.6rem' }}>
                    {dd.topic}
                  </h4>
                  <p style={{ fontSize: '0.93rem', color: 'var(--text-main)', lineHeight: 1.7, whitespace: 'pre-line' }}>
                    {dd.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cheat Sheet */}
        {reviewer.cheatSheet && reviewer.cheatSheet.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, var(--soft-pink-bg) 0%, rgba(255, 133, 161, 0.15) 100%)',
            border: '1px dashed var(--accent-rose)',
            padding: '1.5rem 1.75rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-rose)', marginBottom: '0.85rem' }}>
              ⚡ Quick Cheat Sheet / Exam Takeaways
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {reviewer.cheatSheet.map((bullet, idx) => (
                <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
