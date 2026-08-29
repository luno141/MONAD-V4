'use client';

import React from 'react';
import { Agent } from '@/lib/types/agentTypes';

interface AgentDashboardProps {
  agents: Agent[];
  onToggleStatus: (agentId: string) => void;
  onFundAgent: (agentId: string, amount: number) => void;
  onOpenDeployModal: () => void;
}

export default function AgentDashboard({
  agents,
  onToggleStatus,
  onFundAgent,
  onOpenDeployModal,
}: AgentDashboardProps) {
  const totalNetProfit = Math.round(agents.reduce((sum, a) => sum + a.netProfit, 0) * 10) / 10;
  const totalExpenses = Math.round(agents.reduce((sum, a) => sum + a.totalExpenses, 0) * 10) / 10;
  const totalGross = Math.round(agents.reduce((sum, a) => sum + a.grossEarnings, 0) * 10) / 10;

  return (
    <div className="w-full rounded-xl border-4 border-[#2A211D] bg-[#1A1412] p-4 shadow-2xl space-y-4">
      {/* Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#3D3029] pb-3">
        <div>
          <h3 className="font-mono text-base font-black text-[#F3E5AB] flex items-center gap-2">
            <span>⚙️</span> PLAYER AGENT WORKFORCE DASHBOARD
          </h3>
          <p className="font-mono text-[11px] text-[#A89F91]">
            Deploy and manage autonomous economic agents executing trades, logistics, and retail.
          </p>
        </div>

        <button
          onClick={onOpenDeployModal}
          className="px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-mono font-black text-xs rounded-lg shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <span>🤖</span> DEPLOY NEW AGENT
        </button>
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">ACTIVE WORKFORCE</span>
          <div className="text-lg font-black text-[#F3E5AB]">{agents.length} AGENTS</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">GROSS EARNINGS</span>
          <div className="text-lg font-black text-emerald-400">+{totalGross} MON</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#261E1A] border border-[#4A3B32]">
          <span className="text-[10px] text-[#A89F91]">TOTAL EXPENSES</span>
          <div className="text-lg font-black text-amber-500">-{totalExpenses} MON</div>
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
                  <div className="w-10 h-10 rounded-full bg-[#2A1F19] border-2 border-[#D97706] flex items-center justify-center text-xl shadow">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-mono text-sm font-black text-[#F3E5AB]">
                      {agent.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-[#D97706]/20 text-[#F59E0B] font-bold border border-[#D97706]">
                        {agent.jobType}
                      </span>
                      <span className="text-[#A89F91]">Lvl {agent.level} ({agent.efficiency}% Eff.)</span>
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
              <div className="py-2.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-[#A89F91]">
                  <span>Current Location:</span>
                  <span className="text-[#D4C4B5] font-bold">{agent.location}</span>
                </div>

                <div className="flex justify-between text-[#A89F91]">
                  <span>Current Task:</span>
                  <span className="text-[#F3E5AB] font-bold text-right truncate max-w-[200px]">
                    {agent.currentTask}
                  </span>
                </div>

                <div className="flex justify-between text-[#A89F91]">
                  <span>Available Capital:</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(agent.availableCapital * 10) / 10} MON
                  </span>
                </div>

                <div className="flex justify-between text-[#A89F91]">
                  <span>Contract Rules:</span>
                  <span className="text-[#D4C4B5] text-[10px]">
                    Buy &lt; {agent.contract.buyBelow} MON | Sell &gt; {agent.contract.sellAbove} MON
                  </span>
                </div>

                <div className="flex justify-between text-[#A89F91] border-t border-[#332721] pt-1.5">
                  <span>Net Agent Profit:</span>
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
                    ? 'PAUSE'
                    : 'RESUME'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
