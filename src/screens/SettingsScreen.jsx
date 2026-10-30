import React, { useState } from 'react';
import { APP_CONFIG } from '../config/app';
import { downloadAllSurahsForOffline } from '../services/quranService';

export default function SettingsScreen({ darkMode, onToggleDarkMode, fontSize, onFontSizeChange }) {
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleDownloadAll = async () => {
    setDownloadProgress({ completed: 0, total: 114 });
    await downloadAllSurahsForOffline((completed, total) => {
      setDownloadProgress({ completed, total });
    });
    setTimeout(() => {
      setDownloadProgress(null);
      alert('Alhamdulillah! Seluruh 114 Surah berhasil disimpan di IndexedDB untuk akses offline.');
    }, 500);
  };

  return (
    <main className="max-w-xl mx-auto px-container-margin pt-section-padding space-y-stack-gap pb-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
          Settings
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Personalize your spiritual reading experience
        </p>
      </div>

      {/* Appearance Section Card */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="px-inner-padding py-4 border-b border-surface-variant/50">
          <h3 className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">
            Appearance
          </h3>
        </div>

        <div className="divide-y divide-surface-variant/30">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-inner-padding py-5 hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">
                  {darkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  Dark Mode
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Ease eye strain at night
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

          {/* Font Size Slider */}
          <div className="px-inner-padding py-5 hover:bg-surface-container-low transition-colors space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">format_size</span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  Reading Font Size: {fontSize}px
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Adjust for comfortable reading
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-2">
              <span className="text-label-sm text-on-surface-variant font-bold">A</span>
              <input
                type="range"
                min="14"
                max="36"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <span className="text-body-lg text-on-surface font-bold text-lg">A</span>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Storage Section Card */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="px-inner-padding py-4 border-b border-surface-variant/50">
          <h3 className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">
            Penyimpanan Offline
          </h3>
        </div>

        <div className="px-inner-padding py-5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">cloud_download</span>
            </div>
            <div>
              <p className="font-body-md text-body-md font-medium text-on-surface">
                Unduh 114 Surah (Offline 30 Juz)
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Simpan seluruh ayat ke IndexedDB
              </p>
            </div>
          </div>

          {downloadProgress ? (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Mengunduh surah...</span>
                <span>{downloadProgress.completed} / {downloadProgress.total}</span>
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
              className="w-full mt-2 py-2.5 bg-primary text-white rounded-full font-label-sm text-xs font-semibold cursor-pointer hover:brightness-110 active:scale-95 transition-all"
            >
              Unduh Sekarang
            </button>
          )}
        </div>
      </section>

      {/* Preferences Section Card */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="px-inner-padding py-4 border-b border-surface-variant/50">
          <h3 className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">
            Preferences
          </h3>
        </div>

        <div className="divide-y divide-surface-variant/30">
          <div className="w-full flex items-center justify-between px-inner-padding py-5 hover:bg-surface-container-low transition-colors text-left cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">language</span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  Interface Language
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Bahasa Indonesia (ID)
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>

          <div className="w-full flex items-center justify-between px-inner-padding py-5 hover:bg-surface-container-low transition-colors text-left cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">record_voice_over</span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  Default Reciter
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {APP_CONFIG.audio.reciterName}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Premium Upsell Bento Item */}
      <section className="bg-primary-container rounded-lg p-inner-padding text-white flex items-center justify-between overflow-hidden relative shadow-lg">
        <div className="relative z-10">
          <h4 className="font-headline-md text-on-primary-container mb-1 font-bold">
            Go Premium
          </h4>
          <p className="text-label-sm opacity-80 max-w-[200px]">
            Unlock offline audio and exclusive geometric themes.
          </p>
          <button
            onClick={() => alert('Fitur Premium akan segera hadir')}
            className="mt-4 px-6 py-2 bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold rounded-full cursor-pointer hover:brightness-105 active:scale-95 shadow-sm"
          >
            Upgrade Now
          </button>
        </div>
        <div className="absolute right-[-20px] top-[-10px] opacity-20 pointer-events-none">
          <span
            className="material-symbols-outlined text-[120px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
        </div>
      </section>

      {/* Help & About Section */}
      <section className="bg-surface-container-lowest rounded-lg gold-rim shadow-[0_8px_30px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="divide-y divide-surface-variant/30">
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full flex items-center justify-between px-inner-padding py-5 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  About {APP_CONFIG.name}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Atribusi Sumber & Lisensi Resmi
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Modal Atribusi & Lisensi */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full p-6 shadow-2xl border border-accent-gold/40 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-lg text-primary font-bold">
                  About {APP_CONFIG.name}
                </h3>
                <p className="text-xs text-on-surface-variant">Versi {APP_CONFIG.version}</p>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-outline hover:text-on-surface p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-body-md text-xs text-on-surface leading-relaxed">
              {APP_CONFIG.name} adalah aplikasi Al-Qur'an digital mobile-first yang dibangun dengan komitmen menjaga kemurnian teks suci Al-Qur'an secara verbatim.
            </p>

            <div className="space-y-3 pt-2 border-t border-surface-variant">
              <h4 className="font-label-sm text-xs font-bold text-primary uppercase">
                Atribusi Sumber Data:
              </h4>

              {APP_CONFIG.attributions.map((item, idx) => (
                <div key={idx} className="bg-surface-container-low p-3 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-on-surface">{item.title}</p>
                  <p className="text-on-surface-variant text-[11px]">{item.source}</p>
                  <p className="text-secondary text-[10px] font-semibold">{item.license}</p>
                  {item.notice && (
                    <p className="text-outline text-[10px] italic">{item.notice}</p>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold text-[10px] inline-flex items-center gap-0.5 hover:underline"
                  >
                    Kunjungi Sumber <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 bg-primary text-white rounded-full font-label-sm text-xs font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

