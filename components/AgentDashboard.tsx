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
    <div className="w-full rounded-2xl border-4 border-[#2A211D] bg-[#16110F] p-4 shadow-2xl space-y-4 font-mono select-none">
      {/* Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#3D3029] pb-3">
        <div>
          <h3 className="text-base font-black text-[#F3E5AB] flex items-center gap-2">
            <span>👳🏽‍♂️ ☕ 🛺 🧵 💪</span> WORKING CLASS CIVILIAN ECONOMY
          </h3>
          <p className="text-[11px] text-[#A89F91]">
            Simulated Old Delhi workforce of merchants, rickshaw porters, weavers, tea vendors & warehouse coolies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSkillModal}
            className="px-3.5 py-2 bg-[#261E1A] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#4A3B32] font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <span>📄</span> SKILL.MD DEPLOY
          </button>

          <button
            onClick={onOpenDeployModal}
            className="px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-mono font-black text-xs rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>🤖</span> DEPLOY CIVILIAN
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">CIVILIAN WORKFORCE</span>
          <div className="text-lg font-black text-[#F3E5AB]">{agents.length} CIVILIANS</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">GROSS REVENUE</span>
          <div className="text-lg font-black text-emerald-400">+{totalGross} MON</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">LIVING & EXPENSES</span>
          <div className="text-lg font-black text-amber-500">-{totalExpenses} MON</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">CHAI STALL SALES</span>
          <div className="text-lg font-black text-blue-400">{totalChaiBought} CUPS ☕</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">NET WORKFORCE P&L</span>
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
              className={`p-3.5 rounded-xl border-2 transition-all bg-[#1E1714] ${
                isBlocked
                  ? 'border-red-600/80 bg-red-950/20'
                  : 'border-[#3D3029] hover:border-[#D97706]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#332721] pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-full bg-[#2A1F19] border-2 border-[#D97706] flex items-center justify-center text-2xl shadow">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-mono text-sm font-black text-[#F3E5AB]">
                      {agent.name}
                    </h4>
                    <div className="text-[11px] font-bold text-[#F59E0B]">
                      {agent.civilianRole || agent.jobType}
                    </div>
                    <div className="text-[10px] text-[#A89F91]">
                      Lvl {agent.level} • {agent.efficiency}% Labor Efficiency
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    agent.status === 'WORKING'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : agent.status === 'TRAVELLING'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                      : agent.status === 'BLOCKED'
                      ? 'bg-red-500/20 text-red-400 border-red-500'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              {/* Card Body & Stats */}
              <div className="py-2.5 space-y-2 font-mono text-[11px]">
                {/* Energy Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#A89F91] mb-1">
                    <span>Civilian Energy:</span>
                    <span className="text-[#F3E5AB] font-bold">{energy}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#120E0C] border border-[#2D231D] overflow-hidden">
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

                <div className="flex justify-between text-[#A89F91]">
                  <span>District Base:</span>
                  <span className="text-[#D4C4B5] font-bold">{agent.location}</span>
                </div>

                <div className="flex justify-between text-[#A89F91]">
                  <span>Current Work Task:</span>
                  <span className="text-[#F3E5AB] font-bold text-right truncate max-w-[210px]">
                    {agent.currentTask}
                  </span>
                </div>

                <div className="flex justify-between text-[#A89F91]">
                  <span>Working Capital:</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(agent.availableCapital * 10) / 10} MON
                  </span>
                </div>

                <div className="flex justify-between text-[#A89F91] border-t border-[#332721] pt-1.5">
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
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#332721]">
                <button
                  onClick={() => onFundAgent(agent.id, 50)}
                  className="px-2.5 py-1 bg-[#261E1A] hover:bg-[#3D3029] text-[#F59E0B] font-mono text-[10px] font-bold rounded border border-[#524137] transition"
                >
                  + FUND 50 MON
                </button>

                <button
                  onClick={() => onToggleStatus(agent.id)}
                  className={`px-3 py-1 font-mono text-[10px] font-bold rounded transition shadow ${
                    agent.status === 'WORKING' || agent.status === 'TRAVELLING'
                      ? 'bg-amber-600 hover:bg-amber-500 text-black'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {agent.status === 'WORKING' || agent.status === 'TRAVELLING'
                    ? 'PAUSE WORK'
                    : 'RESUME WORK'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
