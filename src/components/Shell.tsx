import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface ShellProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  children: ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  darkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
  children,
}) => {
  return (
    // We keep h-screen here so that flex-1 inside can scroll properly.
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        lang={lang}
        onToggleLang={onToggleLang}
      />
      <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};