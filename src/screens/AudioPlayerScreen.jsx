import React, { useState } from 'react';
import { APP_CONFIG } from '../config/app';

export default function AudioPlayerScreen({ surah, isPlaying, onTogglePlay, onBack }) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const currentSurah = surah || {
    number: 18,
    name: "Surah Al-Kahf",
    arabicName: "الكَهْف",
    totalAyah: 110,
  };

  const speeds = [1.0, 1.25, 1.5, 0.75];

  const handleNextSpeed = () => {
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  return (
    <main className="flex-1 geometric-pattern relative flex flex-col items-center justify-center px-container-margin py-section-padding space-y-stack-gap min-h-[calc(100vh-140px)]">
      {/* Background Blur Decorative Element */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary-container rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-fixed rounded-full blur-3xl"></div>
      </div>

      {/* Album Art Section */}
      <div className="relative w-full max-w-xs aspect-square flex items-center justify-center pt-2">
        <div className="w-64 h-64 rounded-full bg-white dark:bg-surface-container-lowest border-4 border-secondary-container/30 p-4 album-art-shadow relative overflow-hidden group">
          <div className="w-full h-full rounded-full bg-primary-container flex flex-col items-center justify-center relative overflow-hidden">
            {/* Rotating Pattern Background */}
            <div className="absolute inset-0 opacity-10 scale-150 rotate-12">
              <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45L50 0Z" fill="white" />
              </svg>
            </div>

            <span
              className="material-symbols-outlined text-secondary-container text-7xl font-extralight mb-2"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              auto_awesome
            </span>

            <span className="font-arabic-display text-2xl text-secondary-fixed">
              {currentSurah.arabicName || 'القرآن'}
            </span>
          </div>

          {/* Decorative Gold Rim */}
          <div className="absolute inset-0 border-2 border-secondary/20 rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* Surah Info */}
      <div className="text-center w-full pt-2 space-y-2">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
          Currently Playing
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary">
          {currentSurah.name.startsWith('Surah') ? currentSurah.name : `Surah ${currentSurah.name}`}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">mic</span>
          {APP_CONFIG.audio.reciterName}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs pt-4 space-y-3">
        <div className="relative h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-secondary rounded-full"></div>
        </div>
        <div className="flex justify-between font-label-sm text-label-sm text-outline">
          <span>12:45</span>
          <span>42:30</span>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs flex items-center justify-between pt-2">
        <button
          onClick={() => alert('Fitur Shuffle')}
          className="text-outline hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">shuffle</span>
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={() => alert('Surah sebelumnya')}
            className="text-primary-container dark:text-primary hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              skip_previous
            </span>
          </button>

          <button
            onClick={onTogglePlay}
            className="w-20 h-20 bg-primary-container text-on-primary rounded-full flex items-center justify-center shadow-lg shadow-primary-container/20 hover:bg-primary transition-all scale-100 active:scale-90 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => alert('Surah berikutnya')}
            className="text-primary-container dark:text-primary hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer"
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
          onClick={() => alert('Fitur Repeat')}
          className="text-outline hover:text-primary transition-colors scale-95 active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">repeat</span>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={handleNextSpeed}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-label-sm border border-secondary/10 cursor-pointer hover:bg-tertiary-fixed-dim"
        >
          <span className="material-symbols-outlined text-base mr-2">speed</span>
          {playbackSpeed}x
        </button>

        <button
          onClick={() => alert('Daftar putar berikutnya')}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-label-sm border border-secondary/10 cursor-pointer hover:bg-tertiary-fixed-dim"
        >
          <span className="material-symbols-outlined text-base mr-2">format_list_bulleted</span>
          Up Next
        </button>
      </div>
    </main>
  );
}

