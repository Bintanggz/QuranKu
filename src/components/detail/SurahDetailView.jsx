import React, { useState } from 'react';
import { useSurahDetail } from '../../hooks/useQuran';

export default function SurahDetailView({ surahNumber, onBack, onPlayVerse }) {
  const { surah, loading, error, fromCache, refetch } = useSurahDetail(surahNumber);
  const [activeAyah, setActiveAyah] = useState(1);
  const [savedAyahs, setSavedAyahs] = useState(() => {
    try {
      const saved = localStorage.getItem('quranku_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmarkAyah = (ayah) => {
    const bookmarkId = `${surah.number}_${ayah.number}`;
    let updated;
    const exists = savedAyahs.some((b) => b.id === bookmarkId);

    if (exists) {
      updated = savedAyahs.filter((b) => b.id !== bookmarkId);
    } else {
      updated = [
        ...savedAyahs,
        {
          id: bookmarkId,
          surahNumber: surah.number,
          surahName: surah.name,
          ayahNumber: ayah.number,
          arabicText: ayah.text,
          translation: ayah.translation,
          savedAt: Date.now(),
        },
      ];
    }

    setSavedAyahs(updated);
    localStorage.setItem('quranku_bookmarks', JSON.stringify(updated));
  };

  // Status Loading
  if (loading) {
    return (
      <div className="p-container-margin space-y-4">
        <div className="animate-pulse bg-primary-container/20 h-44 rounded-lg"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse bg-surface-container-low h-32 rounded-DEFAULT"></div>
          ))}
        </div>
      </div>
    );
  }

  // Status Error / Offline
  if (error || !surah) {
    return (
      <div className="p-container-margin py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">wifi_off</span>
        </div>
        <h3 className="font-headline-md text-lg font-bold text-primary">
          Gagal Memuat Surah
        </h3>
        <p className="font-body-md text-xs text-on-surface-variant max-w-xs mx-auto">
          {error || 'Data surah tidak dapat ditemukan.'}
        </p>
        <button
          onClick={refetch}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-sm text-xs font-semibold shadow-sm hover:brightness-110 active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-container-margin space-y-5 pb-24">
      {/* Header Surah Card */}
      <div className="relative overflow-hidden bg-primary-container rounded-lg p-6 text-center text-white shadow-header-deep border border-secondary-container/20">
        <div className="absolute inset-0 islamic-pattern pointer-events-none"></div>
        
        {fromCache && (
          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-secondary-fixed flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">offline_pin</span>
            Offline
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-secondary-fixed font-label-sm uppercase tracking-[0.2em] text-[11px] mb-2 font-semibold">
            Surah Ke-{surah.number}
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold mb-1">
            {surah.name}
          </h2>
          <span className="font-arabic-display text-2xl text-secondary-fixed mb-2">
            {surah.arabicName}
          </span>

          <div className="w-14 h-0.5 bg-secondary-container/50 mb-3"></div>

          <p className="text-on-primary-container font-body-md text-xs italic">
            {surah.meaning} • {surah.totalAyah} Ayat
          </p>
          <p className="text-secondary-fixed/90 font-label-sm text-[10px] tracking-wider uppercase mt-1">
            {surah.revelation}
          </p>
        </div>
      </div>

      {/* Bismillah Banner (Kecuali Surah 1 & 9) */}
      {surah.bismillahPre && (
        <div className="text-center py-4 space-y-1">
          <p className="quran-arabic text-3xl sm:text-4xl text-primary font-bold">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
          <p className="font-body-md text-xs text-on-surface-variant italic">
            Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
          </p>
        </div>
      )}

      {/* Daftar Ayat */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah) => {
          const isBookmarked = savedAyahs.some((b) => b.id === `${surah.number}_${ayah.number}`);
          const isActive = activeAyah === ayah.number;

          return (
            <article
              key={ayah.number}
              id={`ayah-${ayah.number}`}
              onClick={() => setActiveAyah(ayah.number)}
              className={`group bg-surface-container-lowest rounded-DEFAULT p-inner-padding border transition-all duration-200 ${
                isActive
                  ? 'border-secondary/40 ring-1 ring-secondary/20 shadow-verse-active bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-outline-variant/30 shadow-verse-default hover:border-secondary/20'
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Bar Nomor Ayat & Tombol Aksi */}
                <div className="flex justify-between items-center">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isActive
                        ? 'border-2 border-secondary bg-secondary-container/20 text-secondary'
                        : 'border border-outline-variant text-outline'
                    }`}
                  >
                    {ayah.number}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPlayVerse) onPlayVerse(surah, ayah);
                      }}
                      className="p-1.5 rounded-full text-secondary hover:bg-secondary-container/20 transition-colors"
                      title="Putar Audio Ayat"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        play_circle
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmarkAyah(ayah);
                      }}
                      className="p-1.5 rounded-full text-secondary hover:bg-secondary-container/20 transition-colors"
                      title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isBookmarked ? 'fill-1' : ''}`}>
                        bookmark
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.share) {
                          navigator.share({
                            title: `Surah ${surah.name} : ${ayah.number}`,
                            text: `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${surah.name}: ${ayah.number})`,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(
                            `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${surah.name}: ${ayah.number})`
                          );
                          alert('Ayat dan terjemahan disalin ke clipboard!');
                        }
                      }}
                      className="p-1.5 rounded-full text-outline hover:text-secondary hover:bg-secondary-container/20 transition-colors"
                      title="Bagikan Ayat"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        share
                      </span>
                    </button>
                  </div>
                </div>

                {/* Teks Arab (Rasm Uthmani) dengan Harakat Akurat */}
                <div className="text-right pt-1">
                  <p className="quran-arabic text-2xl sm:text-[28px] text-primary font-bold">
                    {ayah.text}
                  </p>
                </div>

                {/* Terjemahan Bahasa Indonesia Resmi Kemenag */}
                <div className="border-t border-surface-variant/60 pt-3">
                  <p className="font-body-md text-xs sm:text-[13px] text-on-surface leading-relaxed">
                    {ayah.translation}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

