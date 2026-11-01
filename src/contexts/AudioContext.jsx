import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RECITERS, APP_CONFIG } from '../config/app';

const AudioContext = createContext(null);

export function AudioProvider({ children, surahList = [] }) {
  const audioRef = useRef(new Audio());
  const activeAyahListRef = useRef([]);

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

  // Playback States
  const [currentSurah, setCurrentSurah] = useState(() => {
    return {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفَاتِحَة',
      meaning: 'Pembukaan',
      revelation: 'MECCAN',
      totalAyah: 7,
    };
  });

  const [playbackMode, setPlaybackMode] = useState('surah'); // 'surah' | 'ayah'
  const [currentAyah, setCurrentAyah] = useState(null); // { number, text, translation, audioUrl }
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Shuffle & Repeat State
  const [isShuffle, setIsShuffle] = useState(() => {
    try {
      return localStorage.getItem('quranku_audio_shuffle') === 'true';
    } catch {
      return false;
    }
  });

  // repeatMode: 'off' | 'all' | 'one'
  const [repeatMode, setRepeatMode] = useState(() => {
    try {
      return localStorage.getItem('quranku_audio_repeat') || 'all';
    } catch {
      return 'all';
    }
  });

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      localStorage.setItem('quranku_audio_shuffle', String(next));
      return next;
    });
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      let next = 'all';
      if (prev === 'all') next = 'one';
      else if (prev === 'one') next = 'off';
      else next = 'all';
      localStorage.setItem('quranku_audio_repeat', next);
      return next;
    });
  };

  // Audio Event Listeners Setup
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
      handleTrackEnded();
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
  });

  // Track Ended Handler
  const handleTrackEnded = () => {
    const audio = audioRef.current;

    // Mode Repeat One: Ulangi track saat ini
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play().catch((err) => console.warn('Gagal repeat audio:', err));
      return;
    }

    // Jika sedang mode pemutaran ayat
    if (playbackMode === 'ayah' && currentAyah) {
      const list = activeAyahListRef.current;
      const currentIndex = list.findIndex((a) => a.number === currentAyah.number);
      if (currentIndex !== -1 && currentIndex < list.length - 1) {
        // Lanjut ke ayat berikutnya secara otomatis
        const nextAyah = list[currentIndex + 1];
        playAyah(currentSurah, nextAyah, list);
        return;
      }
      // Sudah sampai akhir ayat di surah
      if (repeatMode === 'all') {
        nextSurah();
      }
      return;
    }

    // Mode pemutaran surah penuh
    if (repeatMode === 'all') {
      nextSurah();
    }
  };

  // MediaSession API Integration (Lockscreen & Notification Controls)
  useEffect(() => {
    if ('mediaSession' in navigator && currentSurah) {
      const title =
        playbackMode === 'ayah' && currentAyah
          ? `Surah ${currentSurah.name} : Ayat ${currentAyah.number}`
          : `Surah ${currentSurah.name} (${currentSurah.arabicName})`;

      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: reciter.name,
        album: APP_CONFIG.name,
        artwork: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevSurah());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextSurah());
    }
  }, [currentSurah, currentAyah, playbackMode, reciter, isPlaying]);

  // Play a specific surah (Full Surah Streaming)
  const playSurah = (surah) => {
    if (!surah) return;
    const audio = audioRef.current;

    // Jika surah sama dan mode surah, toggle play/pause
    if (playbackMode === 'surah' && currentSurah?.number === surah.number && audio.src) {
      togglePlay();
      return;
    }

    setPlaybackMode('surah');
    setCurrentAyah(null);
    setCurrentSurah(surah);
    setIsLoadingAudio(true);

    const audioUrl = reciter.getUrl(surah.number);
    audio.src = audioUrl;
    audio.playbackRate = playbackSpeed;
    audio.play().catch((err) => {
      console.warn('Gagal memutar audio surah:', err);
      setIsLoadingAudio(false);
      setIsPlaying(false);
    });
  };

  // Play a specific verse (EveryAyah CDN per ayat)
  const playAyah = (surah, ayah, ayahList = []) => {
    if (!surah || !ayah) return;
    const audio = audioRef.current;

    if (ayahList.length > 0) {
      activeAyahListRef.current = ayahList;
    }

    // Jika ayat yang sama diklik saat sedang diputar, toggle pause/play
    if (
      playbackMode === 'ayah' &&
      currentSurah?.number === surah.number &&
      currentAyah?.number === ayah.number &&
      audio.src
    ) {
      togglePlay();
      return;
    }

    setPlaybackMode('ayah');
    setCurrentSurah(surah);
    setCurrentAyah(ayah);
    setIsLoadingAudio(true);

    // Dapatkan URL audio per ayat dari EveryAyah
    const sNum = String(surah.number).padStart(3, '0');
    const aNum = String(ayah.number).padStart(3, '0');
    const audioUrl =
      ayah.audioUrl || `${APP_CONFIG.audio.verseBaseUrl}/${sNum}${aNum}.mp3`;

    audio.src = audioUrl;
    audio.playbackRate = playbackSpeed;
    audio.play().catch((err) => {
      console.warn(`Gagal memutar audio ayat ${ayah.number}:`, err);
      setIsLoadingAudio(false);
      setIsPlaying(false);
    });
  };

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) {
      if (playbackMode === 'ayah' && currentAyah) {
        playAyah(currentSurah, currentAyah, activeAyahListRef.current);
      } else {
        playSurah(currentSurah);
      }
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

  // Next and Previous Track
  const nextSurah = () => {
    if (!surahList || surahList.length === 0) return;

    if (isShuffle) {
      // Pilih surah acak
      const available = surahList.filter((s) => s.number !== currentSurah.number);
      const randomSurah = available[Math.floor(Math.random() * available.length)];
      if (randomSurah) {
        playSurah(randomSurah);
        return;
      }
    }

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
    if (!surahList || surahList.length === 0) return;

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

  // Check if a specific ayah is actively playing
  const isPlayingAyah = useCallback(
    (surahNumber, ayahNumber) => {
      return (
        isPlaying &&
        playbackMode === 'ayah' &&
        currentSurah?.number === Number(surahNumber) &&
        currentAyah?.number === Number(ayahNumber)
      );
    },
    [isPlaying, playbackMode, currentSurah, currentAyah]
  );

  // Up Next List
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
    currentAyah,
    playbackMode,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isLoadingAudio,
    isShuffle,
    repeatMode,
    reciter,
    reciterId,
    setReciterId,
    playSurah,
    playAyah,
    togglePlay,
    toggleShuffle,
    cycleRepeatMode,
    seek,
    setSpeed,
    nextSurah,
    prevSurah,
    stopAudio,
    formatTime,
    isPlayingAyah,
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
