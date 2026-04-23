/**
 * useGrade Hook
 * Easy access to grade context and grade-aware features
 */

import { useContext } from 'react';
import { GradeContext } from '../context/GradeContext';

export const useGrade = () => {
  const context = useContext(GradeContext);

  if (!context) {
    throw new Error('useGrade must be used within a GradeProvider');
  }

  const { grade, changeGrade, gradeConfig } = context;

  // Helper functions for grade-aware behavior
  const isKinder = grade === 'K';
  const isEarlyElementary = ['K', '1', '2', '3'].includes(grade);
  const isElementary = ['4', '5', '6'].includes(grade);
  const isMiddleSchool = ['7', '8', '9'].includes(grade);
  const isHighSchool = ['10', '11', '12'].includes(grade);

  const getGradeRange = () => gradeConfig.range;
  const getComplexity = () => gradeConfig.complexity;
  const getFeatures = () => gradeConfig.features;
  const getTypography = () => gradeConfig.typography;
  const getColors = () => gradeConfig.colors;

  // Truncate text based on grade
  const truncateText = (text, customLength = null) => {
    const maxLength = customLength || gradeConfig.features.maxTextLength;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Add emoji based on grade
  const addEmojiIfEligible = (text, emoji) => {
    if (gradeConfig.features.useEmojis) {
      return `${emoji} ${text}`;
    }
    return text;
  };

  // Simplify language based on grade
  const simplifyLanguage = (text) => {
    if (!gradeConfig.features.simplifiedLanguage) return text;

    const simplifications = {
      'algorithm': 'step-by-step instructions',
      'variable': 'container',
      'function': 'action',
      'parameter': 'input',
      'array': 'list',
      'object': 'thing',
      'instantiate': 'create',
      'initialize': 'set up',
      'concatenate': 'join',
      'iterate': 'loop',
      'recursion': 'repeating the same thing',
    };

    let simplified = text.toLowerCase();
    Object.entries(simplifications).forEach(([complex, simple]) => {
      simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
    });

    return simplified;
  };

  return {
    grade,
    changeGrade,
    gradeConfig,
    isKinder,
    isEarlyElementary,
    isElementary,
    isMiddleSchool,
    isHighSchool,
    getGradeRange,
    getComplexity,
    getFeatures,
    getTypography,
    getColors,
    truncateText,
    addEmojiIfEligible,
    simplifyLanguage,
  };
};

export default useGrade;
