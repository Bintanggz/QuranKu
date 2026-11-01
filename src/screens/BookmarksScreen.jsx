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
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'surahs', label: 'Surah' },
    { id: 'ayats', label: 'Ayat' },
    { id: 'last_read', label: 'Terakhir Dibaca' },
  ];

  const displayedBookmarks = bookmarks.filter((bm) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'surahs') return bm.type === 'surah';
    if (activeFilter === 'ayats') return bm.type !== 'surah';
    if (activeFilter === 'last_read') return bm.surahNumber === lastRead.number;
    return true;
  });

  const savedSurahs = bookmarks.filter((b) => b.type === 'surah');

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Header Section */}
      <div className="mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-1.5 block font-semibold">
          Koleksi Anda
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary">
          Ayat & Surah Tersimpan
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant mt-1.5 max-w-lg">
          Kunjungi kembali ayat dan surah pilihan untuk menemani perjalanan tadabbur harian Anda.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full font-label-sm text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm font-semibold'
                  : 'bg-tertiary-fixed text-primary hover:bg-tertiary-fixed-dim'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Bookmarks Section */}
      <div className="space-y-4">
        {/* Rekomendasi Al-Kahf (Khusus Hari Jumat / Rekomendasi Tilawah) */}
        {(activeFilter === 'all' || activeFilter === 'surahs') && savedSurahs.length === 0 && (
          <div className="bg-primary-container text-white rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xl border border-[#D4AF37]/20">
            <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[180px]">auto_stories</span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-tighter">
                    Sunnah Jumat
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <h3 className="font-headline-lg text-2xl font-bold mb-1.5">
                  Surah Al-Kahf
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-primary-container max-w-md leading-relaxed">
                  Disunnahkan membaca Surah Al-Kahf pada hari Jumat untuk mendapatkan pancaran cahaya di antara dua Jumat.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => onOpenSurah(18)}
                  className="bg-white text-primary px-6 py-2.5 rounded-full font-label-sm text-xs font-bold shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Baca Surah Al-Kahf</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Jika belum ada bookmark apa pun */}
        {displayedBookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
              <span className="material-symbols-outlined text-2xl">bookmark_border</span>
            </div>
            <h4 className="font-headline-md text-base text-primary font-bold mb-1">
              Belum Ada Koleksi Tersimpan
            </h4>
            <p className="font-body-md text-on-surface-variant text-xs max-w-xs mb-5">
              Tandai ayat atau surah favorit saat membaca agar mudah ditemukan kembali di halaman ini.
            </p>
            <button
              onClick={() => onOpenSurah(1)}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-sm text-xs font-bold shadow-md cursor-pointer hover:bg-primary-container transition-colors"
            >
              Jelajahi 114 Surah
            </button>
          </div>
        )}

        {/* Daftar Kartu Ayat & Surah Tersimpan dalam Grid Responsif */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedBookmarks.map((bm) => {
          // Kartu Surah Penuh
          if (bm.type === 'surah') {
            return (
              <div
                key={bm.id}
                className="bg-white dark:bg-surface-container-lowest border border-[#D4AF37]/40 rounded-lg p-inner-padding shadow-[0_8px_30px_rgba(6,78,59,0.04)] relative overflow-hidden group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-headline-md text-primary text-sm font-bold shrink-0">
                      {bm.surahNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          Full Surah
                        </span>
                      </div>
                      <h3 className="font-headline-md text-primary text-base font-bold pt-0.5">
                        Surah {bm.surahName}
                      </h3>
                      <p className="font-label-sm text-xs text-on-surface-variant">
                        {bm.meaning} • {bm.totalAyah} Ayat
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-arabic-display text-xl text-primary block leading-none">
                      {bm.arabicName}
                    </span>
                    <span className="font-label-sm text-[10px] text-surface-tint font-semibold uppercase mt-1 block">
                      {bm.revelation}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-surface-variant/40">
                  <button
                    onClick={() => onOpenSurah(bm.surahNumber)}
                    className="flex items-center gap-1.5 text-primary font-label-sm text-xs font-bold hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">menu_book</span>
                    Buka Surah
                  </button>

                  <button
                    onClick={() => handleRemove(bm.id)}
                    className="flex items-center gap-1.5 text-error font-label-sm text-xs hover:opacity-70 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Hapus
                  </button>
                </div>
              </div>
            );
          }

          // Kartu Ayat Tersimpan
          return (
            <div
              key={bm.id}
              className="bg-white dark:bg-surface-container-lowest border border-[#D4AF37]/30 rounded-lg p-inner-padding shadow-[0_8px_30px_rgba(6,78,59,0.04)] relative overflow-hidden group"
            >
              {/* Bookmark Icon Top-Right */}
              <div className="absolute top-0 right-0 p-4">
                <span
                  className="material-symbols-outlined text-secondary text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bookmark
                </span>
              </div>

              {/* Surah Header in Card */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center font-headline-md text-on-primary-fixed text-xs font-bold shrink-0">
                  {bm.surahNumber}
                </div>
                <div>
                  <h3 className="font-headline-md text-primary text-base font-semibold">
                    Surah {bm.surahName}
                  </h3>
                  <p className="font-label-sm text-xs text-on-surface-variant">
                    Ayat ke-{bm.ayahNumber}
                  </p>
                </div>
              </div>

              {/* Arabic Text & Translation */}
              <div className="mb-3 space-y-2">
                <p
                  className="font-arabic-display text-primary text-right leading-relaxed text-xl select-text font-bold"
                  dir="rtl"
                >
                  {bm.arabicText}
                </p>
                <p className="font-body-md text-xs sm:text-sm text-on-surface italic border-l-2 border-secondary pl-3 select-text leading-relaxed">
                  "{bm.translation}"
                </p>
              </div>

              {/* Card Footer: Listen & Remove */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-surface-variant/40">
                <button
                  onClick={() => {
                    if (onPlayVerse) {
                      onPlayVerse(
                        { number: bm.surahNumber, name: bm.surahName },
                        { number: bm.ayahNumber }
                      );
                    }
                  }}
                  className="flex items-center gap-1.5 text-primary font-label-sm text-xs font-semibold hover:opacity-70 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  Dengarkan
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onOpenSurah(bm.surahNumber)}
                    className="flex items-center gap-1 text-primary font-label-sm text-xs hover:underline cursor-pointer"
                  >
                    Buka Surah
                  </button>

                  <button
                    onClick={() => handleRemove(bm.id)}
                    className="flex items-center gap-1 text-error font-label-sm text-xs hover:opacity-70 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </main>
  );
}
