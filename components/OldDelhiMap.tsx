'use client';

import React from 'react';
import { DistrictId, Agent, DistrictEconomyState } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

interface OldDelhiMapProps {
  economy: DistrictEconomyState;
  agents: Agent[];
  selectedDistrict: DistrictId;
  onSelectDistrict: (districtId: DistrictId) => void;
  onOpenDeployModal: (districtId: DistrictId) => void;
}

export default function OldDelhiMap({
  economy,
  agents,
  selectedDistrict,
  onSelectDistrict,
  onOpenDeployModal,
}: OldDelhiMapProps) {
  // District map node coordinates (%)
  const districtNodes: Record<DistrictId, { x: number; y: number }> = {
    khari_baoli: { x: 22, y: 35 },
    chandni_chowk: { x: 50, y: 25 },
    jama_masjid: { x: 78, y: 55 },
  };

  return (
    <div className="relative w-full rounded-xl border-4 border-[#2A211D] bg-[#1A1412] p-4 shadow-2xl overflow-hidden min-h-[460px]">
      {/* Background Grid & Decorative Pixel Paths */}
      <div className="absolute inset-0 bg-[radial-gradient(#3B2D26_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#3D3029] pb-3 mb-4">
        <div className="flex items-center space-y-0.5">
          <span className="text-2xl mr-2">🕌</span>
          <div>
            <h2 className="font-mono text-lg font-black text-[#F3E5AB] tracking-wide flex items-center gap-2">
              OLD DELHI MAP — LIVE MANDI WORLD
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]">
                SPATIAL SIMULATION ACTIVE
              </span>
            </h2>
            <p className="font-mono text-[11px] text-[#A89F91]">
              Click a district to inspect commodity prices or deploy agent workforce.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-[#261E1A] rounded border border-[#4A3B32] text-[11px] font-mono text-[#D4C4B5] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Agents: {agents.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[360px] bg-[#140F0D] rounded-lg border-2 border-[#382B24] overflow-hidden select-none">
        {/* Road Connectors / Pathways SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 stroke-current text-[#4A382E]">
          {/* Path Khari Baoli <-> Chandni Chowk */}
          <line
            x1={`${districtNodes.khari_baoli.x}%`}
            y1={`${districtNodes.khari_baoli.y}%`}
            x2={`${districtNodes.chandni_chowk.x}%`}
            y2={`${districtNodes.chandni_chowk.y}%`}
            strokeWidth="4"
            strokeDasharray="6 4"
            className="animate-[dash_12s_linear_infinite]"
          />
          {/* Path Chandni Chowk <-> Jama Masjid */}
          <line
            x1={`${districtNodes.chandni_chowk.x}%`}
            y1={`${districtNodes.chandni_chowk.y}%`}
            x2={`${districtNodes.jama_masjid.x}%`}
            y2={`${districtNodes.jama_masjid.y}%`}
            strokeWidth="4"
            strokeDasharray="6 4"
          />
          {/* Path Khari Baoli <-> Jama Masjid */}
          <line
            x1={`${districtNodes.khari_baoli.x}%`}
            y1={`${districtNodes.khari_baoli.y}%`}
            x2={`${districtNodes.jama_masjid.x}%`}
            y2={`${districtNodes.jama_masjid.y}%`}
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </svg>

        {/* Render Districts as Interactive Landmarks */}
        {(Object.keys(DISTRICTS) as DistrictId[]).map((dId) => {
          const d = DISTRICTS[dId];
          const pos = districtNodes[dId];
          const isSelected = selectedDistrict === dId;
          const spicePrice = economy.markets.spices.districtPrices[dId];
          const grainPrice = economy.markets.grain.districtPrices[dId];

          return (
            <div
              key={dId}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onSelectDistrict(dId)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300 group ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              {/* Landmark Container */}
              <div
                className={`relative flex flex-col items-center p-3 rounded-xl border-2 backdrop-blur-md transition-all shadow-xl ${
                  isSelected
                    ? 'border-[#F59E0B] bg-[#2E211A]/95 shadow-[#F59E0B]/20 ring-2 ring-[#F59E0B]/50'
                    : 'border-[#4A3B32] bg-[#1E1714]/90 hover:border-[#D97706]'
                }`}
              >
                {/* Icon & Badge */}
                <div className="relative text-3xl mb-1">
                  {d.icon}
                  <span className="absolute -top-2 -right-3 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-[#D97706] text-black">
                    {d.hindiName}
                  </span>
                </div>

                {/* District Name */}
                <span className="font-mono text-xs font-black text-[#F3E5AB] text-center whitespace-nowrap">
                  {d.name}
                </span>

                {/* Live Market Price Ticker */}
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold bg-[#120D0B] px-2 py-1 rounded border border-[#3A2D25]">
                  <span className="text-[#F59E0B]">🌶️ {spicePrice} MON</span>
                  <span className="text-[#60A5FA]">🌾 {grainPrice} MON</span>
                </div>

                {/* Deploy Button on Hover / Selection */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDeployModal(dId);
                  }}
                  className="mt-2 w-full py-0.5 px-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-mono font-black text-[10px] rounded transition shadow"
                >
                  + DEPLOY AGENT
                </button>
              </div>
            </div>
          );
        })}

        {/* Render Active Agents on the Map */}
        {agents.map((agent, index) => {
          let agentX = districtNodes[agent.location].x;
          let agentY = districtNodes[agent.location].y;

          // If travelling to a target location, offset midway along the road path
          if (agent.status === 'TRAVELLING' && agent.targetLocation) {
            const targetPos = districtNodes[agent.targetLocation];
            agentX = (agentX + targetPos.x) / 2;
            agentY = (agentY + targetPos.y) / 2;
          } else {
            // Apply slight random scatter around district node
            const offsetAngle = (index * 75 * Math.PI) / 180;
            agentX += Math.cos(offsetAngle) * 7;
            agentY += Math.sin(offsetAngle) * 7;
          }

          return (
            <div
              key={agent.id}
              style={{ left: `${agentX}%`, top: `${agentY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 ease-in-out pointer-events-auto"
            >
              {/* Speech Bubble */}
              {agent.speechBubble && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#FFFBEB] text-[#1E1714] font-mono text-[9px] font-black rounded-lg border border-[#D97706] shadow-lg whitespace-nowrap z-40 animate-bounce">
                  {agent.speechBubble}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#FFFBEB]" />
                </div>
              )}

              {/* Agent Marker Icon */}
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#2A1F19] border-2 border-[#F59E0B] flex items-center justify-center text-base shadow-lg transition transform group-hover:scale-125">
                  {agent.avatar}
                </div>

                {/* Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${
                    agent.status === 'WORKING'
                      ? 'bg-emerald-500 animate-pulse'
                      : agent.status === 'TRAVELLING'
                      ? 'bg-blue-500'
                      : agent.status === 'BLOCKED'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />

                {/* Tooltip Hover Card */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-44 p-2 bg-[#1E1714] border-2 border-[#D97706] rounded-lg shadow-2xl z-50 text-[10px] font-mono">
                  <div className="font-bold text-[#F3E5AB]">{agent.name}</div>
                  <div className="text-[#A89F91]">Role: {agent.jobType}</div>
                  <div className="text-[#A89F91]">Location: {agent.location}</div>
                  <div className="text-emerald-400 font-bold">Net P&L: +{agent.netProfit} MON</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
