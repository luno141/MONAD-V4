'use client';

import React from 'react';

export type NavTab =
  | 'home'
  | 'world'
  | 'feed'
  | 'identities'
  | 'bounties'
  | 'messaging'
  | 'explore'
  | 'leaderboards'
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
    { id: 'bounties', label: 'Bounties', icon: '🏷️' },
    { id: 'messaging', label: 'Messaging', icon: '💬' },
    { id: 'explore', label: 'Explore', icon: '🧭' },
    { id: 'leaderboards', label: 'Leaderboards', icon: '🏆' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'storefront', label: 'Storefront', icon: '🏪' },
  ];

  const secondaryNav = ['Docs', 'Discord', 'X', 'GitHub', 'Feedback', 'Settings'];

  return (
    <aside className="w-16 md:w-56 shrink-0 bg-[#0B0807] border-r border-[#231A15] flex flex-col justify-between select-none py-4 px-3 font-mono text-xs z-40">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-6 h-6 rounded-md bg-[#D97706] flex items-center justify-center font-black text-xs text-black">
            📜
          </div>
          <span className="hidden md:inline font-black text-[#F3E5AB] tracking-wider text-xs uppercase">
            delhigazette
          </span>
        </div>

        {/* Main Nav Items */}
        <nav className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[11px] transition ${
                  isActive
                    ? 'bg-[#1C1410] text-[#F3E5AB] font-bold border-l-2 border-[#D97706]'
                    : 'text-[#A89F91] hover:text-[#D4C4B5] hover:bg-[#140F0D]'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Links */}
        <div className="pt-2 border-t border-[#1C1410] hidden md:block space-y-1 text-[10px] text-[#7A6E65]">
          {secondaryNav.map((link) => (
            <div key={link} className="px-2.5 py-1 hover:text-[#A89F91] cursor-pointer transition">
              {link}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button matching OpenHuman reference */}
      <div className="pt-3 border-t border-[#1C1410] space-y-2">
        <div className="hidden md:block text-[9px] text-[#7A6E65] px-1">Need an Agent?</div>
        <button
          onClick={onOpenDeployModal}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center"
        >
          <span className="hidden md:inline">Deploy Agent</span>
          <span className="md:hidden">🤖</span>
        </button>
      </div>
    </aside>
  );
}
