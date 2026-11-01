import React, { useState, useMemo } from 'react';
import { getLastRead } from '../services/storage';
import { JUZ_LIST } from '../config/juzData';

export default function HomeScreen({ surahs, loading, error, onSelectSurah }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('surah'); // 'surah' | 'juz'
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

  // Filter 30 Juz sesuai kata kunci pencarian
  const filteredJuz = useMemo(() => {
    if (!searchQuery.trim()) return JUZ_LIST;
    const q = searchQuery.toLowerCase().trim();
    return JUZ_LIST.filter(
      (j) =>
        j.name.toLowerCase().includes(q) ||
        j.startSurahName.toLowerCase().includes(q) ||
        String(j.number) === q
    );
  }, [searchQuery]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6 pb-12">
      {/* Top Banner & Last Read Hero */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Welcome & Sapaan di Layar Desktop */}
        <div className="md:col-span-1 bg-surface-container-low dark:bg-emerald-950/40 p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-xs text-surface-tint font-semibold uppercase tracking-wider block">
              Assalamu Alaikum
            </span>
            <h2 className="font-headline-lg text-2xl font-bold text-primary">
              Sahabat Qur'an
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant leading-relaxed pt-1">
              "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
            </p>
          </div>

          <div className="pt-4 border-t border-surface-variant/40 mt-3 flex items-center justify-between text-xs text-outline font-label-sm">
            <span>114 Surah</span>
            <span>•</span>
            <span>30 Juz</span>
            <span>•</span>
            <span>6.236 Ayat</span>
          </div>
        </div>

        {/* Bento Hero: Last Read Card */}
        <div className="md:col-span-2 relative overflow-hidden bg-primary-container rounded-2xl p-5 text-white soft-emerald-shadow border border-secondary-container/20 flex flex-col justify-between">
          <div className="absolute inset-0 sacred-pattern pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-lg">
                  menu_book
                </span>
                <span className="font-label-sm text-xs text-on-primary-container font-semibold uppercase tracking-wider">
                  Terakhir Dibaca
                </span>
              </div>

              <div>
                <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-white">
                  Surah {lastRead.name}
                </h3>
                <p className="font-body-md text-xs text-on-primary-container opacity-90 mt-0.5">
                  Melanjutkan dari Ayat ke-{lastRead.ayahNumber}
                </p>
              </div>

              <button
                onClick={() => onSelectSurah(lastRead.number)}
                className="bg-secondary-container text-on-secondary-container px-5 py-2 rounded-full font-label-sm text-xs hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer shadow-md font-bold"
              >
                Lanjutkan Membaca
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Decorative Calligraphy Vector (Local SVG Asset) */}
            <div className="relative w-full sm:w-44 h-28 sm:h-36 rounded-xl overflow-hidden gold-rim bg-emerald-950/40 shrink-0 self-center">
              <img
                alt="Kaligrafi Al-Qur'an Al-Karim"
                width="176"
                height="144"
                className="w-full h-full object-cover"
                src="/images/calligraphy.svg"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Search Bar & Tab Kategori */}
      <section className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
            <span className="material-symbols-outlined text-xl">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama surah, arti, nomor, atau juz..."
            className="w-full bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-full py-3.5 pl-12 pr-10 soft-emerald-shadow focus:ring-2 focus:ring-secondary/30 transition-all text-body-md text-sm placeholder:text-outline text-on-surface focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-outline hover:text-on-surface cursor-pointer"
              aria-label="Bersihkan pencarian"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Category Tabs: Hanya Surah dan Juz (Bookmark dihapus untuk menghilangkan duplikasi) */}
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('surah')}
              className={`px-5 py-2 rounded-full font-label-sm text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'surah'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              114 Surah
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={`px-5 py-2 rounded-full font-label-sm text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'juz'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              30 Juz
            </button>
          </div>

          <span className="text-xs text-outline font-label-sm hidden sm:inline">
            {activeTab === 'surah'
              ? `${filteredSurahs.length} Surah ditampilkan`
              : `${filteredJuz.length} Juz ditampilkan`}
          </span>
        </div>
      </section>

      {/* Main Content Area: Responsive Grid (1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop) */}
      <section>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-surface-container-lowest p-inner-padding rounded-xl h-24 animate-pulse border border-surface-variant"
              ></div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-6 text-center bg-error-container/20 text-error rounded-xl max-w-md mx-auto">
            <p className="font-body-md text-sm">{error}</p>
          </div>
        )}

        {/* Tampilan Tab Surah */}
        {activeTab === 'surah' && !loading && !error && (
          <>
            {filteredSurahs.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant font-body-md text-sm">
                Tidak ditemukan surah dengan kata kunci "{searchQuery}"
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.number}
                  onClick={() => onSelectSurah(surah.number)}
                  className="bg-white dark:bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between gold-rim-subtle soft-emerald-shadow group hover:border-[#D4AF37] hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-4xl opacity-20 group-hover:opacity-30 group-hover:rotate-12 transition-all">
                        star
                      </span>
                      <span className="absolute font-label-sm text-xs text-primary font-bold">
                        {surah.number}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline-md text-base text-primary font-semibold truncate group-hover:text-primary-container">
                        {surah.name}
                      </h4>
                      <p className="font-label-sm text-[11px] text-outline uppercase tracking-wider truncate">
                        {surah.meaning ? `${surah.meaning} • ` : ''}
                        {surah.totalAyah} AYAT
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="font-arabic-display text-xl text-primary block leading-none">
                      {surah.arabicName}
                    </span>
                    <span className="font-label-sm text-[9px] text-surface-tint font-semibold uppercase tracking-wider mt-1 block">
                      {surah.revelation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tampilan Tab 30 Juz */}
        {activeTab === 'juz' && !loading && !error && (
          <>
            {filteredJuz.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant font-body-md text-sm">
                Tidak ditemukan juz dengan kata kunci "{searchQuery}"
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredJuz.map((juz) => (
                <div
                  key={juz.number}
                  onClick={() => onSelectSurah(juz.startSurahNumber)}
                  className="bg-white dark:bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between gold-rim-subtle soft-emerald-shadow group hover:border-[#D4AF37] hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-xs text-primary shrink-0 shadow-xs">
                      {juz.number}
                    </div>
                    <div>
                      <h4 className="font-headline-md text-base text-primary font-semibold group-hover:text-primary-container">
                        {juz.name}
                      </h4>
                      <p className="font-label-sm text-[11px] text-outline">
                        Mulai: QS. {juz.startSurahName} : {juz.startAyah}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-arabic-display text-lg text-primary block leading-none">
                      {juz.arabicName}
                    </span>
                    <span className="font-label-sm text-[10px] text-secondary font-semibold mt-1 inline-flex items-center gap-0.5">
                      Buka <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
