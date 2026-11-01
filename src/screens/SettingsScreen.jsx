import React, { useState } from 'react';
import { APP_CONFIG, RECITERS } from '../config/app';
import { downloadAllSurahsForOffline } from '../services/quranService';
import { useAudio } from '../contexts/AudioContext';
import AboutModal from '../components/common/AboutModal';

export default function SettingsScreen({
  darkMode,
  onToggleDarkMode,
  fontSize,
  onFontSizeChange,
}) {
  const { reciterId, setReciterId } = useAudio();
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('quranku_language') || 'id';
    } catch {
      return 'id';
    }
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('quranku_language', lang);
  };

  const handleDownloadAll = async () => {
    setDownloadProgress({ completed: 0, total: 114 });
    await downloadAllSurahsForOffline((completed, total) => {
      setDownloadProgress({ completed, total });
    });
    setTimeout(() => {
      setDownloadProgress(null);
      alert('Alhamdulillah! Seluruh 114 Surah (30 Juz) berhasil disimpan di IndexedDB untuk akses offline.');
    }, 500);
  };

  const currentReciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[0];

  return (
    <main className="max-w-xl mx-auto px-container-margin pt-section-padding space-y-stack-gap pb-8">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-1">
          Settings
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant">
          Personalize your spiritual reading & listening experience
        </p>
      </div>

      {/* Appearance Section Card */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="px-inner-padding py-3.5 border-b border-surface-variant/50">
          <h3 className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">
            Appearance
          </h3>
        </div>

        <div className="divide-y divide-surface-variant/30">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-inner-padding py-4 hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  {darkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="font-body-md text-sm font-semibold text-on-surface">
                  Dark Mode
                </p>
                <p className="font-label-sm text-[11px] text-on-surface-variant">
                  Ease eye strain during night reading
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={onToggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>

          {/* Reading Font Size Slider (Berlaku di Surah Detail) */}
          <div className="px-inner-padding py-4 hover:bg-surface-container-low transition-colors space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">format_size</span>
              </div>
              <div>
                <p className="font-body-md text-sm font-semibold text-on-surface">
                  Ukuran Teks Arab: {fontSize}px
                </p>
                <p className="font-label-sm text-[11px] text-on-surface-variant">
                  Berlaku langsung pada teks ayat di Surah Detail
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-2">
              <span className="text-xs text-outline font-bold">A</span>
              <input
                type="range"
                min="18"
                max="44"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
              />
              <span className="text-lg text-on-surface font-bold">A</span>
            </div>

            {/* Live Preview Box */}
            <div className="bg-surface-container-low p-3.5 rounded-xl text-center border border-outline-variant/30">
              <p
                className="font-arabic-display text-primary select-none font-bold"
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block mt-1">
                Pratinjau Ukuran Ayat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Section Card (Qari & Bahasa) */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="px-inner-padding py-3.5 border-b border-surface-variant/50">
          <h3 className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">
            Preferences
          </h3>
        </div>

        <div className="divide-y divide-surface-variant/30">
          {/* Pilihan Qari Default */}
          <div
            onClick={() => setShowReciterModal(true)}
            className="w-full flex items-center justify-between px-inner-padding py-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
              </div>
              <div>
                <p className="font-body-md text-sm font-semibold text-on-surface">
                  Default Reciter (Qari)
                </p>
                <p className="font-label-sm text-[11px] text-secondary font-medium">
                  {currentReciter.name}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>

          {/* Bahasa Antarmuka */}
          <div className="w-full flex items-center justify-between px-inner-padding py-4 hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">language</span>
              </div>
              <div>
                <p className="font-body-md text-sm font-semibold text-on-surface">
                  Interface Language
                </p>
                <p className="font-label-sm text-[11px] text-on-surface-variant">
                  {language === 'id' ? 'Bahasa Indonesia' : 'English'}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5 bg-surface-container p-1 rounded-full text-xs font-label-sm">
              <button
                onClick={() => handleLanguageChange('id')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'id'
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Kartu Informasi Aplikasi (Pengganti Go Premium) */}
      <section className="bg-primary-container rounded-lg p-inner-padding text-white flex items-center justify-between overflow-hidden relative shadow-lg border border-secondary-container/20">
        <div className="relative z-10 max-w-[260px] space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              100% Gratis & Nirlaba
            </span>
          </div>
          <h4 className="font-headline-md text-base sm:text-lg font-bold text-white pt-1">
            {APP_CONFIG.name} Digital Mushaf
          </h4>
          <p className="font-body-md text-xs text-on-primary-container leading-relaxed">
            Dibuat untuk ibadah dan tadabbur Al-Qur'an tanpa iklan, tanpa pelacakan data, dan bebas biaya.
          </p>
        </div>
        <div className="absolute right-[-15px] top-[-10px] opacity-15 pointer-events-none">
          <span
            className="material-symbols-outlined text-[120px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_stories
          </span>
        </div>
      </section>

      {/* Offline Storage Section Card */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="px-inner-padding py-3.5 border-b border-surface-variant/50">
          <h3 className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">
            Penyimpanan Offline (IndexedDB)
          </h3>
        </div>

        <div className="px-inner-padding py-4 space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">cloud_download</span>
            </div>
            <div>
              <p className="font-body-md text-sm font-semibold text-on-surface">
                Unduh 114 Surah (Offline 30 Juz)
              </p>
              <p className="font-label-sm text-[11px] text-on-surface-variant">
                Simpan seluruh teks ayat & arti ke memori lokal browser
              </p>
            </div>
          </div>

          {downloadProgress ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Mengunduh...</span>
                <span>{downloadProgress.completed} / {downloadProgress.total} surah</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${(downloadProgress.completed / downloadProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDownloadAll}
              className="w-full mt-1 py-2.5 bg-primary text-white rounded-full font-label-sm text-xs font-semibold cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-sm"
            >
              Unduh 30 Juz Sekarang
            </button>
          )}
        </div>
      </section>

      {/* Help & About Section */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="divide-y divide-surface-variant/30">
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full flex items-center justify-between px-inner-padding py-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </div>
              <div>
                <p className="font-body-md text-sm font-semibold text-on-surface">
                  About {APP_CONFIG.name}
                </p>
                <p className="font-label-sm text-[11px] text-on-surface-variant">
                  Atribusi Sumber Data & Lisensi Resmi
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Modal Pilihan Qari */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-t-[28px] sm:rounded-2xl p-5 shadow-2xl border-t sm:border border-accent-gold/40 space-y-4">
            <div className="flex justify-between items-center border-b border-surface-variant/40 pb-3">
              <div>
                <h3 className="font-headline-md text-base font-bold text-primary">
                  Pilih Qari Murottal
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  Audio streaming ayat & surah penuh
                </p>
              </div>
              <button
                onClick={() => setShowReciterModal(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {RECITERS.map((r) => {
                const isSelected = r.id === reciterId;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setReciterId(r.id);
                      setShowReciterModal(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-secondary bg-secondary-container/15 text-primary font-bold shadow-sm'
                        : 'border-outline-variant/30 hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg text-secondary">
                        {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                      <span className="font-body-md text-xs sm:text-sm">{r.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowReciterModal(false)}
              className="w-full py-2.5 bg-primary text-white rounded-full font-label-sm text-xs font-semibold cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Modal Atribusi & Lisensi */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </main>
  );
}
