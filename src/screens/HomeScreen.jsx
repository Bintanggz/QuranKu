import React, { useState, useMemo } from 'react';
import { getLastRead } from '../services/storage';

export default function HomeScreen({ surahs, loading, error, onSelectSurah, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('surah');
  const lastRead = getLastRead();

  // Filter 114 surah sesuai kata kunci pencarian
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    const q = searchQuery.toLowerCase().trim();
    return surahs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.meaning && s.meaning.toLowerCase().includes(q)) ||
        s.arabicName.includes(q) ||
        String(s.number) === q
    );
  }, [surahs, searchQuery]);

  return (
    <main className="max-w-screen-xl mx-auto px-container-margin pt-6 space-y-section-padding pb-8">
      {/* Welcome Greeting */}
      <section className="space-y-1">
        <p className="font-label-sm text-label-sm text-surface-tint font-medium uppercase tracking-wider">
          Assalamu Alaikum
        </p>
        <h2 className="font-headline-lg text-headline-lg text-primary">
          Sahabat Qur'an
        </h2>
      </section>

      {/* Last Read Bento Hero */}
      <section className="relative overflow-hidden bg-primary-container rounded-lg p-inner-padding text-white soft-emerald-shadow">
        <div className="absolute inset-0 sacred-pattern pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">
                menu_book
              </span>
              <span className="font-label-sm text-label-sm text-on-primary-container font-semibold">
                Terakhir Dibaca
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md font-bold">
                {lastRead.name}
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container opacity-90">
                Ayat No: {lastRead.ayahNumber}
              </p>
            </div>
            <button
              onClick={() => onSelectSurah(lastRead.number)}
              className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-full font-label-sm text-label-sm hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm font-semibold"
            >
              Lanjutkan Membaca
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Decorative Calligraphy Image (Local Vector Asset - Fast & Offline Ready) */}
          <div className="relative w-full md:w-48 h-32 md:h-40 rounded-xl overflow-hidden gold-rim bg-emerald-950/40 shrink-0">
            <img
              alt="Kaligrafi Al-Qur'an Al-Karim"
              width="192"
              height="160"
              className="w-full h-full object-cover"
              src="/images/calligraphy.svg"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Minimalist Search */}
      <section>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Surah or Juz..."
            className="w-full bg-white dark:bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-10 soft-emerald-shadow focus:ring-2 focus:ring-secondary/20 transition-all text-body-md placeholder:text-outline-variant text-on-surface focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('surah')}
          className={`px-6 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'surah'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-container-lowest text-surface-tint border border-amber-100 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          Surah
        </button>
        <button
          onClick={() => setActiveTab('juz')}
          className={`px-6 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'juz'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-container-lowest text-surface-tint border border-amber-100 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          Juz
        </button>
        <button
          onClick={() => onNavigate('bookmarks')}
          className="bg-white dark:bg-surface-container-lowest text-surface-tint border border-amber-100 dark:border-emerald-800/40 px-6 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
        >
          Bookmark
        </button>
        <button
          onClick={() => setActiveTab('page')}
          className={`px-6 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'page'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-container-lowest text-surface-tint border border-amber-100 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          Page
        </button>
      </section>

      {/* Surah List */}
      <section className="space-y-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-surface-container-lowest p-inner-padding rounded-lg h-24 animate-pulse border border-surface-variant"
              ></div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-6 text-center bg-error-container/20 text-error rounded-lg">
            <p className="font-body-md">{error}</p>
          </div>
        )}

        {!loading && !error && filteredSurahs.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant font-body-md">
            Tidak ditemukan surah dengan kata kunci "{searchQuery}"
          </div>
        )}

        {!loading &&
          !error &&
          filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => onSelectSurah(surah.number)}
              className="bg-white dark:bg-surface-container-lowest p-inner-padding rounded-lg flex items-center justify-between gold-rim soft-emerald-shadow group hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-4xl opacity-20 group-hover:opacity-30 group-hover:rotate-12 transition-all">
                    star
                  </span>
                  <span className="absolute font-label-sm text-label-sm text-primary font-bold">
                    {surah.number}
                  </span>
                </div>
                <div>
                  <h4 className="font-headline-md text-[18px] text-primary font-semibold">
                    {surah.name}
                  </h4>
                  <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    {surah.meaning ? `${surah.meaning.toUpperCase()} • ` : ''}
                    {surah.totalAyah} VERSES
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-arabic-display text-2xl text-primary block leading-none">
                  {surah.arabicName}
                </span>
                <span className="font-label-sm text-[10px] text-surface-tint font-semibold uppercase tracking-wider mt-1 block">
                  {surah.revelation}
                </span>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

