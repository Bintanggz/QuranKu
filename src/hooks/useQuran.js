import { useState, useEffect, useCallback } from 'react';
import { getSurahList, getSurahDetail } from '../services/quranService';

/**
 * Hook untuk memuat daftar 114 surah dengan penanganan loading dan error
 */
export function useSurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSurahList();
      setSurahs(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar surah.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { surahs, loading, error, refetch: fetchList };
}

/**
 * Hook untuk memuat teks ayat Arab + Terjemahan Indonesia dari suatu surah
 */
export function useSurahDetail(surahNumber) {
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!surahNumber) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSurahDetail(surahNumber);
      setSurah(result.data);
      setFromCache(result.fromCache);
    } catch (err) {
      setError(err.message || 'Gagal memuat ayat surah.');
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { surah, loading, error, fromCache, refetch: fetchDetail };
}

