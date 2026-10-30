import React from 'react';

export default function KartuSurah({
  number,
  name,
  arabicName,
  meaning,
  revelation = 'MECCAN',
  totalAyah,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick && onClick();
        }
      }}
      className="bg-surface-container-lowest p-inner-padding rounded-DEFAULT flex items-center justify-between gold-rim-subtle hover:border-accent-gold shadow-card-ambient hover:shadow-soft-emerald transition-all duration-200 cursor-pointer group active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        {/* Nomor Surah dengan Dekorasi Ikon Bintang */}
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-4xl opacity-20 group-hover:opacity-30 group-hover:rotate-12 transition-all duration-300">
            star
          </span>
          <span className="absolute font-label-sm text-xs font-bold text-primary">
            {number}
          </span>
        </div>

        {/* Informasi Surah Latin */}
        <div>
          <h3 className="font-headline-md text-base sm:text-[17px] font-semibold text-primary group-hover:text-primary-container transition-colors">
            {name}
          </h3>
          <p className="font-label-sm text-[11px] text-outline uppercase tracking-wider mt-0.5">
            {meaning ? `${meaning.toUpperCase()} • ` : ''}
            {totalAyah} AYAT
          </p>
        </div>
      </div>

      {/* Nama Surah Arab dan Tipe Wahyu */}
      <div className="text-right shrink-0">
        <span className="font-arabic-display text-2xl text-primary block leading-none select-none">
          {arabicName}
        </span>
        <span className="font-label-sm text-[10px] text-surface-tint/80 uppercase tracking-wider mt-1 block">
          {revelation}
        </span>
      </div>
    </div>
  );
}

