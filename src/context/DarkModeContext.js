import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const DarkModeContext = createContext();

// Custom hook to use the context
export const useDarkMode = () => useContext(DarkModeContext);

// Context provider to manage the dark mode state
export const DarkModeProvider = ({ children }) => {
  // Check localStorage for saved theme or default to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true'; // convert string to boolean
  });

  // Update localStorage whenever isDarkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode,setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
