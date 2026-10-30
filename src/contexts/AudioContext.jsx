import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { RECITERS, APP_CONFIG } from '../config/app';

const AudioContext = createContext(null);

export function AudioProvider({ children, surahList = [] }) {
  const audioRef = useRef(new Audio());
  
  // Reciter State (Persisted in localStorage)
  const [reciterId, setReciterIdState] = useState(() => {
    try {
      return localStorage.getItem('quranku_reciter') || 'mishary_alafasy';
    } catch {
      return 'mishary_alafasy';
    }
  });

  const reciter = useMemo(() => {
    return RECITERS.find((r) => r.id === reciterId) || RECITERS[0];
  }, [reciterId]);

  const setReciterId = (id) => {
    setReciterIdState(id);
    localStorage.setItem('quranku_reciter', id);
  };

  // Playback State
  const [currentSurah, setCurrentSurah] = useState(() => {
    return {
      number: 1,
      name: "Al-Fatihah",
      arabicName: "الفَاتِحَة",
      meaning: "Pembukaan",
      revelation: "MECCAN",
      totalAyah: 7,
    };
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Sync Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoadingAudio(false);
    };

    const onWaiting = () => setIsLoadingAudio(true);
    const onPlaying = () => {
      setIsLoadingAudio(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      setIsPlaying(false);
      // Putar surah berikutnya secara otomatis
      nextSurah();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentSurah, surahList]);

  // MediaSession API Integration (Lockscreen & Notification Controls)
  useEffect(() => {
    if ('mediaSession' in navigator && currentSurah) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Surah ${currentSurah.name} (${currentSurah.arabicName})`,
        artist: reciter.name,
        album: APP_CONFIG.name,
        artwork: [
          { src: '/favicon.svg', sizes: '96x96', type: 'image/svg+xml' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevSurah());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextSurah());
    }
  }, [currentSurah, reciter, isPlaying]);

  // Play a specific surah
  const playSurah = (surah) => {
    if (!surah) return;
    const audio = audioRef.current;
    
    // Jika surah sama, toggle
    if (currentSurah && currentSurah.number === surah.number && audio.src) {
      togglePlay();
      return;
    }

    setCurrentSurah(surah);
    setIsLoadingAudio(true);
    const audioUrl = reciter.getUrl(surah.number);
    audio.src = audioUrl;
    audio.playbackRate = playbackSpeed;
    audio.play().catch((err) => {
      console.warn('Gagal memutar audio streaming:', err);
      setIsLoadingAudio(false);
      setIsPlaying(false);
    });
  };

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) {
      playSurah(currentSurah);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn('Gagal melanjutkan audio:', err);
      });
    }
  };

  // Seek audio by time (seconds)
  const seek = (timeInSeconds) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = Math.max(0, Math.min(timeInSeconds, audio.duration));
      setCurrentTime(audio.currentTime);
    }
  };

  // Change playback speed
  const setSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Next and Previous Surah
  const nextSurah = () => {
    const nextNum = currentSurah.number >= 114 ? 1 : currentSurah.number + 1;
    const next = surahList.find((s) => s.number === nextNum) || {
      number: nextNum,
      name: `Surah ${nextNum}`,
      arabicName: '',
      totalAyah: 0,
    };
    playSurah(next);
  };

  const prevSurah = () => {
    const prevNum = currentSurah.number <= 1 ? 114 : currentSurah.number - 1;
    const prev = surahList.find((s) => s.number === prevNum) || {
      number: prevNum,
      name: `Surah ${prevNum}`,
      arabicName: '',
      totalAyah: 0,
    };
    playSurah(prev);
  };

  // Stop audio and clear
  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Format Helper: detik ke mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Up Next List (surah-surah berikutnya dalam antrean)
  const upNextList = useMemo(() => {
    if (!surahList || surahList.length === 0) return [];
    const currentIndex = surahList.findIndex((s) => s.number === currentSurah.number);
    if (currentIndex === -1) return surahList.slice(0, 5);

    const nexts = [];
    for (let i = 1; i <= 6; i++) {
      const idx = (currentIndex + i) % surahList.length;
      nexts.push(surahList[idx]);
    }
    return nexts;
  }, [surahList, currentSurah]);

  const value = {
    currentSurah,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isLoadingAudio,
    reciter,
    reciterId,
    setReciterId,
    playSurah,
    togglePlay,
    seek,
    setSpeed,
    nextSurah,
    prevSurah,
    stopAudio,
    formatTime,
    upNextList,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

