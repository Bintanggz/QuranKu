import React, { useState, useEffect } from 'react';
import { useSurahDetail } from '../hooks/useQuran';
import { setLastRead, saveBookmark, getBookmarks } from '../services/storage';

export default function SurahDetailScreen({ surahNumber, onBack, onPlayVerse, activePlayingAyah, fontSize = 28 }) {
  const { surah, loading, error, fromCache, refetch } = useSurahDetail(surahNumber);
  const [activeAyah, setActiveAyah] = useState(1);
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  // Simpan posisi terakhir dibaca saat membuka surah atau mengganti ayat aktif
  useEffect(() => {
    if (surah) {
      setLastRead(surah.number, surah.name, activeAyah);
    }
  }, [surah, activeAyah]);

  const toggleBookmark = (ayah) => {
    const { bookmarks: updated } = saveBookmark({
      id: `${surah.number}_${ayah.number}`,
      type: 'ayah',
      surahNumber: surah.number,
      surahName: surah.name,
      ayahNumber: ayah.number,
      arabicText: ayah.text,
      translation: ayah.translation,
      revelation: surah.revelation,
    });
    setBookmarks(updated);
  };

  const isBookmarked = (ayahNumber) => {
    return bookmarks.some((b) => b.id === `${surah?.number}_${ayahNumber}`);
  };

  const handleShare = async (ayah) => {
    const shareData = {
      title: `Surah ${surah.name} : Ayat ${ayah.number}`,
      text: `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${surah.name}: ${ayah.number})`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      alert('Ayat dan terjemahan telah disalin ke clipboard.');
    }
  };

  if (loading) {
    return (
      <main className="max-w-screen-md mx-auto px-container-margin py-section-padding pb-8">
        <div className="bg-primary-container rounded-lg p-8 mb-10 h-56 animate-pulse opacity-50"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-surface-container-lowest rounded-lg p-6 h-40 animate-pulse border border-surface-variant"></div>
          ))}
        </div>
      </main>
    );
  }

  if (error || !surah) {
    return (
      <main className="max-w-screen-md mx-auto px-container-margin py-section-padding text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h3 className="font-headline-md text-lg text-primary font-bold">Gagal Memuat Surah</h3>
        <p className="font-body-md text-on-surface-variant text-sm max-w-sm mx-auto">{error}</p>
        <button
          onClick={refetch}
          className="bg-primary text-white px-6 py-2 rounded-full font-label-sm text-sm font-semibold"
        >
          Coba Lagi
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-screen-md mx-auto px-container-margin py-section-padding pb-8">
      {/* Surah Header Card */}
      <div className="relative overflow-hidden bg-primary-container rounded-lg p-8 mb-10 shadow-[0_20px_40px_rgba(6,78,59,0.15)] border border-secondary-container/20">
        <div className="absolute inset-0 islamic-pattern"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-secondary-fixed font-label-sm uppercase tracking-[0.2em] mb-4">
            Surah Ke-{surah.number}
          </span>
          <h2 className="font-headline-lg text-white mb-2">
            {surah.name}
          </h2>
          <div className="w-16 h-0.5 bg-secondary-container/50 mb-4"></div>
          <p className="text-on-primary-container font-body-md italic mb-1">
            {surah.meaning} • {surah.totalAyah} Ayat
          </p>
          <p className="text-secondary-fixed/80 font-label-sm">
            {surah.revelation}
          </p>
        </div>
        {/* Decorative Gold Ornaments */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Bismillah Header (Tampil jika bismillahPre true) */}
      {surah.bismillahPre && (
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <span className="font-arabic-display text-primary text-[42px] sm:text-[48px] block mb-4 select-none">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
            <p className="text-on-surface-variant font-body-md italic text-sm">
              Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
            </p>
          </div>
        </div>
      )}

      {/* Verse List */}
      <div className="space-y-stack-gap">
        {surah.ayahs.map((ayah) => {
          const isActive = activeAyah === ayah.number;
          const isCurrentlyPlaying = activePlayingAyah === ayah.number;
          const bookmarked = isBookmarked(ayah.number);

          return (
            <article
              key={ayah.number}
              onClick={() => setActiveAyah(ayah.number)}
              className={`group relative rounded-lg p-inner-padding transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-surface-container-lowest border border-secondary border-opacity-30 shadow-[0_15px_30px_rgba(6,78,59,0.06)] ring-1 ring-secondary/10 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'bg-white dark:bg-surface-container-lowest border border-surface-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-secondary/20'
              }`}
            >
              <div className="flex flex-col gap-6">
                {/* Top Bar: Verse Number and Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${
                        isActive
                          ? 'border-2 border-secondary text-secondary bg-secondary-container/10'
                          : 'border border-outline-variant text-outline'
                      }`}
                    >
                      {ayah.number}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Play Audio Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAyah(ayah.number);
                        if (onPlayVerse) onPlayVerse(surah, ayah);
                      }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isActive
                          ? 'text-secondary hover:bg-secondary-container/20'
                          : 'text-outline hover:text-secondary'
                      }`}
                      title={isCurrentlyPlaying ? 'Jeda Audio' : 'Putar Audio Ayat'}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontVariationSettings: isCurrentlyPlaying ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        {isCurrentlyPlaying ? 'pause_circle' : 'play_circle'}
                      </span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(ayah);
                      }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        bookmarked || isActive
                          ? 'text-secondary hover:bg-secondary-container/20'
                          : 'text-outline hover:text-secondary'
                      }`}
                      title={bookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        bookmark
                      </span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(ayah);
                      }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isActive
                          ? 'text-secondary hover:bg-secondary-container/20'
                          : 'text-outline hover:text-secondary'
                      }`}
                      title="Bagikan Ayat"
                    >
                      <span className="material-symbols-outlined">share</span>
                    </button>
                  </div>
                </div>

                {/* Arabic Text (Amiri Quran - Rasm Uthmani) */}
                <div className="text-right pt-1">
                  <p
                    className="font-arabic-display text-primary leading-relaxed select-text font-bold"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
                    dir="rtl"
                  >
                    {ayah.text}
                  </p>
                </div>

                {/* Translation (Indonesian - Kemenag RI) */}
                <div className="border-t border-surface-variant pt-4">
                  <p
                    className={`font-body-md leading-relaxed select-text ${
                      isActive ? 'text-on-surface' : 'text-on-surface-variant'
                    }`}
                  >
                    {ayah.translation}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

