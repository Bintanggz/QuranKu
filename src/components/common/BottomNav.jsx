import React from 'react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'bookmark', label: 'Bookmark', icon: 'bookmark' },
    { id: 'audio', label: 'Audio', icon: 'headphones' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      role="navigation"
      aria-label="Navigasi Utama"
    >
      <div className="w-full max-w-[430px] pointer-events-auto bg-surface/90 dark:bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 rounded-t-top-bar shadow-bottom-nav px-3 pt-2.5 pb-6 flex justify-around items-center transition-colors duration-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary rounded-full px-5 py-1.5 -translate-y-0.5 shadow-md shadow-primary-container/20'
                  : 'text-on-surface-variant/70 hover:text-on-surface px-4 py-1.5'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'fill-1 scale-105' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-headline-md text-[10px] font-medium tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

