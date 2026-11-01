import React from 'react';
import { useAudio } from '../../contexts/AudioContext';

export default function MiniPlayer({ onOpenPlayer }) {
  const {
    currentSurah,
    currentAyah,
    playbackMode,
    isPlaying,
    togglePlay,
    stopAudio,
    reciter,
    currentTime,
    duration,
  } = useAudio();

  if (!currentSurah) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-surface-container-lowest/95 dark:bg-emerald-950/95 backdrop-blur-md border-t border-accent-gold/30 shadow-lg px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 relative transition-all duration-300">
      {/* Progress Bar Tipis di Bagian Atas Mini Player */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-surface-container overflow-hidden">
        <div
          className="h-full bg-secondary transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Info Area (Klik untuk membuka Audio Player Penuh) */}
      <div
        onClick={onOpenPlayer}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
      >
        {/* Animated Disc Thumbnail */}
        <div className="relative w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 border border-accent-gold/40 shadow-sm overflow-hidden">
          <span
            className={`material-symbols-outlined text-secondary-container text-xl ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            auto_awesome
          </span>
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-headline-md text-xs sm:text-sm font-bold text-primary truncate group-hover:text-primary-container">
              {currentSurah.name}
              {playbackMode === 'ayah' && currentAyah && (
                <span className="text-secondary font-normal text-xs ml-1">
                  : {currentAyah.number}
                </span>
              )}
            </h4>
            <span className="font-arabic-display text-xs text-secondary-fixed shrink-0">
              {currentSurah.arabicName}
            </span>
          </div>
          <p className="font-label-sm text-[10px] text-on-surface-variant truncate">
            {playbackMode === 'ayah' && currentAyah
              ? `Ayat ${currentAyah.number} • ${reciter.shortName || reciter.name}`
              : reciter.shortName || reciter.name}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm hover:bg-primary transition-all active:scale-90 cursor-pointer"
          aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            stopAudio();
          }}
          className="p-1.5 text-outline hover:text-error transition-colors rounded-full cursor-pointer"
          title="Tutup Pemutar"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}

