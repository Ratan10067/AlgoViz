import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage and update body class
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.classList.remove('algo-light', 'algo-dark');
    document.body.classList.add(theme === 'light' ? 'algo-light' : 'algo-dark');
    
    // Apply global background styles
    if (theme === 'light') {
      document.body.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdfa 100%)';
      document.body.style.minHeight = '100vh';
    } else {
      document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)';
      document.body.style.minHeight = '100vh';
    }
    
    return () => {
      document.body.classList.remove('algo-light', 'algo-dark');
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
