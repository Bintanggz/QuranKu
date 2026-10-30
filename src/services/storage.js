/**
 * LocalStorage Service for QuranKu
 * Mengelola penyimpanan lokal: Last Read dan Bookmarks
 */

const KEYS = {
  LAST_READ: 'quranku_last_read',
  BOOKMARKS: 'quranku_bookmarks',
  DARK_MODE: 'quranku_dark_mode',
  FONT_SIZE: 'quranku_font_size',
};

// Default Last Read jika belum ada
const DEFAULT_LAST_READ = {
  number: 2,
  name: "Al-Baqarah",
  ayahNumber: 154,
  updatedAt: Date.now(),
};

export function getLastRead() {
  try {
    const data = localStorage.getItem(KEYS.LAST_READ);
    return data ? JSON.parse(data) : DEFAULT_LAST_READ;
  } catch (e) {
    console.warn('Gagal membaca Last Read dari localStorage:', e);
    return DEFAULT_LAST_READ;
  }
}

export function setLastRead(number, name, ayahNumber = 1) {
  try {
    const item = {
      number: Number(number),
      name: name || `Surah ${number}`,
      ayahNumber: Number(ayahNumber),
      updatedAt: Date.now(),
    };
    localStorage.setItem(KEYS.LAST_READ, JSON.stringify(item));
    return item;
  } catch (e) {
    console.warn('Gagal menyimpan Last Read ke localStorage:', e);
    return null;
  }
}

export function getBookmarks() {
  try {
    const data = localStorage.getItem(KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Gagal membaca Bookmarks dari localStorage:', e);
    return [];
  }
}

export function saveBookmark(bookmark) {
  try {
    const bookmarks = getBookmarks();
    const id = bookmark.id || `${bookmark.surahNumber}_${bookmark.ayahNumber}`;
    const exists = bookmarks.some((b) => b.id === id);

    let updated;
    if (exists) {
      updated = bookmarks.filter((b) => b.id !== id);
    } else {
      updated = [{ ...bookmark, id, savedAt: Date.now() }, ...bookmarks];
    }

    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
    return { bookmarks: updated, isSaved: !exists };
  } catch (e) {
    console.warn('Gagal menyimpan bookmark ke localStorage:', e);
    return { bookmarks: getBookmarks(), isSaved: false };
  }
}

export function removeBookmark(id) {
  try {
    const bookmarks = getBookmarks();
    const updated = bookmarks.filter((b) => b.id !== id);
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Gagal menghapus bookmark dari localStorage:', e);
    return getBookmarks();
  }
}

export function isAyahBookmarked(surahNumber, ayahNumber) {
  const bookmarks = getBookmarks();
  const id = `${surahNumber}_${ayahNumber}`;
  return bookmarks.some((b) => b.id === id);
}

