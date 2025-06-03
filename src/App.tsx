import React, { useState, useEffect } from 'react';
import { Shell } from './components/Shell';
import ApplicationForm from './features/applicationForm/ApplicationForm';

const App: React.FC = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(
    () => localStorage.getItem('darkMode') === 'true'
  );
  // Language state: 'en' or 'ar'
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  // Toggle dark mode ← side effect must run on mount + toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Toggle language + HTML dir attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <Shell
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      lang={lang}
      onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
    >
      <ApplicationForm />
    </Shell>
  );
};

export default App;