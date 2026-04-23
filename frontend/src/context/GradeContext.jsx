/**
 * Grade Context
 * Manages grade-aware content, styling, and complexity
 */

import React, { createContext, useState, useEffect } from 'react';

export const GradeContext = createContext();

// Grade configurations for K-12
const GRADE_CONFIG = {
  K: {
    label: 'Kindergarten',
    level: 0,
    range: 'K-3',
    ageRange: '5-6',
    complexity: 'beginner',
    features: {
      useEmojis: true,
      largeText: true,
      simplifiedLanguage: true,
      maxTextLength: 150,
      useVisuals: true,
      autoPlayAudio: true,
      gameified: true,
    },
    typography: {
      fontSize: '18px',
      lineHeight: '1.8',
      fontWeight: '500',
    },
    colors: {
      primary: '#FF6B6B',  // Bright red
      secondary: '#4ECDC4',  // Bright cyan
      accent: '#FFE66D',    // Bright yellow
    },
  },
  '1': {
    label: 'Grade 1',
    level: 1,
    range: 'K-3',
    ageRange: '6-7',
    complexity: 'beginner',
    features: {
      useEmojis: true,
      largeText: true,
      simplifiedLanguage: true,
      maxTextLength: 200,
      useVisuals: true,
      autoPlayAudio: true,
      gameified: true,
    },
    typography: {
      fontSize: '17px',
      lineHeight: '1.8',
      fontWeight: '500',
    },
    colors: {
      primary: '#FF6B9D',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
    },
  },
  '2': {
    label: 'Grade 2',
    level: 2,
    range: 'K-3',
    ageRange: '7-8',
    complexity: 'beginner',
    features: {
      useEmojis: true,
      largeText: true,
      simplifiedLanguage: true,
      maxTextLength: 250,
      useVisuals: true,
      autoPlayAudio: false,
      gameified: true,
    },
    typography: {
      fontSize: '16px',
      lineHeight: '1.7',
      fontWeight: '500',
    },
    colors: {
      primary: '#FF8C42',
      secondary: '#95E1D3',
      accent: '#FFA500',
    },
  },
  '3': {
    label: 'Grade 3',
    level: 3,
    range: 'K-3',
    ageRange: '8-9',
    complexity: 'beginner',
    features: {
      useEmojis: true,
      largeText: false,
      simplifiedLanguage: true,
      maxTextLength: 300,
      useVisuals: true,
      autoPlayAudio: false,
      gameified: true,
    },
    typography: {
      fontSize: '15px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    colors: {
      primary: '#FF6B35',
      secondary: '#91E5F6',
      accent: '#FFD93D',
    },
  },
  '4': {
    label: 'Grade 4',
    level: 4,
    range: '4-6',
    ageRange: '9-10',
    complexity: 'intermediate',
    features: {
      useEmojis: true,
      largeText: false,
      simplifiedLanguage: true,
      maxTextLength: 400,
      useVisuals: true,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '15px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#2EC4B6',
      accent: '#FFD93D',
    },
  },
  '5': {
    label: 'Grade 5',
    level: 5,
    range: '4-6',
    ageRange: '10-11',
    complexity: 'intermediate',
    features: {
      useEmojis: true,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 500,
      useVisuals: true,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#00D9FF',
      accent: '#FFA500',
    },
  },
  '6': {
    label: 'Grade 6',
    level: 6,
    range: '4-6',
    ageRange: '11-12',
    complexity: 'intermediate',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 600,
      useVisuals: true,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#2563EB',
      accent: '#F59E0B',
    },
  },
  '7': {
    label: 'Grade 7',
    level: 7,
    range: '7-9',
    ageRange: '12-13',
    complexity: 'advanced',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 800,
      useVisuals: false,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#1E40AF',
      accent: '#D97706',
    },
  },
  '8': {
    label: 'Grade 8',
    level: 8,
    range: '7-9',
    ageRange: '13-14',
    complexity: 'advanced',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 1000,
      useVisuals: false,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#1E40AF',
      accent: '#DC2626',
    },
  },
  '9': {
    label: 'Grade 9',
    level: 9,
    range: '7-9',
    ageRange: '14-15',
    complexity: 'advanced',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 1200,
      useVisuals: false,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#1E3A8A',
      accent: '#991B1B',
    },
  },
  '10': {
    label: 'Grade 10',
    level: 10,
    range: '10-12',
    ageRange: '15-16',
    complexity: 'expert',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 1500,
      useVisuals: false,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#1E3A8A',
      accent: '#7C2D12',
    },
  },
  '11': {
    label: 'Grade 11',
    level: 11,
    range: '10-12',
    ageRange: '16-17',
    complexity: 'expert',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 2000,
      useVisuals: false,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#0C4A6E',
      accent: '#5C1A1A',
    },
  },
  '12': {
    label: 'Grade 12',
    level: 12,
    range: '10-12',
    ageRange: '17-18',
    complexity: 'expert',
    features: {
      useEmojis: false,
      largeText: false,
      simplifiedLanguage: false,
      maxTextLength: 2500,
      useVisuals: false,
      autoPlayAudio: false,
      gameified: false,
    },
    typography: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    colors: {
      primary: '#399aff',
      secondary: '#082F49',
      accent: '#3F0000',
    },
  },
};

export const GradeProvider = ({ children, initialGrade = '6' }) => {
  const [grade, setGrade] = useState(initialGrade);

  // Initialize from localStorage
  useEffect(() => {
    const savedGrade = localStorage.getItem('codekids-grade');
    if (savedGrade && GRADE_CONFIG[savedGrade]) {
      setGrade(savedGrade);
    }
  }, []);

  const changeGrade = (newGrade) => {
    if (GRADE_CONFIG[newGrade]) {
      setGrade(newGrade);
      localStorage.setItem('codekids-grade', newGrade);
    }
  };

  const gradeConfig = GRADE_CONFIG[grade];

  return (
    <GradeContext.Provider value={{ grade, changeGrade, gradeConfig, GRADE_CONFIG }}>
      {children}
    </GradeContext.Provider>
  );
};

export default GradeContext;
