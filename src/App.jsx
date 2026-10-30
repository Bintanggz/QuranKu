import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import MiniPlayer from './components/audio/MiniPlayer';
import HomeScreen from './screens/HomeScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useSurahList } from './hooks/useQuran';
import { useRouter } from './router';
import { AudioProvider, useAudio } from './contexts/AudioContext';

function MainAppContent() {
  const { route, navigate } = useRouter();
  const { surahs, loading: surahLoading, error: surahError } = useSurahList();
  const { playSurah, currentSurah, isPlaying } = useAudio();

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

  // Font Size State (Berlaku di Surah Detail & Settings)
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem('quranku_font_size');
      return saved ? Number(saved) : 28;
    } catch {
      return 28;
    }
  });

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('quranku_font_size', String(size));
  };

  // Handler putar per ayat atau surah
  const handlePlayVerse = (surah, ayah) => {
    playSurah(surah);
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
              activePlayingAyah={isPlaying && currentSurah?.number === route.params.id ? 1 : null}
              fontSize={fontSize}
            />
          )}

          {route.path === 'bookmarks' && (
            <BookmarksScreen
              onOpenSurah={(id) => navigate('surah', { id })}
              onPlayVerse={(surah) => playSurah(surah)}
            />
          )}

          {route.path === 'audio' && (
            <AudioPlayerScreen />
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

        {/* Mini Player Bar: Muncul saat berpindah screen lain dan audio aktif */}
        {route.path !== 'audio' && (
          <MiniPlayer onOpenPlayer={() => navigate('audio')} />
        )}

        {/* Bottom Navigation Bar terpasang tepat di dasar frame ponsel */}
        <BottomNav
          activeTab={route.path}
          onTabChange={(path) => navigate(path)}
        />
      </div>
    </div>
  );
}

export default function App() {
  const { surahs } = useSurahList();

  return (
    <AudioProvider surahList={surahs}>
      <MainAppContent />
    </AudioProvider>
  );
}
