import React from 'react';

export default function Tab({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-container-margin px-container-margin">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-primary text-on-primary shadow-sm font-semibold'
                : 'bg-surface-container-lowest text-surface-tint border border-outline-variant/40 hover:bg-surface-container-low'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

