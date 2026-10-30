import React from 'react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'bookmarks', label: 'Bookmark', icon: 'bookmark' },
    { id: 'audio', label: 'Audio', icon: 'headphones' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav
      className="w-full bg-white/90 dark:bg-emerald-950/90 backdrop-blur-xl rounded-t-[32px] border-t border-amber-100/40 dark:border-emerald-800/40 shadow-[0_-8px_30px_rgba(6,78,59,0.08)] px-4 pt-3.5 pb-6 sm:pb-4 flex justify-around items-center shrink-0 z-40 transition-colors"
      role="navigation"
      aria-label="Navigasi Utama"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        if (isActive) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center bg-emerald-900 dark:bg-amber-500 text-white dark:text-emerald-950 rounded-full px-5 py-1.5 transition-all duration-300 translate-y-[-2px] cursor-pointer"
              aria-label={tab.label}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {tab.icon}
              </span>
              <span className="font-serif text-[10px] font-medium tracking-tighter">
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center text-emerald-800/50 dark:text-emerald-100/40 px-5 py-1.5 hover:text-emerald-900 dark:hover:text-amber-200 transition-colors cursor-pointer"
            aria-label={tab.label}
          >
            <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
            <span className="font-serif text-[10px] font-medium tracking-tighter">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
