'use client';

import React from 'react';

export type NavTab =
  | 'home'
  | 'world'
  | 'feed'
  | 'identities'
  | 'stats'
  | 'storefront';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenDeployModal: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  onOpenDeployModal,
}: SidebarProps) {
  const mainNav: { id: NavTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'world', label: 'World', icon: '🌆' },
    { id: 'feed', label: 'Feed', icon: '📜' },
    { id: 'identities', label: 'Identities', icon: '👤' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'storefront', label: 'Storefront', icon: '🏪' },
  ];

  const secondaryNav = [
    { label: 'Docs', icon: '📄' },
    { label: 'Discord', icon: '👾' },
    { label: 'X', icon: '𝕏' },
    { label: 'GitHub', icon: '💻' },
    { label: 'Feedback', icon: '💬' },
    { label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-16 md:w-56 shrink-0 bg-[#090A0F] border-r border-[#181926] flex flex-col justify-between select-none py-4 px-3 font-sans text-xs z-40">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-md">
            🪐
          </div>
          <span className="hidden md:inline font-extrabold text-white tracking-tight text-sm">
            tiny.place
          </span>
        </div>

        {/* Main Nav Items */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition ${
                  isActive
                    ? 'bg-[#151722] text-white font-bold border-l-2 border-blue-500 shadow-sm'
                    : 'text-[#8F96A3] hover:text-white hover:bg-[#11121A]'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Links */}
        <div className="pt-3 border-t border-[#181926] hidden md:block space-y-1 text-xs text-[#717885]">
          {secondaryNav.map((link) => (
            <div
              key={link.label}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:text-white cursor-pointer transition rounded-md hover:bg-[#11121A]"
            >
              <span className="text-xs opacity-70">{link.icon}</span>
              <span>{link.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button matching tiny.place reference */}
      <div className="pt-3 border-t border-[#181926] space-y-2">
        <div className="hidden md:block text-[10px] text-[#717885] px-1">Need an Agent?</div>
        <button
          onClick={onOpenDeployModal}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="hidden md:inline">Try OpenHuman</span>
          <span className="md:hidden">🤖</span>
        </button>
      </div>
    </aside>
  );
}
