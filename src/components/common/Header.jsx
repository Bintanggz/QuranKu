import React from 'react';

export default function Header({
  title = "Al-Qur'an",
  showBack = false,
  onBack,
  onMenu,
  onSearch,
}) {
  return (
    <header className="bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100/50 dark:border-emerald-800/50 shadow-sm shadow-emerald-900/5 transition-colors">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
        {showBack ? (
          <button
            onClick={onBack}
            className="text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform cursor-pointer"
            aria-label="Kembali"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={onMenu}
            className="text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform cursor-pointer"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}

        <h1 className="font-serif text-emerald-900 dark:text-amber-200 tracking-wide text-xl font-bold select-none truncate px-2">
          {title}
        </h1>

        <button
          onClick={onSearch}
          className="text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform cursor-pointer"
          aria-label="Cari"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </header>
  );
}
