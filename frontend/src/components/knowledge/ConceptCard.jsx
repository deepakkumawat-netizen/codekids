import React from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import '../../styles/components/ConceptCard.css';

const ConceptCard = ({ concept, onClick, onLearnMore, grade, useEmojis }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#399aff';
    }
  };

  // Truncate description based on grade
  const getDescriptionLength = (gradeNum) => {
    if (gradeNum <= 3) return 80;
    if (gradeNum <= 6) return 120;
    if (gradeNum <= 9) return 150;
    return 200;
  };

  const gradeNum = parseInt(grade.replace(/\D/g, '')) || 6;
  const maxLength = getDescriptionLength(gradeNum);
  const truncatedDesc = concept.definition.length > maxLength
    ? concept.definition.substring(0, maxLength) + '...'
    : concept.definition;

  return (
    <div className="concept-card" onClick={onClick}>
      <div className="card-header">
        <span className="concept-emoji">{concept.emoji}</span>
        <h3 className="concept-title">{concept.title}</h3>
      </div>

      <div className="card-body">
        <p className="concept-description">{truncatedDesc}</p>

        <div className="card-meta">
          <Badge
            variant="solid"
            size="sm"
            color={concept.difficulty === 'Beginner' ? 'success' : concept.difficulty === 'Intermediate' ? 'warning' : 'danger'}
          >
            {concept.difficulty}
          </Badge>

          <div className="language-tags">
            {concept.languages.slice(0, 2).map((lang) => (
              <span key={lang} className="language-tag">
                {lang.charAt(0).toUpperCase()}
              </span>
            ))}
            {concept.languages.length > 2 && (
              <span className="language-tag more">+{concept.languages.length - 2}</span>
            )}
          </div>
        </div>
      </div>

      <div className="card-footer">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore?.();
          }}
        >
          {useEmojis ? '📚' : ''} Learn
        </Button>
      </div>
    </div>
  );
};

export default ConceptCard;
