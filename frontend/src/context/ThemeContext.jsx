/**
 * Theme Context
 * Manages light/dark mode theme switching
 */

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('codekids-theme');

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('codekids-theme', newTheme);
  };

  const applyTheme = (themeMode) => {
    const root = document.documentElement;
    root.classList.add('no-transitions');
    if (themeMode === 'dark') {
      root.style.colorScheme = 'dark';
      root.classList.add('dark-mode');
    } else {
      root.style.colorScheme = 'light';
      root.classList.remove('dark-mode');
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove('no-transitions'));
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
