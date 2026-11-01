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
      className="md:hidden w-full bg-white/95 dark:bg-emerald-950/95 backdrop-blur-xl rounded-t-[24px] border-t border-amber-100/50 dark:border-emerald-800/40 shadow-[0_-10px_25px_rgba(6,78,59,0.08)] px-4 pt-2 pb-5 flex justify-around items-center shrink-0 transition-colors"
      role="navigation"
      aria-label="Navigasi Utama Ponsel"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        if (isActive) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center bg-emerald-900 dark:bg-amber-500 text-white dark:text-emerald-950 rounded-full px-5 py-1.5 transition-all duration-300 translate-y-[-1px] cursor-pointer shadow-xs"
              aria-label={tab.label}
            >
              <span
                className="material-symbols-outlined text-[20px]"
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
            className="flex flex-col items-center justify-center text-emerald-800/60 dark:text-emerald-100/50 px-4 py-1.5 hover:text-emerald-900 dark:hover:text-amber-200 transition-colors cursor-pointer"
            aria-label={tab.label}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span className="font-serif text-[10px] font-medium tracking-tighter">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
