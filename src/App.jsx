import React, { useState, useEffect, useMemo } from 'react';
import { APP_CONFIG } from './config/app';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import KartuSurah from './components/common/KartuSurah';
import TombolAksi from './components/common/TombolAksi';
import Tab from './components/common/Tab';
import SurahDetailView from './components/detail/SurahDetailView';
import { useSurahList } from './hooks/useQuran';
import { downloadAllSurahsForOffline } from './services/quranService';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [categoryTab, setCategoryTab] = useState('surah');
  const [bookmarkFilter, setBookmarkFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(null);
  const [fontSize, setFontSize] = useState(18);

  // Audio Player State
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Download Offline State
  const [downloadProgress, setDownloadProgress] = useState(null);

  // Data Layer: 114 Surahs
  const { surahs, loading: surahLoading, error: surahError, refetch: refetchSurahs } = useSurahList();

  // Dark Mode State dengan sinkronisasi ke document.documentElement
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('quranku_dark_mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('quranku_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Last Read State
  const [lastRead, setLastRead] = useState(() => {
    try {
      const saved = localStorage.getItem('quranku_last_read');
      return saved ? JSON.parse(saved) : { number: 1, name: "Al-Fatihah", ayat: 1 };
    } catch {
      return { number: 1, name: "Al-Fatihah", ayat: 1 };
    }
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('quranku_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Refresh bookmarks saat pindah ke tab bookmark
  useEffect(() => {
    if (activeTab === 'bookmark') {
      try {
        const saved = localStorage.getItem('quranku_bookmarks');
        if (saved) setBookmarks(JSON.parse(saved));
      } catch {}
    }
  }, [activeTab]);

  const handleOpenSurah = (surahNumber) => {
    setSelectedSurahNumber(surahNumber);
    const selected = surahs.find((s) => s.number === surahNumber);
    if (selected) {
      const updatedLast = {
        number: selected.number,
        name: selected.name,
        ayat: 1,
        updatedAt: Date.now(),
      };
      setLastRead(updatedLast);
      localStorage.setItem('quranku_last_read', JSON.stringify(updatedLast));
    }
  };

  const handleBackFromDetail = () => {
    setSelectedSurahNumber(null);
  };

  const handlePlayVerse = (surah, ayah) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(ayah.audioUrl);
    setCurrentAudio(audio);
    setIsPlaying(true);
    audio.play().catch((err) => {
      console.warn('Gagal memutar audio:', err);
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
  };

  // Filter Surah berdasarkan pencarian
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    const q = searchQuery.toLowerCase().trim();
    return surahs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        String(s.number) === q
    );
  }, [surahs, searchQuery]);

  const categoryTabs = [
    { id: 'surah', label: 'Surah' },
    { id: 'juz', label: 'Juz' },
    { id: 'bookmark', label: 'Bookmark' },
    { id: 'page', label: 'Halaman' },
  ];

  const bookmarkTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'ayah', label: 'Ayat' },
    { id: 'recent', label: 'Terakhir Dibaca' },
  ];

  const handleDownloadOffline = async () => {
    setDownloadProgress({ completed: 0, total: 114 });
    await downloadAllSurahsForOffline((completed, total) => {
      setDownloadProgress({ completed, total });
    });
    setTimeout(() => {
      setDownloadProgress(null);
      alert('Alhamdulillah! Seluruh 114 Surah (30 Juz) berhasil disimpan di perangkat untuk akses offline.');
    }, 500);
  };

  return (
    // Outer frame: Selebar HP (maks 430px) di tengah layar
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-950 flex justify-center items-center sm:py-6 sm:px-4 transition-colors duration-200">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] sm:max-h-[920px] bg-background text-on-background flex flex-col sm:rounded-[36px] sm:shadow-2xl overflow-hidden relative border-x border-outline-variant/20 transition-colors duration-200">
        
        {/* Header Bersama */}
        <Header
          title={
            selectedSurahNumber
              ? `Surah ${surahs.find((s) => s.number === selectedSurahNumber)?.name || ''}`
              : activeTab === 'home'
              ? APP_CONFIG.name
              : activeTab === 'bookmark'
              ? 'Tersimpan'
              : activeTab === 'audio'
              ? 'Audio Player'
              : 'Pengaturan'
          }
          showBack={selectedSurahNumber !== null}
          onBack={handleBackFromDetail}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onSearch={() => {
            if (selectedSurahNumber) setSelectedSurahNumber(null);
            setActiveTab('home');
            const input = document.getElementById('search-surah-input');
            if (input) input.focus();
          }}
        />

        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          
          {/* TAMPILAN DETAIL SURAH (Jika ada surah yang dipilih) */}
          {selectedSurahNumber !== null ? (
            <SurahDetailView
              surahNumber={selectedSurahNumber}
              onBack={handleBackFromDetail}
              onPlayVerse={handlePlayVerse}
            />
          ) : (
            <>
              {/* TAB 1: HOME */}
              {activeTab === 'home' && (
                <div className="p-container-margin space-y-5">
                  {/* Sapaan Pengguna */}
                  <section className="space-y-1 pt-1">
                    <p className="font-label-sm text-xs text-surface-tint uppercase tracking-wider">
                      Assalamu'alaikum
                    </p>
                    <h2 className="font-headline-lg text-2xl font-bold text-primary">
                      Ahmad Sulaiman
                    </h2>
                  </section>

                  {/* Hero Card: Terakhir Dibaca */}
                  <section className="relative overflow-hidden bg-primary-container rounded-lg p-inner-padding text-white shadow-soft-emerald">
                    <div className="absolute inset-0 sacred-pattern pointer-events-none"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary-fixed text-xl">
                          menu_book
                        </span>
                        <span className="font-label-sm text-xs text-on-primary-container tracking-wider uppercase">
                          Terakhir Dibaca
                        </span>
                      </div>

                      <div>
                        <h3 className="font-headline-md text-2xl font-bold">
                          {lastRead.name}
                        </h3>
                        <p className="font-body-md text-sm text-on-primary-container opacity-90 mt-0.5">
                          Surah Ke-{lastRead.number} • Ayat No: {lastRead.ayat}
                        </p>
                      </div>

                      <TombolAksi
                        variant="secondary"
                        icon="arrow_forward"
                        onClick={() => handleOpenSurah(lastRead.number)}
                      >
                        Lanjutkan Membaca
                      </TombolAksi>
                    </div>
                  </section>

                  {/* Search Bar Minimalis */}
                  <section className="relative">
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none">
                        search
                      </span>
                      <input
                        id="search-surah-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari Surah, arti, atau nomor..."
                        className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-full py-3.5 pl-12 pr-10 text-sm shadow-card-ambient focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all placeholder:text-outline/60"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 text-outline hover:text-on-surface"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      )}
                    </div>
                  </section>

                  {/* Category Filter Tabs */}
                  <section>
                    <Tab
                      tabs={categoryTabs}
                      activeTab={categoryTab}
                      onChange={(t) => {
                        setCategoryTab(t);
                        if (t === 'bookmark') setActiveTab('bookmark');
                      }}
                    />
                  </section>

                  {/* Daftar 114 Surah (Data Nyata dari Data Layer) */}
                  <section className="space-y-3 pt-1">
                    <div className="flex justify-between items-center px-1">
                      <span className="font-label-sm text-xs text-surface-tint uppercase tracking-wider font-semibold">
                        Daftar Surah ({filteredSurahs.length})
                      </span>
                      <span className="font-label-sm text-xs text-outline">
                        Standar Uthmani (Tanzil)
                      </span>
                    </div>

                    {/* Loading State */}
                    {surahLoading && (
                      <div className="space-y-2.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            className="bg-surface-container-lowest p-inner-padding rounded-DEFAULT animate-pulse h-20"
                          ></div>
                        ))}
                      </div>
                    )}

                    {/* Error State */}
                    {surahError && (
                      <div className="bg-error-container/20 text-error p-4 rounded-DEFAULT text-center space-y-2">
                        <p className="text-xs font-semibold">{surahError}</p>
                        <button
                          onClick={refetchSurahs}
                          className="text-xs underline font-bold"
                        >
                          Coba Lagi
                        </button>
                      </div>
                    )}

                    {/* Daftar Surah Selesai Dimuat */}
                    {!surahLoading && !surahError && (
                      <div className="space-y-2.5">
                        {filteredSurahs.length === 0 ? (
                          <div className="text-center py-8 text-on-surface-variant text-xs">
                            Tidak ditemukan surah dengan kata kunci "{searchQuery}"
                          </div>
                        ) : (
                          filteredSurahs.map((surah) => (
                            <KartuSurah
                              key={surah.number}
                              number={surah.number}
                              name={surah.name}
                              arabicName={surah.arabicName}
                              meaning={surah.meaning}
                              revelation={surah.revelation}
                              totalAyah={surah.totalAyah}
                              onClick={() => handleOpenSurah(surah.number)}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* TAB 2: BOOKMARK */}
              {activeTab === 'bookmark' && (
                <div className="p-container-margin space-y-5">
                  <section className="space-y-1">
                    <span className="font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold block">
                      Koleksi Anda
                    </span>
                    <h2 className="font-headline-lg text-2xl font-bold text-primary">
                      Ayat & Surah Tersimpan
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant">
                      {bookmarks.length} ayat tersimpan di perangkat Anda.
                    </p>
                  </section>

                  <Tab
                    tabs={bookmarkTabs}
                    activeTab={bookmarkFilter}
                    onChange={setBookmarkFilter}
                  />

                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <span className="material-symbols-outlined text-outline text-5xl opacity-40">
                        bookmark_border
                      </span>
                      <h4 className="font-headline-md text-base font-semibold text-primary">
                        Belum Ada Bookmark
                      </h4>
                      <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                        Tandai ayat favorit Anda saat membaca surah agar tersimpan di sini.
                      </p>
                      <TombolAksi
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveTab('home')}
                      >
                        Buka Al-Qur'an
                      </TombolAksi>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookmarks.map((bm) => (
                        <div
                          key={bm.id}
                          className="bg-surface-container-lowest gold-rim-subtle rounded-DEFAULT p-inner-padding shadow-card-ambient space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-headline-md text-sm font-bold text-primary">
                                QS. {bm.surahName} : Ayat {bm.ayahNumber}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                const updated = bookmarks.filter((b) => b.id !== bm.id);
                                setBookmarks(updated);
                                localStorage.setItem('quranku_bookmarks', JSON.stringify(updated));
                              }}
                              className="text-error hover:opacity-80 p-1"
                              title="Hapus Bookmark"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>

                          <p className="quran-arabic text-xl text-primary font-bold">
                            {bm.arabicText}
                          </p>

                          <p className="font-body-md text-xs text-on-surface italic border-l-2 border-secondary pl-2.5 leading-relaxed">
                            "{bm.translation}"
                          </p>

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleOpenSurah(bm.surahNumber)}
                              className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                            >
                              Buka Surah
                              <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AUDIO PLAYER */}
              {activeTab === 'audio' && (
                <div className="p-container-margin flex flex-col items-center justify-center text-center space-y-6 pt-4">
                  <span className="font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">
                    Pemutar Murottal
                  </span>

                  {/* Disc Art */}
                  <div className="relative w-56 h-56 rounded-full bg-surface-container-lowest border-4 border-secondary-container/40 p-4 shadow-album-art flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-primary-container flex flex-col items-center justify-center text-white relative overflow-hidden">
                      <div className="absolute inset-0 sacred-pattern pointer-events-none"></div>
                      <span className="material-symbols-outlined text-secondary-container text-6xl">
                        auto_awesome
                      </span>
                      <span className="font-arabic-display text-2xl text-secondary-fixed mt-1">
                        {surahs[0]?.arabicName || 'الفَاتِحَة'}
                      </span>
                    </div>
                    <div className="absolute inset-0 border-2 border-accent-gold/40 rounded-full pointer-events-none"></div>
                  </div>

                  <div>
                    <h3 className="font-headline-lg text-2xl font-bold text-primary">
                      Surah Al-Fatihah
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1 flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">mic</span>
                      {APP_CONFIG.audio.reciterName}
                    </p>
                  </div>

                  <div className="w-full max-w-xs space-y-2">
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-300"
                        style={{ width: `${audioProgress || 15}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-label-sm text-[11px] text-outline">
                      <span>00:15</span>
                      <span>00:45</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => alert('Pilih ayat sebelumnya')}
                      className="text-outline hover:text-primary transition-colors p-2"
                    >
                      <span className="material-symbols-outlined text-2xl">skip_previous</span>
                    </button>

                    <button
                      onClick={() => {
                        const s1 = surahs[0];
                        if (s1) {
                          handlePlayVerse(s1, {
                            number: 1,
                            audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
                          });
                        }
                      }}
                      className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg shadow-primary-container/30 active:scale-95 transition-all"
                      aria-label={isPlaying ? 'Jeda' : 'Putar'}
                    >
                      <span className="material-symbols-outlined text-3xl fill-1">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <button
                      onClick={() => alert('Pilih ayat berikutnya')}
                      className="text-outline hover:text-primary transition-colors p-2"
                    >
                      <span className="material-symbols-outlined text-2xl">skip_next</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="p-container-margin space-y-5">
                  <section className="space-y-1">
                    <h2 className="font-headline-lg text-2xl font-bold text-primary">
                      Pengaturan
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant">
                      Kustomisasi tampilan dan penyimpanan offline
                    </p>
                  </section>

                  {/* Mode Offline / Unduh 30 Juz */}
                  <div className="bg-surface-container-lowest rounded-DEFAULT gold-rim-subtle shadow-card-ambient p-inner-padding space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">download_for_offline</span>
                        </div>
                        <div>
                          <p className="font-body-md text-sm font-semibold text-on-surface">
                            Unduh 30 Juz (Offline)
                          </p>
                          <p className="font-label-sm text-[11px] text-on-surface-variant">
                            Simpan seluruh 114 surah ke IndexedDB
                          </p>
                        </div>
                      </div>
                    </div>

                    {downloadProgress ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] text-on-surface-variant">
                          <span>Mengunduh...</span>
                          <span>{downloadProgress.completed} / {downloadProgress.total} surah</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-200"
                            style={{
                              width: `${(downloadProgress.completed / downloadProgress.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <TombolAksi
                        variant="primary"
                        size="sm"
                        className="w-full mt-2"
                        onClick={handleDownloadOffline}
                      >
                        Unduh Semua Surah Sekarang
                      </TombolAksi>
                    )}
                  </div>

                  {/* Tampilan / Appearance */}
                  <div className="bg-surface-container-lowest rounded-DEFAULT gold-rim-subtle shadow-card-ambient overflow-hidden">
                    <div className="px-inner-padding py-3 border-b border-surface-variant/50">
                      <h3 className="font-label-sm text-xs text-surface-tint uppercase tracking-wider font-semibold">
                        Tampilan
                      </h3>
                    </div>

                    <div className="divide-y divide-surface-variant/30">
                      {/* Toggle Dark Mode */}
                      <div className="flex items-center justify-between p-inner-padding">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">
                              {darkMode ? 'dark_mode' : 'light_mode'}
                            </span>
                          </div>
                          <div>
                            <p className="font-body-md text-sm font-semibold text-on-surface">
                              Mode Gelap
                            </p>
                            <p className="font-label-sm text-[11px] text-on-surface-variant">
                              Nyaman untuk membaca di malam hari
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>

                      {/* Slider Font Size */}
                      <div className="p-inner-padding space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">format_size</span>
                          </div>
                          <div>
                            <p className="font-body-md text-sm font-semibold text-on-surface">
                              Ukuran Teks Arab: {fontSize}px
                            </p>
                            <p className="font-label-sm text-[11px] text-on-surface-variant">
                              Sesuaikan ukuran kenyamanan membaca
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 px-2">
                          <span className="text-xs text-outline">A</span>
                          <input
                            type="range"
                            min="14"
                            max="32"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                          />
                          <span className="text-base font-bold text-on-surface">A</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Atribusi Resmi */}
                  <div className="bg-surface-container-lowest rounded-DEFAULT gold-rim-subtle shadow-card-ambient p-inner-padding space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                        QK
                      </div>
                      <div>
                        <h4 className="font-headline-md text-sm font-bold text-primary">
                          {APP_CONFIG.name} v{APP_CONFIG.version}
                        </h4>
                        <p className="font-label-sm text-[11px] text-on-surface-variant">
                          {APP_CONFIG.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-on-surface-variant space-y-1.5 leading-relaxed pt-1 border-t border-surface-variant/40">
                      <p>
                        • <strong>Teks Arab:</strong> Tanzil Project (Rasm Uthmani, Lisensi CC BY 3.0).
                      </p>
                      <p>
                        • <strong>Terjemahan:</strong> Kementerian Agama Republik Indonesia (Kemenag RI).
                      </p>
                      <p>
                        • <strong>Audio Qari:</strong> Syaikh Mishary Rashid Alafasy via EveryAyah.com & Quranicaudio.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedSurahNumber(null);
            setActiveTab(tab);
          }}
        />
      </div>
    </div>
  );
}
