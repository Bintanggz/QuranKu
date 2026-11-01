import React, { useState, useEffect, useRef } from 'react';
import { useSurahDetail } from '../hooks/useQuran';
import { setLastRead, saveBookmark, getBookmarks, removeBookmark } from '../services/storage';
import { useAudio } from '../contexts/AudioContext';

export default function SurahDetailScreen({
  surahNumber,
  onBack,
  fontSize = 28,
  onTitleLoaded,
}) {
  const { surah, loading, error, refetch } = useSurahDetail(surahNumber);
  const { playAyah, isPlayingAyah, playSurah, currentSurah, isPlaying } = useAudio();
  const [activeAyah, setActiveAyah] = useState(1);
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const verseRefs = useRef({});

  // Kirim nama surah ke Header jika tersedia
  useEffect(() => {
    if (surah && onTitleLoaded) {
      onTitleLoaded(`Surah ${surah.name}`);
    }
  }, [surah, onTitleLoaded]);

  // Simpan posisi terakhir dibaca saat membuka surah atau mengganti ayat aktif
  useEffect(() => {
    if (surah) {
      setLastRead(surah.number, surah.name, activeAyah);
    }
  }, [surah, activeAyah]);

  // Auto-scroll ke ayat yang sedang aktif diputar jika berubah
  useEffect(() => {
    if (surah && isPlaying) {
      const playingAyahIndex = surah.ayahs.find((a) =>
        isPlayingAyah(surah.number, a.number)
      );
      if (playingAyahIndex && verseRefs.current[playingAyahIndex.number]) {
        verseRefs.current[playingAyahIndex.number].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        setActiveAyah(playingAyahIndex.number);
      }
    }
  }, [surah, isPlaying, isPlayingAyah]);

  const isFullSurahBookmarked = bookmarks.some(
    (b) => b.id === `surah_${surah?.number}`
  );

  const toggleFullSurahBookmark = () => {
    if (!surah) return;
    if (isFullSurahBookmarked) {
      const updated = removeBookmark(`surah_${surah.number}`);
      setBookmarks(updated);
    } else {
      const { bookmarks: updated } = saveBookmark({
        id: `surah_${surah.number}`,
        type: 'surah',
        surahNumber: surah.number,
        surahName: surah.name,
        arabicName: surah.arabicName,
        meaning: surah.meaning,
        totalAyah: surah.totalAyah,
        revelation: surah.revelation,
      });
      setBookmarks(updated);
    }
  };

  const toggleBookmark = (ayah) => {
    const bookmarkId = `${surah.number}_${ayah.number}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);
    if (exists) {
      const updated = removeBookmark(bookmarkId);
      setBookmarks(updated);
    } else {
      const { bookmarks: updated } = saveBookmark({
        id: bookmarkId,
        type: 'ayah',
        surahNumber: surah.number,
        surahName: surah.name,
        ayahNumber: ayah.number,
        arabicText: ayah.text,
        translation: ayah.translation,
        revelation: surah.revelation,
      });
      setBookmarks(updated);
    }
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
            <div
              key={i}
              className="bg-white dark:bg-surface-container-lowest rounded-lg p-6 h-40 animate-pulse border border-surface-variant"
            ></div>
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
          className="bg-primary text-white px-6 py-2 rounded-full font-label-sm text-sm font-semibold cursor-pointer"
        >
          Coba Lagi
        </button>
      </main>
    );
  }

  const isSurahAudioPlaying =
    isPlaying && currentSurah?.number === surah.number;

  return (
    <main className="max-w-screen-md mx-auto px-container-margin py-section-padding pb-8">
      {/* Surah Header Card */}
      <div className="relative overflow-hidden bg-primary-container rounded-lg p-6 sm:p-8 mb-8 shadow-[0_20px_40px_rgba(6,78,59,0.15)] border border-secondary-container/20">
        <div className="absolute inset-0 islamic-pattern"></div>
        
        {/* Tombol Simpan Surah & Putar Surah di Sudut Kanan Atas */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={toggleFullSurahBookmark}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isFullSurahBookmarked
                ? 'bg-secondary-container text-on-secondary-container shadow-md'
                : 'bg-black/20 text-white/80 hover:text-white hover:bg-black/30'
            }`}
            title={isFullSurahBookmarked ? 'Hapus Surah dari Koleksi' : 'Simpan Surah ke Koleksi'}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isFullSurahBookmarked ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-secondary-fixed font-label-sm uppercase tracking-[0.2em] mb-3">
            Surah Ke-{surah.number}
          </span>
          <h2 className="font-headline-lg text-white mb-1">
            {surah.name}
          </h2>
          <span className="font-arabic-display text-3xl text-secondary-fixed/90 mb-3 drop-shadow">
            {surah.arabicName}
          </span>
          <div className="w-16 h-0.5 bg-secondary-container/50 mb-3"></div>
          <p className="text-on-primary-container font-body-md italic mb-1">
            {surah.meaning} • {surah.totalAyah} Ayat
          </p>
          <p className="text-secondary-fixed font-label-sm font-medium">
            {surah.revelation}
          </p>

          {/* Tombol Putar Penuh Satu Surah */}
          <button
            onClick={() => playSurah(surah)}
            className="mt-5 inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-label-sm text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: isSurahAudioPlaying ? "'FILL' 1" : "'FILL' 0" }}
            >
              {isSurahAudioPlaying ? 'pause_circle' : 'play_circle'}
            </span>
            {isSurahAudioPlaying ? 'Jeda Audio Surah' : 'Putar Audio Full Surah'}
          </button>
        </div>

        {/* Decorative Gold Ornaments */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Bismillah Header (Tampil jika bismillahPre true) */}
      {surah.bismillahPre && (
        <div className="flex justify-center mb-10">
          <div className="text-center">
            <span className="font-arabic-display text-primary text-[38px] sm:text-[46px] block mb-3 select-none leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
            <p className="text-on-surface-variant font-body-md italic text-xs sm:text-sm">
              Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
            </p>
          </div>
        </div>
      )}

      {/* Verse List */}
      <div className="space-y-stack-gap">
        {surah.ayahs.map((ayah) => {
          const isActive = activeAyah === ayah.number;
          const isCurrentlyPlaying = isPlayingAyah(surah.number, ayah.number);
          const bookmarked = isBookmarked(ayah.number);

          return (
            <article
              key={ayah.number}
              ref={(el) => (verseRefs.current[ayah.number] = el)}
              onClick={() => setActiveAyah(ayah.number)}
              className={`group relative rounded-lg p-inner-padding transition-all duration-300 cursor-pointer ${
                isCurrentlyPlaying
                  ? 'bg-amber-50/50 dark:bg-emerald-950/40 border-2 border-secondary shadow-[0_15px_30px_rgba(115,92,0,0.12)] ring-2 ring-secondary/20'
                  : isActive
                  ? 'bg-white dark:bg-surface-container-lowest border border-secondary/40 shadow-[0_10px_25px_rgba(6,78,59,0.06)]'
                  : 'bg-white dark:bg-surface-container-lowest border border-surface-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-secondary/30'
              }`}
            >
              <div className="flex flex-col gap-5">
                {/* Top Bar: Verse Number and Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full font-bold text-xs transition-colors ${
                        isCurrentlyPlaying
                          ? 'bg-secondary text-white shadow-sm'
                          : isActive
                          ? 'border-2 border-secondary text-secondary bg-secondary-container/10'
                          : 'border border-outline-variant text-outline'
                      }`}
                    >
                      {ayah.number}
                    </div>

                    {isCurrentlyPlaying && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-semibold font-label-sm">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                        Sedang Diputar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Play Audio Button (EveryAyah CDN per ayat) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAyah(ayah.number);
                        playAyah(surah, ayah, surah.ayahs);
                      }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isCurrentlyPlaying
                          ? 'text-secondary bg-secondary-container/20'
                          : isActive
                          ? 'text-secondary hover:bg-secondary-container/20'
                          : 'text-outline hover:text-secondary'
                      }`}
                      title={isCurrentlyPlaying ? 'Jeda Audio Ayat' : 'Putar Audio Ayat'}
                      aria-label={`Putar audio ayat ${ayah.number}`}
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
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
                        bookmarked
                          ? 'text-secondary hover:bg-secondary-container/20'
                          : 'text-outline hover:text-secondary'
                      }`}
                      title={bookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
                      aria-label={`Simpan ayat ${ayah.number} ke bookmark`}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
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
                      className="p-2 rounded-full text-outline hover:text-secondary transition-colors cursor-pointer"
                      title="Bagikan Ayat"
                      aria-label={`Bagikan ayat ${ayah.number}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">share</span>
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
                <div className="border-t border-surface-variant pt-3.5">
                  <p
                    className={`font-body-md leading-relaxed select-text ${
                      isCurrentlyPlaying || isActive
                        ? 'text-on-surface font-medium'
                        : 'text-on-surface-variant'
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
