import React from 'react';
import { APP_CONFIG } from '../../config/app';

export default function Header({
  title = APP_CONFIG.name,
  showBack = false,
  onBack,
  onSearch,
  darkMode,
  onToggleDarkMode
}) {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-5 py-3.5 max-w-[430px] mx-auto">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-on-surface hover:bg-surface-container-low transition-transform active:scale-90 flex items-center justify-center"
            aria-label="Kembali"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={onToggleDarkMode}
            className="p-2 -ml-2 rounded-full text-on-surface hover:bg-surface-container-low transition-transform active:scale-90 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
            title={darkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}

        <h1 className="font-headline-md font-bold text-primary tracking-wide text-lg sm:text-xl text-center select-none truncate px-2">
          {title}
        </h1>

        <button
          onClick={onSearch}
          className="p-2 -mr-2 rounded-full text-on-surface hover:bg-surface-container-low transition-transform active:scale-90 flex items-center justify-center"
          aria-label="Cari"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </header>
  );
}

