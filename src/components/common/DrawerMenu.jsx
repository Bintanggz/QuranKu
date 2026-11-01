import React from 'react';
import { APP_CONFIG } from '../../config/app';

export default function DrawerMenu({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  onOpenAbout,
}) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Beranda (114 Surah)', icon: 'menu_book' },
    { id: 'bookmarks', label: 'Ayat & Surah Tersimpan', icon: 'bookmark' },
    { id: 'audio', label: 'Pemutar Audio Murattal', icon: 'headphones' },
    { id: 'settings', label: 'Pengaturan & Unduh 30 Juz', icon: 'settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-start animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-[320px] bg-background text-on-background h-full shadow-2xl flex flex-col z-10 border-r border-outline-variant/30 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-6 bg-primary-container text-white relative overflow-hidden shrink-0 border-b border-accent-gold/20">
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-secondary-fixed/40 p-2 flex items-center justify-center shadow-inner">
              <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup menu"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <h3 className="font-headline-md text-xl font-bold text-white relative z-10">
            {APP_CONFIG.name}
          </h3>
          <p className="font-label-sm text-xs text-on-primary-container relative z-10 mt-0.5">
            Digital Mushaf • Rasm Uthmani & Kemenag RI
          </p>
        </div>

        {/* Menu Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          <p className="px-3 pt-2 pb-1 font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
            Navigasi Cepat
          </p>

          {menuItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-body-md text-sm transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-primary-container text-white font-semibold shadow-sm'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'text-secondary-fixed' : 'text-primary'
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 pb-2 border-t border-surface-variant/40 mt-4">
            <p className="px-3 pb-2 font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
              Preferensi
            </p>

            {/* Dark Mode Switch inside Drawer */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  {darkMode ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="font-body-md text-sm text-on-surface">Mode Gelap</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={onToggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            {/* About Modal Trigger */}
            <button
              onClick={() => {
                onClose();
                if (onOpenAbout) onOpenAbout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors text-left cursor-pointer font-body-md text-sm"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">
                info
              </span>
              <span>Tentang Aplikasi & Lisensi</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-variant/40 text-center shrink-0">
          <p className="font-label-sm text-[11px] text-on-surface-variant">
            Versi {APP_CONFIG.version} (PWA)
          </p>
          <p className="font-label-sm text-[10px] text-outline mt-0.5">
            100% Nirlaba & Bebas Iklan
          </p>
        </div>
      </div>
    </div>
  );
}

