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
    <div className="relative w-full rounded-2xl border-4 border-[#2A211D] bg-[#16110F] p-4 shadow-2xl overflow-hidden min-h-[480px]">
      {/* Background Tiled Grid & Decorative Isometric Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3B2D26_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#3D3029] pb-3 mb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-xl text-[#F59E0B]">
            🗺️
          </div>
          <div>
            <h2 className="text-base font-black text-[#F3E5AB] tracking-wide flex items-center gap-2">
              OLD DELHI CITY NETWORK — LIVE MANDI SPATIAL MAP
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]">
                ISOMETRIC ENGINE
              </span>
            </h2>
            <p className="text-[11px] text-[#A89F91]">
              Select district hubs to inspect micro-prices or activate autonomous workforce agents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#1E1714] rounded-lg border border-[#4A3B32] text-[11px] text-[#D4C4B5] font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous Workforce: {agents.length} Active Agents</span>
          </div>
        </div>
      </div>

      {/* Interactive City Network Viewport */}
      <div className="relative w-full h-[380px] bg-[#110D0B] rounded-xl border-2 border-[#382B24] overflow-hidden select-none">
        {/* Isometric Grid Floor Decorative Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(60deg, #D97706 1px, transparent 1px), linear-gradient(-60deg, #D97706 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Road & Transit Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 stroke-current text-[#D97706]">
          {/* Path Khari Baoli <-> Chandni Chowk */}
          <line
            x1={`${districtNodes.khari_baoli.x}%`}
            y1={`${districtNodes.khari_baoli.y}%`}
            x2={`${districtNodes.chandni_chowk.x}%`}
            y2={`${districtNodes.chandni_chowk.y}%`}
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.8"
          />
          {/* Path Chandni Chowk <-> Jama Masjid */}
          <line
            x1={`${districtNodes.chandni_chowk.x}%`}
            y1={`${districtNodes.chandni_chowk.y}%`}
            x2={`${districtNodes.jama_masjid.x}%`}
            y2={`${districtNodes.jama_masjid.y}%`}
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.8"
          />
          {/* Path Khari Baoli <-> Jama Masjid */}
          <line
            x1={`${districtNodes.khari_baoli.x}%`}
            y1={`${districtNodes.khari_baoli.y}%`}
            x2={`${districtNodes.jama_masjid.x}%`}
            y2={`${districtNodes.jama_masjid.y}%`}
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.4"
          />
        </svg>

        {/* Isometric Background Buildings & Landmarks */}
        <div className="absolute left-[12%] top-[25%] opacity-40 text-2xl pointer-events-none font-mono text-[10px]">
          🏢 Storefront Haveli
        </div>
        <div className="absolute left-[38%] top-[12%] opacity-40 text-2xl pointer-events-none font-mono text-[10px]">
          🏬 Textile Bazaar
        </div>
        <div className="absolute left-[65%] top-[30%] opacity-40 text-2xl pointer-events-none font-mono text-[10px]">
          🕌 Red Sandstone Minaret
        </div>
        <div className="absolute left-[85%] top-[70%] opacity-40 text-2xl pointer-events-none font-mono text-[10px]">
          🍛 Spice Warehouse
        </div>

        {/* Render District Nodes */}
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
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              <div
                className={`relative flex flex-col items-center p-3 rounded-xl border-2 backdrop-blur-md shadow-2xl transition-all ${
                  isSelected
                    ? 'border-[#F59E0B] bg-[#2A1F19]/95 shadow-[#F59E0B]/20 ring-2 ring-[#F59E0B]/50'
                    : 'border-[#4A3B32] bg-[#1A1412]/90 hover:border-[#D97706]'
                }`}
              >
                <div className="relative text-3xl mb-1 flex items-center gap-1">
                  <span>{d.icon}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-[#D97706] text-black">
                    {d.hindiName}
                  </span>
                </div>

                <span className="font-mono text-xs font-black text-[#F3E5AB] text-center whitespace-nowrap">
                  {d.name}
                </span>

                <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono font-bold bg-[#120D0B] px-2 py-1 rounded border border-[#3A2D25]">
                  <span className="text-[#F59E0B]">🌶️ {spicePrice} MON</span>
                  <span className="text-[#60A5FA]">🌾 {grainPrice} MON</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDeployModal(dId);
                  }}
                  className="mt-2 w-full py-1 px-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-mono font-black text-[10px] rounded-lg transition shadow"
                >
                  + DEPLOY AGENT
                </button>
              </div>
            </div>
          );
        })}

        {/* Render Active Autonomous Agents */}
        {agents.map((agent, index) => {
          let agentX = districtNodes[agent.location].x;
          let agentY = districtNodes[agent.location].y;

          if (agent.status === 'TRAVELLING' && agent.targetLocation) {
            const targetPos = districtNodes[agent.targetLocation];
            agentX = (agentX + targetPos.x) / 2;
            agentY = (agentY + targetPos.y) / 2;
          } else {
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
              {agent.speechBubble && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#FFFBEB] text-[#1E1714] font-mono text-[9px] font-black rounded-lg border border-[#D97706] shadow-xl whitespace-nowrap z-40 animate-bounce">
                  {agent.speechBubble}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#FFFBEB]" />
                </div>
              )}

              <div className="relative group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#2A1F19] border-2 border-[#F59E0B] flex items-center justify-center text-base shadow-xl transition transform group-hover:scale-125">
                  {agent.avatar}
                </div>

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

                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-44 p-2 bg-[#1E1714] border-2 border-[#D97706] rounded-xl shadow-2xl z-50 text-[10px] font-mono">
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
