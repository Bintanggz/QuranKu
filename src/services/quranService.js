/**
 * Quran Data Service for QuranKu
 * Layanan terpisah untuk mengambil dan mengelola data 114 surah serta teks ayat.
 * Berpola Cache-First (IndexedDB -> File Statis Lokal -> Fallback API).
 */

import {
  getCachedSurahList,
  setCachedSurahList,
  getCachedSurahDetail,
  setCachedSurahDetail,
} from './db';
import { APP_CONFIG } from '../config/app';

/**
 * Mengambil daftar 114 Surah
 * @returns {Promise<Array>} Daftar 114 surah (nomor, nama, nama Arab, arti, jumlah ayat, tempat turun)
 */
export async function getSurahList() {
  // 1. Cek cache IndexedDB terlebih dahulu
  const cachedList = await getCachedSurahList();
  if (cachedList && Array.isArray(cachedList) && cachedList.length === 114) {
    return cachedList;
  }

  // 2. Ambil dari file statis lokal (public/data/surah-list.json)
  try {
    const response = await fetch('/data/surah-list.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat file statis: HTTP ${response.status}`);
    }
    const surahList = await response.json();

    // Simpan ke IndexedDB untuk kunjungan berikutnya
    await setCachedSurahList(surahList);
    return surahList;
  } catch (localError) {
    console.warn('Gagal memuat surah-list lokal, mencoba fallback API...', localError);

    // 3. Fallback ke Al-Quran Cloud API jika online
    if (navigator.onLine) {
      try {
        const fallbackRes = await fetch(`${APP_CONFIG.fallbackApi.baseUrl}/surah`);
        if (!fallbackRes.ok) {
          throw new Error(`Fallback API error: HTTP ${fallbackRes.status}`);
        }
        const json = await fallbackRes.json();
        const fallbackList = json.data.map((s) => ({
          number: s.number,
          name: s.englishName,
          arabicName: s.name,
          meaning: s.englishNameTranslation,
          revelation: s.revelationType.toUpperCase(),
          totalAyah: s.numberOfAyahs,
        }));

        await setCachedSurahList(fallbackList);
        return fallbackList;
      } catch (apiError) {
        throw new Error(
          'Tidak dapat memuat daftar surah. Periksa koneksi internet Anda atau muat ulang aplikasi.'
        );
      }
    } else {
      throw new Error(
        'Anda sedang offline dan data daftar surah belum tersimpan di memori perangkat.'
      );
    }
  }
}

/**
 * Mengambil teks Arab dan terjemahan Indonesia untuk satu surah
 * @param {number|string} surahNumber Nomor surah (1 - 114)
 * @returns {Promise<Object>} Detail surah beserta array ayahs
 */
export async function getSurahDetail(surahNumber) {
  const num = Number(surahNumber);
  if (isNaN(num) || num < 1 || num > 114) {
    throw new Error(`Nomor surah tidak valid: ${surahNumber}. Harus bernilai 1 s.d. 114.`);
  }

  // 1. Cek cache IndexedDB (Instan & Offline-Ready)
  const cachedSurah = await getCachedSurahDetail(num);
  if (cachedSurah && cachedSurah.ayahs && cachedSurah.ayahs.length === cachedSurah.totalAyah) {
    return { data: cachedSurah, fromCache: true };
  }

  // 2. Ambil dari bundel JSON statis lokal (public/data/surahs/{num}.json)
  try {
    const response = await fetch(`/data/surahs/${num}.json`);
    if (!response.ok) {
      throw new Error(`Gagal memuat file statis Surah ${num}: HTTP ${response.status}`);
    }
    const surahData = await response.json();

    // Simpan ke IndexedDB
    await setCachedSurahDetail(surahData);
    return { data: surahData, fromCache: false };
  } catch (localError) {
    console.warn(`Gagal memuat berkas lokal Surah ${num}, mencoba fallback API...`, localError);

    // 3. Fallback API: Al-Quran Cloud (Tanzil Uthmani + Kemenag RI)
    if (navigator.onLine) {
      try {
        const endpoint = `${APP_CONFIG.fallbackApi.baseUrl}/surah/${num}/editions/quran-uthmani,id.indonesian`;
        const apiRes = await fetch(endpoint);
        if (!apiRes.ok) {
          throw new Error(`Fallback API error: HTTP ${apiRes.status}`);
        }
        const apiJson = await apiRes.json();
        const uthmaniData = apiJson.data[0];
        const indonesianData = apiJson.data[1];

        const ayahs = uthmaniData.ayahs.map((aya, idx) => {
          const sNum = String(num).padStart(3, '0');
          const aNum = String(aya.numberInSurah).padStart(3, '0');
          return {
            number: aya.numberInSurah,
            text: aya.text,
            translation: indonesianData.ayahs[idx].text,
            audioUrl: `${APP_CONFIG.audio.verseBaseUrl}/${sNum}${aNum}.mp3`,
          };
        });

        const surahData = {
          number: num,
          name: uthmaniData.englishName,
          arabicName: uthmaniData.name,
          meaning: uthmaniData.englishNameTranslation,
          revelation: uthmaniData.revelationType.toUpperCase(),
          totalAyah: uthmaniData.numberOfAyahs,
          bismillahPre: num !== 1 && num !== 9,
          ayahs: ayahs,
        };

        await setCachedSurahDetail(surahData);
        return { data: surahData, fromCache: false };
      } catch (fallbackError) {
        throw new Error(
          `Gagal memuat Surah ${num} dari server fallback. Pastikan koneksi internet aktif.`
        );
      }
    } else {
      throw new Error(
        `Surah ${num} belum tersimpan di memori offline. Silakan sambungkan internet sekali untuk mengunduhnya.`
      );
    }
  }
}

/**
 * Mengunduh seluruh 114 surah ke IndexedDB untuk mode offline penuh
 * @param {Function} onProgress Callback progres: (completedCount, totalCount)
 */
export async function downloadAllSurahsForOffline(onProgress) {
  const surahs = await getSurahList();
  const total = surahs.length;
  let completed = 0;

  for (const surah of surahs) {
    try {
      await getSurahDetail(surah.number);
      completed++;
      if (onProgress) onProgress(completed, total);
    } catch (e) {
      console.warn(`Gagal mengunduh Surah ${surah.number} untuk offline:`, e);
    }
  }

  return completed === total;
}

