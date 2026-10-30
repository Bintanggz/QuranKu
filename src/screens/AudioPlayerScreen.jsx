import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';

export default function AudioPlayerScreen() {
  const {
    currentSurah,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isLoadingAudio,
    reciter,
    togglePlay,
    seek,
    setSpeed,
    nextSurah,
    prevSurah,
    formatTime,
    upNextList,
    playSurah,
  } = useAudio();

  const [showUpNextModal, setShowUpNextModal] = useState(false);
  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  const handleNextSpeed = () => {
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <main className="flex-1 geometric-pattern relative flex flex-col items-center justify-center px-container-margin py-6 space-y-5 min-h-[calc(100vh-140px)]">
      {/* Background Blur Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary-container rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-fixed rounded-full blur-3xl"></div>
      </div>

      {/* Album Art Section */}
      <div className="relative w-full max-w-xs aspect-square flex items-center justify-center pt-1">
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white dark:bg-surface-container-lowest border-4 border-secondary-container/30 p-3.5 album-art-shadow relative overflow-hidden group">
          <div className="w-full h-full rounded-full bg-primary-container flex flex-col items-center justify-center relative overflow-hidden text-white">
            {/* Rotating Pattern Background */}
            <div
              className={`absolute inset-0 opacity-15 scale-150 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '24s' }}
            >
              <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45L50 0Z" fill="white" />
              </svg>
            </div>

            <span
              className="material-symbols-outlined text-secondary-container text-6xl sm:text-7xl font-extralight mb-1"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              auto_awesome
            </span>

            <span className="font-arabic-display text-2xl sm:text-3xl text-secondary-fixed select-none drop-shadow">
              {currentSurah.arabicName || 'القرآن'}
            </span>

            <span className="font-label-sm text-[10px] text-on-primary-container uppercase tracking-widest mt-1">
              Surah Ke-{currentSurah.number}
            </span>
          </div>

          {/* Decorative Gold Rim */}
          <div className="absolute inset-0 border-2 border-secondary/20 rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* Surah Info */}
      <div className="text-center w-full pt-1 space-y-1.5">
        <span className="font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">
          Currently Playing
        </span>
        <h2 className="font-headline-lg text-2xl font-bold text-primary">
          Surah {currentSurah.name}
        </h2>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-base">mic</span>
          {reciter.name}
        </p>
      </div>

      {/* Scrubbable Progress Bar */}
      <div className="w-full max-w-xs space-y-2 pt-2">
        <div className="relative group cursor-pointer flex items-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-container rounded-full appearance-none cursor-pointer accent-secondary focus:outline-none"
          />
        </div>
        <div className="flex justify-between font-label-sm text-xs text-outline">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoadingAudio ? 'Memuat...' : formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="w-full max-w-xs flex items-center justify-between pt-1">
        <button
          onClick={() => alert('Fitur Shuffle Aktif')}
          className="text-outline hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer p-2"
          title="Acak"
        >
          <span className="material-symbols-outlined text-2xl">shuffle</span>
        </button>

        <div className="flex items-center gap-5 sm:gap-6">
          <button
            onClick={prevSurah}
            className="text-primary-container dark:text-primary hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer p-1"
            title="Surah Sebelumnya"
          >
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              skip_previous
            </span>
          </button>

          <button
            onClick={togglePlay}
            disabled={isLoadingAudio}
            className="w-18 h-18 sm:w-20 sm:h-20 bg-primary-container text-on-primary rounded-full flex items-center justify-center shadow-lg shadow-primary-container/20 hover:bg-primary transition-all scale-100 active:scale-90 cursor-pointer"
            aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
          >
            {isLoadingAudio ? (
              <span className="material-symbols-outlined text-4xl animate-spin">
                progress_activity
              </span>
            ) : (
              <span
                className="material-symbols-outlined text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            )}
          </button>

          <button
            onClick={nextSurah}
            className="text-primary-container dark:text-primary hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer p-1"
            title="Surah Berikutnya"
          >
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              skip_next
            </span>
          </button>
        </div>

        <button
          onClick={() => alert('Mode Repeat: Putar berulang')}
          className="text-outline hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer p-2"
          title="Ulangi"
        >
          <span className="material-symbols-outlined text-2xl">repeat</span>
        </button>
      </div>

      {/* Bottom Action Chips: Speed & Up Next */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleNextSpeed}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-xs border border-secondary/10 cursor-pointer hover:bg-tertiary-fixed-dim transition-all active:scale-95 shadow-sm"
          title="Ganti Kecepatan Putar"
        >
          <span className="material-symbols-outlined text-base mr-1.5">speed</span>
          {playbackSpeed}x
        </button>

        <button
          onClick={() => setShowUpNextModal(true)}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-xs border border-secondary/10 cursor-pointer hover:bg-tertiary-fixed-dim transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-base mr-1.5">format_list_bulleted</span>
          Up Next
        </button>
      </div>

      {/* Modal Up Next Playlist */}
      {showUpNextModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-t-[28px] sm:rounded-2xl p-5 shadow-2xl border-t sm:border border-accent-gold/40 space-y-4 max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-surface-variant/40 pb-3">
              <div>
                <h3 className="font-headline-md text-base font-bold text-primary">
                  Antrean Berikutnya (Up Next)
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  Surah yang akan diputar setelah ini
                </p>
              </div>
              <button
                onClick={() => setShowUpNextModal(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar space-y-2 flex-1">
              {upNextList.map((s) => (
                <div
                  key={s.number}
                  onClick={() => {
                    playSurah(s);
                    setShowUpNextModal(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 border border-outline-variant/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center">
                      {s.number}
                    </div>
                    <div>
                      <h4 className="font-headline-md text-sm font-semibold text-primary group-hover:text-primary-container">
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        {s.meaning} • {s.totalAyah} Ayat
                      </p>
                    </div>
                  </div>
                  <span className="font-arabic-display text-lg text-primary">
                    {s.arabicName}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowUpNextModal(false)}
              className="w-full py-2.5 bg-primary text-white rounded-full font-label-sm text-xs font-semibold cursor-pointer"
            >
              Tutup Antrean
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
