import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';

export default function AudioPlayerScreen() {
  const {
    currentSurah,
    currentAyah,
    playbackMode,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isLoadingAudio,
    isShuffle,
    repeatMode,
    reciter,
    togglePlay,
    toggleShuffle,
    cycleRepeatMode,
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
    <main className="flex-1 geometric-pattern relative flex flex-col items-center justify-center px-container-margin py-6 space-y-4 min-h-[calc(100vh-140px)]">
      {/* Background Blur Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary-container rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-fixed rounded-full blur-3xl"></div>
      </div>

      {/* Album Art Section */}
      <div className="relative w-full max-w-xs aspect-square flex items-center justify-center pt-1">
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-white dark:bg-surface-container-lowest border-4 border-secondary-container/30 p-3 album-art-shadow relative overflow-hidden group">
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
              className="material-symbols-outlined text-secondary-container text-5xl sm:text-6xl font-extralight mb-1"
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
      <div className="text-center w-full pt-1 space-y-1">
        <span className="font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold block">
          {playbackMode === 'ayah' && currentAyah
            ? `Memutar Ayat ke-${currentAyah.number}`
            : 'Sedang Memutar Surah'}
        </span>
        <h2 className="font-headline-lg text-2xl font-bold text-primary">
          Surah {currentSurah.name}
        </h2>
        {playbackMode === 'ayah' && currentAyah ? (
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-xs mx-auto line-clamp-2 italic">
            "{currentAyah.translation}"
          </p>
        ) : (
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-base">mic</span>
            {reciter.name}
          </p>
        )}
      </div>

      {/* Scrubbable Progress Bar */}
      <div className="w-full max-w-xs space-y-1.5 pt-1">
        <div className="relative group cursor-pointer flex items-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-container rounded-full appearance-none cursor-pointer accent-secondary focus:outline-none"
            aria-label="Posisi pemutaran audio"
          />
        </div>
        <div className="flex justify-between font-label-sm text-xs text-outline">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoadingAudio ? 'Memuat...' : formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="w-full max-w-xs flex items-center justify-between pt-1">
        {/* Shuffle Button */}
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-full transition-all scale-95 active:scale-90 cursor-pointer ${
            isShuffle
              ? 'text-secondary bg-secondary-container/20 ring-1 ring-secondary/30'
              : 'text-outline hover:text-primary'
          }`}
          title={isShuffle ? 'Mode Acak: Aktif' : 'Mode Acak: Nonaktif'}
          aria-label="Acak daftar surah"
        >
          <span className="material-symbols-outlined text-2xl">shuffle</span>
        </button>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={prevSurah}
            className="text-primary-container dark:text-primary hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer p-1"
            title="Surah Sebelumnya"
            aria-label="Surah sebelumnya"
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
            className="w-16 h-16 sm:w-18 sm:h-18 bg-primary-container text-on-primary rounded-full flex items-center justify-center shadow-lg shadow-primary-container/20 hover:bg-primary transition-all scale-100 active:scale-90 cursor-pointer"
            aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
          >
            {isLoadingAudio ? (
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            ) : (
              <span
                className="material-symbols-outlined text-4xl sm:text-5xl"
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
            aria-label="Surah berikutnya"
          >
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              skip_next
            </span>
          </button>
        </div>

        {/* Repeat Button (Off / All / One) */}
        <button
          onClick={cycleRepeatMode}
          className={`p-2 rounded-full transition-all scale-95 active:scale-90 cursor-pointer ${
            repeatMode !== 'off'
              ? 'text-secondary bg-secondary-container/20 ring-1 ring-secondary/30'
              : 'text-outline hover:text-primary'
          }`}
          title={
            repeatMode === 'one'
              ? 'Ulangi: 1 Surah/Ayat Ini'
              : repeatMode === 'all'
              ? 'Ulangi: Semua Surah'
              : 'Ulangi: Nonaktif'
          }
          aria-label="Mode ulangi"
        >
          <span className="material-symbols-outlined text-2xl">
            {repeatMode === 'one' ? 'repeat_one' : 'repeat'}
          </span>
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
          <div className="bg-white dark:bg-surface-container-lowest w-full max-w-sm rounded-t-[32px] sm:rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col border border-accent-gold/20">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-surface-variant">
              <div>
                <h3 className="font-headline-md text-lg font-bold text-primary">
                  Antrean Berikutnya
                </h3>
                <p className="font-label-sm text-xs text-on-surface-variant">
                  Surah yang akan diputar selanjutnya
                </p>
              </div>
              <button
                onClick={() => setShowUpNextModal(false)}
                className="p-1.5 text-outline hover:text-on-surface rounded-full cursor-pointer"
                aria-label="Tutup antrean"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
              {upNextList.map((surah) => {
                const isCurrent = surah.number === currentSurah.number;
                return (
                  <div
                    key={surah.number}
                    onClick={() => {
                      playSurah(surah);
                      setShowUpNextModal(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-primary-container text-white border-transparent shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCurrent
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-primary-fixed text-primary'
                        }`}
                      >
                        {surah.number}
                      </div>
                      <div>
                        <h4
                          className={`font-headline-md text-sm font-semibold ${
                            isCurrent ? 'text-white' : 'text-primary'
                          }`}
                        >
                          {surah.name}
                        </h4>
                        <p
                          className={`font-label-sm text-[11px] ${
                            isCurrent ? 'text-on-primary-container' : 'text-outline'
                          }`}
                        >
                          {surah.totalAyah} Ayat
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-arabic-display text-lg ${
                        isCurrent ? 'text-secondary-fixed' : 'text-primary'
                      }`}
                    >
                      {surah.arabicName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
