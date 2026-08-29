'use client';

import React, { useState } from 'react';
import { Agent } from '@/lib/types/agentTypes';

interface BountyAgentGridProps {
  agents: Agent[];
  onOpenDeployModal: () => void;
  onOpenSkillModal: () => void;
}

export default function BountyAgentGrid({
  agents,
  onOpenDeployModal,
  onOpenSkillModal,
}: BountyAgentGridProps) {
  const [filter, setFilter] = useState<'browse' | 'deploy'>('browse');

  const bounties = [
    {
      id: 'b1',
      title: 'Khari Baoli Spice Arbitrage Sprint — Micro Payload',
      status: 'AUTONOMOUS',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
      description: 'Goal: Execute automated high-frequency spice trade between Khari Baoli wholesale mandi and Jama Masjid retail shops.',
      payload: '10 MON',
      due: 'Live Active',
    },
    {
      id: 'b2',
      title: 'Chandni Chowk Textile Transit — Micro Payload',
      status: 'AUTONOMOUS',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
      description: 'Goal: Courier silk and cotton textiles from Chandni Chowk merchants to surrounding district hubs.',
      payload: '15 MON',
      due: 'Live Active',
    },
    {
      id: 'b3',
      title: 'Jama Masjid Food Supply & Retail Arbitrage',
      status: 'OPTIMIZING',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500',
      description: 'Goal: Restock food grain and fuel supplies to meet peak demand around Jama Masjid minarets.',
      payload: '20 MON',
      due: 'Live Active',
    },
    {
      id: 'b4',
      title: 'Sadar Bazaar Multi-District Brokerage Deal',
      status: 'REVIEW',
      statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500',
      description: 'Goal: Match bulk trade spreads between Sadar Bazaar wholesalers and player-owned retail storefronts.',
      payload: '25 MON',
      due: 'Live Active',
    },
  ];

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#2D231D] pb-2">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilter('browse')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filter === 'browse'
                ? 'bg-[#2A1F19] text-[#F3E5AB] border border-[#D97706]'
                : 'text-[#A89F91] hover:text-white'
            }`}
          >
            Browse
          </button>
          <button
            onClick={onOpenDeployModal}
            className="px-3 py-1.5 rounded-lg font-bold text-[#A89F91] hover:text-white transition"
          >
            Deploy Agent
          </button>
        </div>

        <button
          onClick={onOpenSkillModal}
          className="text-xs text-[#D97706] hover:underline font-bold"
        >
          + Import SKILL.md
        </button>
      </div>

      {/* 2-Column Crisp Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bounties.map((b) => (
          <div
            key={b.id}
            className="p-4 rounded-xl bg-[#140F0D] border border-[#2D231D] hover:border-[#D97706] transition-all space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-xs text-[#F3E5AB] leading-snug truncate max-w-[220px]">
                {b.title}
              </h4>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${b.statusColor}`}>
                {b.status}
              </span>
            </div>

            <p className="text-[11px] text-[#A89F91] line-clamp-2 leading-relaxed">
              {b.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#231A15] text-[11px]">
              <span className="font-black text-emerald-400">{b.payload}</span>
              <span className="text-[10px] text-[#7A6E65]">{b.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
