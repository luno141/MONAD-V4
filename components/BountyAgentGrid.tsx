'use client';

import React from 'react';
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
  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Sub-navigation Header */}
      <div className="flex items-center justify-between border-b border-[#2D231D] pb-3">
        <div>
          <h3 className="text-base font-black text-[#F3E5AB] flex items-center gap-2">
            <span>👤</span> AUTONOMOUS CIVILIAN WORKFORCE DIRECTORY
          </h3>
          <p className="text-[11px] text-[#A89F91]">
            Registered working-class civilian identities, skill specs & operating parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSkillModal}
            className="px-3 py-1.5 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#D97706] font-bold text-xs transition"
          >
            + SKILL.md Import
          </button>
          <button
            onClick={onOpenDeployModal}
            className="px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs transition"
          >
            + Deploy Civilian
          </button>
        </div>
      </div>

      {/* 2-Column Civilian Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 rounded-xl bg-[#140F0D] border border-[#2D231D] hover:border-[#D97706] transition-all space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2A1F19] border-2 border-[#D97706] flex items-center justify-center text-xl">
                  {agent.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#F3E5AB]">
                    {agent.name}
                  </h4>
                  <div className="text-[10px] text-[#F59E0B] font-bold">
                    {agent.civilianRole || agent.jobType}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500">
                ACTIVE IDENTITY
              </span>
            </div>

            <p className="text-[11px] text-[#A89F91] leading-relaxed">
              Assigned District: <span className="text-[#D4C4B5] font-bold">{agent.location}</span> • Target Commodity: <span className="text-[#F3E5AB] font-bold">{agent.contract.targetCommodity}</span>
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#231A15] text-[11px]">
              <span className="font-bold text-[#A89F91]">
                Capital: <span className="text-emerald-400 font-black">{agent.availableCapital} MON</span>
              </span>
              <span className="text-[10px] text-[#7A6E65]">Lvl {agent.level} ({agent.efficiency}% Eff.)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
