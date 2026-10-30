import React, { useState, useEffect } from 'react';
import { getBookmarks, removeBookmark, getLastRead } from '../services/storage';

export default function BookmarksScreen({ onOpenSurah, onPlayVerse }) {
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'surahs', 'ayats', 'last_read'
  const lastRead = getLastRead();

  // Reload bookmarks saat komponen aktif
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id) => {
    const updated = removeBookmark(id);
    setBookmarks(updated);
  };

  const filters = [
    { id: 'all', label: 'All Bookmarks' },
    { id: 'surahs', label: 'Surahs' },
    { id: 'ayats', label: 'Ayats' },
    { id: 'last_read', label: 'Last Read' },
  ];

  const displayedBookmarks = bookmarks.filter((bm) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'surahs') return bm.type === 'surah';
    if (activeFilter === 'ayats') return bm.type !== 'surah';
    if (activeFilter === 'last_read') return bm.surahNumber === lastRead.number;
    return true;
  });

  return (
    <main className="max-w-screen-xl mx-auto px-container-margin pt-8 pb-8">
      {/* Header Section */}
      <div className="mb-section-padding">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2 block font-semibold">
          Your Collection
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary">
          Saved Verses
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-lg">
          Revisit the ayats and surahs that resonated with your soul during your journey.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-tertiary-fixed text-primary hover:bg-tertiary-fixed-dim'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap">
        {/* Featured Surah Card (Al-Kahf) dari Desain Stitch */}
        {(activeFilter === 'all' || activeFilter === 'surahs') && (
          <div className="md:col-span-2 bg-primary-container text-white rounded-lg p-inner-padding relative overflow-hidden shadow-xl border border-[#D4AF37]/20">
            <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">auto_stories</span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-tighter">
                    Full Surah
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <h3 className="font-headline-lg text-headline-lg mb-2">
                  Al-Kahf
                </h3>
                <p className="font-body-md text-on-primary-container max-w-md">
                  Saved for Friday reading. The Cave reveals four stories that serve as trials of faith, wealth, knowledge, and power.
                </p>
              </div>
              <div className="flex flex-row md:flex-col gap-3">
                <button
                  onClick={() => onOpenSurah(18)}
                  className="bg-white text-primary px-8 py-3 rounded-full font-label-sm text-label-sm font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  Read Now
                </button>
                <button
                  onClick={() => onOpenSurah(18)}
                  className="bg-primary text-white border border-white/20 px-8 py-3 rounded-full font-label-sm text-label-sm font-bold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Jika belum ada bookmark ayat tersimpan */}
        {displayedBookmarks.length === 0 && activeFilter !== 'surahs' && (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
              <span className="material-symbols-outlined text-3xl">bookmark_border</span>
            </div>
            <h4 className="font-headline-md text-lg text-primary font-bold mb-1">
              No Bookmarks Yet
            </h4>
            <p className="font-body-md text-on-surface-variant text-sm max-w-xs mb-6">
              Start your journey and save the verses that touch your heart to find them here later.
            </p>
            <button
              onClick={() => onOpenSurah(1)}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-sm text-label-sm font-bold shadow-xl cursor-pointer"
            >
              Explore Surahs
            </button>
          </div>
        )}

        {/* Daftar Kartu Ayat Tersimpan */}
        {displayedBookmarks.map((bm) => (
          <div
            key={bm.id}
            className="bg-white dark:bg-surface-container-lowest border border-[#D4AF37]/30 rounded-lg p-inner-padding shadow-[0_8px_30px_rgba(6,78,59,0.04)] relative overflow-hidden group"
          >
            {/* Bookmark Icon Top-Right */}
            <div className="absolute top-0 right-0 p-4">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bookmark
              </span>
            </div>

            {/* Surah Header in Card */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-headline-md text-on-primary-fixed text-sm font-bold shrink-0">
                {bm.surahNumber}
              </div>
              <div>
                <h3 className="font-headline-md text-primary text-lg font-semibold">
                  {bm.surahName}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Verse {bm.ayahNumber}
                </p>
              </div>
            </div>

            {/* Arabic Text & Translation */}
            <div className="mb-4 space-y-3">
              <p
                className="font-arabic-display text-primary text-right leading-relaxed text-2xl select-text"
                dir="rtl"
              >
                {bm.arabicText}
              </p>
              <p className="font-body-md text-body-md text-on-surface italic border-l-2 border-secondary pl-4 select-text leading-relaxed">
                "{bm.translation}"
              </p>
            </div>

            {/* Card Footer: Listen & Remove */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface-variant">
              <button
                onClick={() => {
                  if (onPlayVerse) {
                    onPlayVerse(
                      { number: bm.surahNumber, name: bm.surahName },
                      { number: bm.ayahNumber }
                    );
                  }
                }}
                className="flex items-center gap-2 text-primary font-label-sm text-label-sm hover:opacity-70 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">play_circle</span>
                Listen
              </button>

              <button
                onClick={() => handleRemove(bm.id)}
                className="flex items-center gap-2 text-error font-label-sm text-label-sm hover:opacity-70 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

