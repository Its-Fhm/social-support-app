import React from 'react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 shadow">
      <h1 className="text-xl font-semibold">GovSocial Support</h1>
      <div className="flex items-center space-x-4">
        {/* Language Toggle */}
        <button
          onClick={onToggleLang}
          className="px-3 py-1 border-2 border-gray-400 dark:border-gray-600 rounded-md bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {lang === 'en' ? 'العربية' : 'English'}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-transparent border-2 border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            /* Sun Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v2m7.071 1.929l-1.414 1.414M21 12h-2M17.071 17.071l-1.414-1.414M12 19v2M6.343 17.071l1.414-1.414M3 12h2m1.929-4.071l1.414 1.414"
              />
            </svg>
          ) : (
            /* Moon Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};