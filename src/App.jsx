import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import MiniPlayer from './components/audio/MiniPlayer';
import AboutModal from './components/common/AboutModal';
import HomeScreen from './screens/HomeScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useSurahList } from './hooks/useQuran';
import { useRouter } from './router';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import { APP_CONFIG } from './config/app';

function MainAppContent() {
  const { route, navigate } = useRouter();
  const { surahs, loading: surahLoading, error: surahError } = useSurahList();
  const { playSurah } = useAudio();

  const [showAboutModal, setShowAboutModal] = useState(false);

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

  // Header Title Kontekstual Sesuai Halaman Aktif
  const activeSurahMeta = useMemo(() => {
    if (route.path === 'surah' && route.params.id) {
      return surahs?.find((s) => s.number === route.params.id);
    }
    return null;
  }, [route.path, route.params.id, surahs]);

  const headerTitle = useMemo(() => {
    switch (route.path) {
      case 'home':
        return APP_CONFIG.name;
      case 'surah':
        return activeSurahMeta ? `Surah ${activeSurahMeta.name}` : "Al-Qur'an";
      case 'bookmarks':
        return 'Bookmarks';
      case 'audio':
        return 'Audio Player';
      case 'settings':
        return 'Pengaturan';
      default:
        return APP_CONFIG.name;
    }
  }, [route.path, activeSurahMeta]);

  // Handler Pencarian di Header
  const handleHeaderSearch = () => {
    navigate('home');
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Cari"]');
      if (searchInput) {
        searchInput.focus();
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col transition-colors duration-200">
      {/* Top App Bar Dinamis (Satu Header Bersih Tanpa Hamburger Duplikat) */}
      <Header
        title={headerTitle}
        showBack={route.path === 'surah'}
        onBack={() => navigate('home')}
        onSearch={handleHeaderSearch}
        currentRoute={route.path}
        onNavigate={(path) => navigate(path)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main View Area: Responsif Penuh (Mobile-first hingga Desktop Wide) */}
      <div className="flex-1 w-full flex flex-col pb-24 md:pb-16">
        {route.path === 'home' && (
          <HomeScreen
            surahs={surahs}
            loading={surahLoading}
            error={surahError}
            onSelectSurah={(id) => navigate('surah', { id })}
          />
        )}

        {route.path === 'surah' && (
          <SurahDetailScreen
            surahNumber={route.params.id}
            onBack={() => navigate('home')}
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

      {/* Fixed Bottom Dock: Melayang permanen di bawah layar ponsel tanpa perlu scroll 114 surah */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          {route.path !== 'audio' && (
            <MiniPlayer onOpenPlayer={() => navigate('audio')} />
          )}
          <BottomNav
            activeTab={route.path}
            onTabChange={(path) => navigate(path)}
          />
        </div>
      </div>

      {/* Shared About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
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
