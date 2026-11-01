import React from 'react';
import { APP_CONFIG } from '../../config/app';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-accent-gold/40 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start border-b border-surface-variant/40 pb-3">
          <div>
            <h3 className="font-headline-md text-lg text-primary font-bold">
              Tentang {APP_CONFIG.name}
            </h3>
            <p className="text-xs text-on-surface-variant">Versi {APP_CONFIG.version} (PWA)</p>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 cursor-pointer"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <p className="font-body-md text-xs text-on-surface leading-relaxed">
          {APP_CONFIG.name} adalah aplikasi Al-Qur'an digital mobile-first yang dibangun dengan komitmen menjaga kemurnian teks suci Al-Qur'an secara verbatim tanpa perubahan apa pun.
        </p>

        <div className="space-y-2.5 pt-1">
          <h4 className="font-label-sm text-xs font-bold text-primary uppercase">
            Atribusi Sumber Data:
          </h4>

          {APP_CONFIG.attributions.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low p-3 rounded-lg text-xs space-y-1 border border-outline-variant/30"
            >
              <p className="font-bold text-on-surface text-xs">{item.title}</p>
              <p className="text-on-surface-variant text-[11px]">{item.source}</p>
              <p className="text-secondary text-[10px] font-semibold">{item.license}</p>
              {item.notice && (
                <p className="text-outline text-[10px] italic">{item.notice}</p>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold text-[10px] inline-flex items-center gap-0.5 hover:underline pt-0.5"
              >
                Kunjungi Sumber{' '}
                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-primary text-white rounded-full font-label-sm text-xs font-semibold cursor-pointer shadow-md hover:bg-primary-container transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

