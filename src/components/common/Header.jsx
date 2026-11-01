import React from 'react';
import { APP_CONFIG } from '../../config/app';

export default function Header({
  title = "Al-Qur'an",
  showBack = false,
  onBack,
  onSearch,
  currentRoute = 'home',
  onNavigate,
  darkMode,
  onToggleDarkMode,
}) {
  const navTabs = [
    { id: 'home', label: 'Beranda', icon: 'menu_book' },
    { id: 'bookmarks', label: 'Tersimpan', icon: 'bookmark' },
    { id: 'audio', label: 'Audio', icon: 'headphones' },
    { id: 'settings', label: 'Pengaturan', icon: 'settings' },
  ];

  return (
    <header className="bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md sticky top-0 z-40 border-b border-amber-100/50 dark:border-emerald-800/50 shadow-sm shadow-emerald-900/5 transition-colors">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-5xl mx-auto">
        {/* Left Section: Back Button (saat di detail surah) ATAU Logo Aplikasi (di halaman utama) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors p-2 rounded-full active:scale-95 cursor-pointer -ml-1"
              aria-label="Kembali ke Beranda"
              title="Kembali"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-container text-white p-1.5 flex items-center justify-center border border-accent-gold/40 shadow-xs group-hover:scale-105 transition-transform">
                <img src="/favicon.svg" alt="Logo" className="w-full h-full" />
              </div>
              <span className="font-serif text-lg font-bold text-emerald-900 dark:text-amber-200 tracking-wide block leading-none">
                {APP_CONFIG.name}
              </span>
            </div>
          )}
        </div>

        {/* Center Section: Mobile Page Title ATAU Desktop Navigation Tabs */}
        <div className="flex-1 flex justify-center items-center px-2">
          {/* Mobile Title (Hanya muncul jika bukan halaman Home agar tidak duplikasi dengan logo) */}
          <h1 className="md:hidden font-serif text-emerald-900 dark:text-amber-200 tracking-wide text-sm sm:text-base font-bold select-none truncate text-center">
            {currentRoute === 'home' ? '' : title}
          </h1>

          {/* Desktop Navigation Tabs (Tampil di tablet & layar lebar) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-surface-container-low dark:bg-emerald-900/40 p-1 rounded-full border border-outline-variant/30">
            {navTabs.map((tab) => {
              const isActive = currentRoute === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate && onNavigate(tab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-label-sm text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-white font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-primary hover:bg-white/60 dark:hover:bg-emerald-800/50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Aksi (Cari & Toggle Dark Mode) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Ikon Pencarian: Hanya tampil jika sedang BUKAN di halaman beranda */}
          {currentRoute !== 'home' && (
            <button
              onClick={onSearch}
              className="text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors p-2 rounded-full active:scale-95 cursor-pointer"
              aria-label="Cari Surah"
              title="Cari Surah"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
          )}

          {/* Sakelar Mode Gelap */}
          <button
            onClick={onToggleDarkMode}
            className="text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors p-2 rounded-full active:scale-95 cursor-pointer"
            aria-label={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
