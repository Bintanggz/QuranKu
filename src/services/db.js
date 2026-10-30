/**
 * IndexedDB Database Service for QuranKu
 * Digunakan untuk menyimpan cache offline metadata surah dan teks ayat secara persisten.
 */

const DB_NAME = 'quranku_db';
const DB_VERSION = 1;

const STORES = {
  SURAH_LIST: 'surah_list',
  SURAH_DETAIL: 'surah_detail',
};

let dbInstance = null;

export function openDB() {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    // Memastikan IndexedDB didukung browser
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada peramban ini.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store untuk daftar 114 surah
      if (!db.objectStoreNames.contains(STORES.SURAH_LIST)) {
        db.createObjectStore(STORES.SURAH_LIST, { keyPath: 'id' });
      }

      // Store untuk detail ayat per surah (key: number)
      if (!db.objectStoreNames.contains(STORES.SURAH_DETAIL)) {
        db.createObjectStore(STORES.SURAH_DETAIL, { keyPath: 'number' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(event.target.error || new Error('Gagal membuka IndexedDB.'));
    };
  });
}

/**
 * Mengambil cache daftar surah dari IndexedDB
 */
export async function getCachedSurahList() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SURAH_LIST, 'readonly');
      const store = tx.objectStore(STORES.SURAH_LIST);
      const request = store.get('all');

      request.onsuccess = () => {
        resolve(request.result ? request.result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Gagal membaca cache daftar surah dari IndexedDB:', error);
    return null;
  }
}

/**
 * Menyimpan daftar surah ke IndexedDB
 */
export async function setCachedSurahList(surahList) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SURAH_LIST, 'readwrite');
      const store = tx.objectStore(STORES.SURAH_LIST);
      const request = store.put({ id: 'all', data: surahList, updatedAt: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Gagal menyimpan cache daftar surah ke IndexedDB:', error);
    return false;
  }
}

/**
 * Mengambil cache detail surah dari IndexedDB
 */
export async function getCachedSurahDetail(surahNumber) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SURAH_DETAIL, 'readonly');
      const store = tx.objectStore(STORES.SURAH_DETAIL);
      const request = store.get(Number(surahNumber));

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`Gagal membaca cache Surah ${surahNumber} dari IndexedDB:`, error);
    return null;
  }
}

/**
 * Menyimpan detail surah ke IndexedDB
 */
export async function setCachedSurahDetail(surahData) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SURAH_DETAIL, 'readwrite');
      const store = tx.objectStore(STORES.SURAH_DETAIL);
      const request = store.put({ ...surahData, cachedAt: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`Gagal menyimpan cache Surah ${surahData?.number} ke IndexedDB:`, error);
    return false;
  }
}

