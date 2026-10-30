import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from './config/app';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useSurahList } from './hooks/useQuran';
import { useRouter } from './router';

export default function App() {
  const { route, navigate } = useRouter();
  const { surahs, loading: surahLoading, error: surahError } = useSurahList();

  // Audio State Global (agar audio tetap bisa berputar antar screen)
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlayingAyah, setActivePlayingAyah] = useState(null);
  const [playingSurah, setPlayingSurah] = useState(null);

  // Dark Mode State
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

  // Font Size State
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem('quranku_font_size');
      return saved ? Number(saved) : 18;
    } catch {
      return 18;
    }
  });

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('quranku_font_size', String(size));
  };

  // Audio Player Controller
  const handlePlayVerse = (surah, ayah) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (activePlayingAyah === ayah.number && isPlaying) {
      setIsPlaying(false);
      setActivePlayingAyah(null);
      return;
    }

    const sNum = String(surah.number).padStart(3, '0');
    const aNum = String(ayah.number).padStart(3, '0');
    const audioUrl = `${APP_CONFIG.audio.verseBaseUrl}/${sNum}${aNum}.mp3`;

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setIsPlaying(true);
    setActivePlayingAyah(ayah.number);
    setPlayingSurah(surah);

    audio.play().catch((err) => {
      console.warn('Gagal memutar audio:', err);
      setIsPlaying(false);
      setActivePlayingAyah(null);
    });

    audio.onended = () => {
      setIsPlaying(false);
      setActivePlayingAyah(null);
    };
  };

  const toggleFullAudio = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    } else {
      const surahToPlay = surahs.find((s) => s.number === 18) || surahs[0] || { number: 1, name: 'Al-Fatihah' };
      handlePlayVerse(surahToPlay, { number: 1 });
    }
  };

  return (
    // Outer canvas untuk layar lebar: di tengah dengan latar polos netral
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-950 flex justify-center items-center sm:py-6 sm:px-4 transition-colors duration-200">
      {/* Phone container selebar 430px */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[860px] bg-background text-on-background flex flex-col sm:rounded-[36px] sm:shadow-2xl overflow-hidden relative border-x border-outline-variant/20 transition-colors duration-200">
        
        {/* Top App Bar konsisten sesuai Stitch (Al-Qur'an) */}
        <Header
          title="Al-Qur'an"
          showBack={route.path === 'surah'}
          onBack={() => navigate('home')}
          onMenu={toggleDarkMode}
          onSearch={() => navigate('home')}
        />

        {/* Scrollable View Content di dalam frame ponsel */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {route.path === 'home' && (
            <HomeScreen
              surahs={surahs}
              loading={surahLoading}
              error={surahError}
              onSelectSurah={(id) => navigate('surah', { id })}
              onNavigate={navigate}
            />
          )}

          {route.path === 'surah' && (
            <SurahDetailScreen
              surahNumber={route.params.id}
              onBack={() => navigate('home')}
              onPlayVerse={handlePlayVerse}
              activePlayingAyah={activePlayingAyah}
            />
          )}

          {route.path === 'bookmarks' && (
            <BookmarksScreen
              onOpenSurah={(id) => navigate('surah', { id })}
              onPlayVerse={handlePlayVerse}
            />
          )}

          {route.path === 'audio' && (
            <AudioPlayerScreen
              surah={playingSurah}
              isPlaying={isPlaying}
              onTogglePlay={toggleFullAudio}
              onBack={() => navigate('home')}
            />
          )}

          {route.path === 'settings' && (
            <SettingsScreen
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              fontSize={fontSize}
              onFontSizeChange={handleFontSizeChange}
            />
          )}
        </div>

        {/* Bottom Navigation Bar terpasang tepat di dasar frame ponsel */}
        <BottomNav
          activeTab={route.path}
          onTabChange={(path) => navigate(path)}
        />
      </div>
    </div>
  );
}
