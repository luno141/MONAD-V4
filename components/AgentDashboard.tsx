'use client';

import React from 'react';
import { Agent } from '@/lib/types/agentTypes';

interface AgentDashboardProps {
  agents: Agent[];
  onToggleStatus: (agentId: string) => void;
  onFundAgent: (agentId: string, amount: number) => void;
  onOpenDeployModal: () => void;
  onOpenSkillModal: () => void;
}

export default function AgentDashboard({
  agents,
  onToggleStatus,
  onFundAgent,
  onOpenDeployModal,
  onOpenSkillModal,
}: AgentDashboardProps) {
  const totalNetProfit = Math.round(agents.reduce((sum, a) => sum + a.netProfit, 0) * 10) / 10;
  const totalExpenses = Math.round(agents.reduce((sum, a) => sum + a.totalExpenses, 0) * 10) / 10;
  const totalGross = Math.round(agents.reduce((sum, a) => sum + a.grossEarnings, 0) * 10) / 10;
  const totalChaiBought = agents.reduce((sum, a) => sum + (a.totalChaiBought || 0), 0);

  return (
    <div className="w-full rounded-2xl border border-[#1E2232] bg-[#0E1018] p-5 shadow-2xl space-y-4 font-sans select-none">
      {/* Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A1D2B] pb-3">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <span>👳🏽‍♂️ ☕ 🛺 🧵 💪</span> WORKING CLASS CIVILIAN ECONOMY
          </h3>
          <p className="text-xs text-gray-400">
            Simulated Old Delhi workforce of merchants, rickshaw porters, weavers, tea vendors & warehouse coolies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSkillModal}
            className="px-3.5 py-2 bg-[#141622] hover:bg-[#1F2334] text-gray-200 border border-[#272B3C] font-semibold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <span>📄</span> SKILL.MD DEPLOY
          </button>

          <button
            onClick={onOpenDeployModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>🤖</span> DEPLOY CIVILIAN
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#06070B] border border-[#1A1D2B]">
          <span className="text-[10px] text-gray-400 font-medium">CIVILIAN WORKFORCE</span>
          <div className="text-lg font-black text-white">{agents.length} CIVILIANS</div>
        </div>

        <div className="p-3 rounded-xl bg-[#06070B] border border-[#1A1D2B]">
          <span className="text-[10px] text-gray-400 font-medium">GROSS REVENUE</span>
          <div className="text-lg font-black text-emerald-400">+{totalGross} MON</div>
        </div>

        <div className="p-3 rounded-xl bg-[#06070B] border border-[#1A1D2B]">
          <span className="text-[10px] text-gray-400 font-medium">LIVING & EXPENSES</span>
          <div className="text-lg font-black text-amber-400">-{totalExpenses} MON</div>
        </div>

        <div className="p-3 rounded-xl bg-[#06070B] border border-[#1A1D2B]">
          <span className="text-[10px] text-gray-400 font-medium">CHAI STALL SALES</span>
          <div className="text-lg font-black text-blue-400">{totalChaiBought} CUPS ☕</div>
        </div>

        <div className="p-3 rounded-xl bg-[#06070B] border border-[#1A1D2B]">
          <span className="text-[10px] text-gray-400 font-medium">NET WORKFORCE P&L</span>
          <div
            className={`text-lg font-black ${
              totalNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {totalNetProfit >= 0 ? `+${totalNetProfit}` : totalNetProfit} MON
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const isBlocked = agent.status === 'BLOCKED';
          const energy = agent.energyLevel ?? 80;

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border transition-all bg-[#06070B] ${
                isBlocked
                  ? 'border-red-600/80 bg-red-950/20'
                  : 'border-[#1A1D2B] hover:border-blue-500/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#181926] pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#141622] border border-blue-500/40 flex items-center justify-center text-xl shadow">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {agent.name}
                    </h4>
                    <div className="text-xs font-semibold text-blue-400">
                      {agent.civilianRole || agent.jobType}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Lvl {agent.level} • {agent.efficiency}% Labor Efficiency
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                    agent.status === 'WORKING'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : agent.status === 'TRAVELLING'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : agent.status === 'BLOCKED'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              {/* Card Body & Stats */}
              <div className="py-3 space-y-2 text-xs">
                {/* Energy Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Civilian Energy:</span>
                    <span className="text-white font-bold">{energy}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#141622] border border-[#24283A] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        energy > 60
                          ? 'bg-emerald-500'
                          : energy > 30
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${energy}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>District Base:</span>
                  <span className="text-gray-200 font-semibold">{agent.location}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Current Work Task:</span>
                  <span className="text-white font-semibold text-right truncate max-w-[210px]">
                    {agent.currentTask}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Working Capital:</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(agent.availableCapital * 10) / 10} MON
                  </span>
                </div>

                <div className="flex justify-between text-gray-400 border-t border-[#181926] pt-2">
                  <span>Net Earnings:</span>
                  <span
                    className={`font-black ${
                      agent.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {agent.netProfit >= 0 ? `+${agent.netProfit}` : agent.netProfit} MON
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#181926]">
                <button
                  onClick={() => onFundAgent(agent.id, 50)}
                  className="px-3 py-1 bg-[#141622] hover:bg-[#1F2334] text-amber-400 font-semibold text-[11px] rounded-lg border border-[#272B3C] transition"
                >
                  + Fund 50 MON
                </button>

                <button
                  onClick={() => onToggleStatus(agent.id)}
                  className={`px-3.5 py-1 font-bold text-[11px] rounded-lg transition shadow ${
                    agent.status === 'WORKING' || agent.status === 'TRAVELLING'
                      ? 'bg-amber-600 hover:bg-amber-500 text-black'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {agent.status === 'WORKING' || agent.status === 'TRAVELLING'
                    ? 'Pause Work'
                    : 'Resume Work'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
