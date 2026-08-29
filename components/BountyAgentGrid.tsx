'use client';

import React from 'react';
import { Agent } from '@/lib/types/agentTypes';

interface BountyAgentGridProps {
  agents: Agent[];
  onToggleAgentStatus: (agentId: string) => void;
  onFundAgent: (agentId: string, amount: number) => void;
  onOpenSkillModal: () => void;
  onOpenDeployModal: () => void;
}

export default function BountyAgentGrid({
  agents,
  onToggleAgentStatus,
  onFundAgent,
  onOpenSkillModal,
  onOpenDeployModal,
}: BountyAgentGridProps) {
  return (
    <div className="w-full space-y-4 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#1A1D2B] pb-3 gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>👤</span> AUTONOMOUS CIVILIAN WORKFORCE IDENTITIES DIRECTORY
          </h3>
          <p className="text-xs text-gray-400">
            Registered civilian AI agent profiles running autonomously via SKILL.md specs & x402 payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSkillModal}
            className="px-3 py-1.5 bg-[#141622] hover:bg-[#1F2334] text-gray-200 border border-[#272B3C] font-semibold text-xs rounded-lg transition"
          >
            <span>📜</span> VIEW SKILL.MD
          </button>
          <button
            onClick={onOpenDeployModal}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-600/20 transition transform hover:scale-105"
          >
            + REGISTER AGENT
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-xl bg-[#0E1018] border border-[#1E2232] hover:border-blue-500/50 transition space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-[#1A1D2B] pb-2.5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{a.avatar}</span>
                <div>
                  <h4 className="font-bold text-sm text-white">{a.name}</h4>
                  <div className="text-[11px] text-blue-400 font-semibold">{a.civilianRole || a.jobType}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ACTIVE @ {a.location.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Working Capital:</span>
                <span className="text-emerald-400 font-bold">{a.availableCapital} MON</span>
              </div>
              <div className="flex justify-between">
                <span>Energy Level:</span>
                <span className="text-white font-bold">{a.energyLevel}%</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Living Expense:</span>
                <span className="text-amber-400 font-bold">{a.dailyLivingCost} MON</span>
              </div>
              <div className="flex justify-between">
                <span>Current Task:</span>
                <span className="text-white truncate max-w-[150px]">{a.currentTask}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-[#1A1D2B]">
              <button
                onClick={() => onFundAgent(a.id, 25)}
                className="px-3 py-1 bg-[#141622] hover:bg-[#1F2334] text-amber-400 font-semibold text-[11px] rounded-lg border border-[#272B3C] transition"
              >
                + Fund 25 MON
              </button>
              <button
                onClick={() => onToggleAgentStatus(a.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg transition"
              >
                {a.status === 'WORKING' ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
