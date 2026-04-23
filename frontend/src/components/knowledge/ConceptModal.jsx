import React from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import '../../styles/components/ConceptModal.css';

const ConceptModal = ({ concept, onClose, onLearnMore, grade, useEmojis }) => {
  if (!concept) return null;

  // Get grade-aware content length
  const getContentLength = (gradeNum) => {
    if (gradeNum <= 3) return 200;
    if (gradeNum <= 6) return 300;
    if (gradeNum <= 9) return 500;
    return 1000;
  };

  const gradeNum = parseInt(grade.replace(/\D/g, '')) || 6;
  const maxLength = getContentLength(gradeNum);

  const truncateContent = (content) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  };

  return (
    <div className="concept-modal-overlay" onClick={onClose}>
      <div className="concept-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-title">
            <span className="modal-emoji">{concept.emoji}</span>
            <div>
              <h2 className="modal-title">{concept.title}</h2>
              <div className="header-badges">
                <Badge
                  variant="solid"
                  size="sm"
                  color={concept.difficulty === 'Beginner' ? 'success' : concept.difficulty === 'Intermediate' ? 'warning' : 'danger'}
                >
                  {concept.difficulty}
                </Badge>
                <Badge variant="outline" size="sm">
                  {concept.category}
                </Badge>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Definition */}
          <section className="modal-section">
            <h3 className="section-title">{useEmojis ? '📖 ' : ''}Definition</h3>
            <p className="section-content">
              {truncateContent(concept.definition)}
            </p>
          </section>

          {/* Key Points */}
          <section className="modal-section">
            <h3 className="section-title">{useEmojis ? '💡 ' : ''}Key Points</h3>
            <ul className="key-points">
              {concept.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </section>

          {/* Code Example */}
          {concept.example && (
            <section className="modal-section">
              <h3 className="section-title">{useEmojis ? '💻 ' : ''}Code Example</h3>
              <pre className="code-example">
                <code>{concept.example}</code>
              </pre>
            </section>
          )}

          {/* Real-World Application */}
          {concept.realWorldApp && (
            <section className="modal-section">
              <h3 className="section-title">{useEmojis ? '🌍 ' : ''}Real-World Application</h3>
              <p className="section-content">
                {truncateContent(concept.realWorldApp)}
              </p>
            </section>
          )}

          {/* Languages */}
          <section className="modal-section">
            <h3 className="section-title">{useEmojis ? '🔧 ' : ''}Available Languages</h3>
            <div className="languages-list">
              {concept.languages.map((lang) => (
                <span key={lang} className="language-badge">
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </span>
              ))}
            </div>
          </section>

          {/* Related Concepts */}
          {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
            <section className="modal-section">
              <h3 className="section-title">{useEmojis ? '🔗 ' : ''}Related Concepts</h3>
              <p className="related-concepts">
                {concept.relatedConcepts.join(', ')}
              </p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onLearnMore?.();
              onClose();
            }}
          >
            {useEmojis ? '📚 ' : ''}Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConceptModal;
