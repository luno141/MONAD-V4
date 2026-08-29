'use client';

import React from 'react';
import { Agent, DistrictId, CommodityMarketData } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

interface FloatingContextCardProps {
  selectedAgent?: Agent;
  selectedDistrict?: DistrictId;
  markets: Record<string, CommodityMarketData>;
  onClose: () => void;
  onDeployAgent: (dId: DistrictId) => void;
}

export default function FloatingContextCard({
  selectedAgent,
  selectedDistrict,
  markets,
  onClose,
  onDeployAgent,
}: FloatingContextCardProps) {
  if (!selectedAgent && !selectedDistrict) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 rounded-xl border-4 border-[#2A211D] bg-[#1A1412] p-4 shadow-2xl font-mono text-xs text-[#D4C4B5] animate-slide-up backdrop-blur-md">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[#A89F91] hover:text-white font-bold"
      >
        ✕
      </button>

      {/* AGENT INSPECTION CARD */}
      {selectedAgent && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 border-b border-[#3D3029] pb-2.5">
            <div className="w-10 h-10 rounded-full bg-[#2A1F19] border-2 border-[#D97706] flex items-center justify-center text-xl shadow">
              {selectedAgent.avatar}
            </div>
            <div>
              <h4 className="font-black text-[#F3E5AB]">{selectedAgent.name}</h4>
              <div className="text-[10px] text-[#A89F91]">
                {selectedAgent.jobType} • Lvl {selectedAgent.level} ({selectedAgent.efficiency}% Eff.)
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-[#A89F91]">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">{selectedAgent.status}</span>
            </div>
            <div className="flex justify-between text-[#A89F91]">
              <span>Location:</span>
              <span className="text-[#F3E5AB]">{selectedAgent.location}</span>
            </div>
            <div className="flex justify-between text-[#A89F91]">
              <span>Current Task:</span>
              <span className="text-[#D4C4B5] font-bold truncate max-w-[150px]">
                {selectedAgent.currentTask}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#3D3029] pt-1">
              <span>Net Profit:</span>
              <span className="text-emerald-400 font-black">
                +{selectedAgent.netProfit} MON
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DISTRICT LANDMARK INSPECTION CARD */}
      {!selectedAgent && selectedDistrict && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 border-b border-[#3D3029] pb-2.5">
            <span className="text-3xl">{DISTRICTS[selectedDistrict].icon}</span>
            <div>
              <h4 className="font-black text-[#F3E5AB]">
                {DISTRICTS[selectedDistrict].name}
              </h4>
              <div className="text-[10px] text-[#F59E0B] font-bold">
                {DISTRICTS[selectedDistrict].hindiName}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#A89F91] italic">
            {DISTRICTS[selectedDistrict].tagline}
          </p>

          {/* District Commodity Prices */}
          <div className="space-y-1 text-[10px] bg-[#120D0B] p-2 rounded border border-[#3D3029]">
            <div className="font-bold text-[#F3E5AB] mb-1">LOCAL MANDI PRICES:</div>
            {Object.values(markets).map((m) => (
              <div key={m.id} className="flex justify-between">
                <span>{m.symbol} {m.name}:</span>
                <span className="text-emerald-400 font-bold">
                  {m.districtPrices[selectedDistrict]} MON
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onDeployAgent(selectedDistrict)}
            className="w-full py-1.5 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs rounded transition shadow"
          >
            + DEPLOY AGENT TO {DISTRICTS[selectedDistrict].name.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
