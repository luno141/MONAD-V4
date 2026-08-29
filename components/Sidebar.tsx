'use client';

import React from 'react';

export type NavTab =
  | 'world'
  | 'markets'
  | 'agents'
  | 'inventory'
  | 'businesses'
  | 'economy'
  | 'activity';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  agentCount: number;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  agentCount,
}: SidebarProps) {
  const navItems: { id: NavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'world', label: 'World Map', icon: '🌆' },
    { id: 'markets', label: 'Mandi Markets', icon: '📈' },
    { id: 'agents', label: 'Workforce', icon: '🤖', badge: agentCount },
    { id: 'inventory', label: 'District Supply', icon: '📦' },
    { id: 'businesses', label: 'Businesses', icon: '🏪' },
    { id: 'economy', label: 'Arbitrage Engine', icon: '⚡' },
    { id: 'activity', label: 'Gazette Logs', icon: '📜' },
  ];

  return (
    <aside className="w-16 md:w-56 shrink-0 bg-[#120D0B] border-r-4 border-[#2A211D] flex flex-col justify-between select-none py-4 px-2 font-mono z-40">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-lg bg-[#D97706] border-2 border-[#2A211D] flex items-center justify-center text-xl font-black text-black shadow-lg">
            ⚡
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-black tracking-wider text-[#F3E5AB] leading-tight">
              CHAIN<span className="text-[#D97706]">REACTION</span>
            </h1>
            <span className="text-[9px] text-[#A89F91]">OLD DELHI MANDI</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#2E211A] text-[#F59E0B] border border-[#D97706] shadow-md'
                    : 'text-[#A89F91] hover:bg-[#1E1714] hover:text-[#D4C4B5]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden md:inline flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#D97706] text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="px-2 pt-4 border-t border-[#2A211D] hidden md:block">
        <div className="p-2.5 rounded-lg bg-[#1A1412] border border-[#3A2D25] text-[10px]">
          <div className="text-[#F3E5AB] font-bold">MONAD TESTNET</div>
          <div className="text-[#A89F91]">Stage Showcase MVP</div>
        </div>
      </div>
    </aside>
  );
}
