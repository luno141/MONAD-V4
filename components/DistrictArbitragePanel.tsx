'use client';

import React from 'react';
import { DistrictEconomyState } from '@/lib/types/agentTypes';
import {
  scanArbitrageOpportunities,
  ArbitrageOpportunity,
  DISTRICTS,
} from '@/lib/simulation/districtEconomy';

interface DistrictArbitragePanelProps {
  economy: DistrictEconomyState;
  onExecuteArbitrage: (opp: ArbitrageOpportunity) => void;
}

export default function DistrictArbitragePanel({
  economy,
  onExecuteArbitrage,
}: DistrictArbitragePanelProps) {
  const opportunities = scanArbitrageOpportunities(economy);

  return (
    <div className="w-full rounded-xl border-4 border-[#2A211D] bg-[#1A1412] p-4 shadow-2xl space-y-3 font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#3D3029] pb-2">
        <h3 className="text-sm font-black text-[#F3E5AB] flex items-center gap-2">
          <span>⚡</span> CROSS-DISTRICT CIVILIAN ARBITRAGE OPPORTUNITIES
        </h3>
        <span className="px-2 py-0.5 rounded text-[10px] bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706] font-bold">
          {opportunities.length} SPREADS DETECTED
        </span>
      </div>

      {/* Arbitrage Opportunities List */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {opportunities.length === 0 ? (
          <div className="p-4 text-center text-[11px] text-[#A89F91] bg-[#120D0B] rounded border border-[#3D3029]">
            No profitable arbitrage spreads right now. Prices are balanced across Mandi hubs.
          </div>
        ) : (
          opportunities.map((opp, idx) => {
            const sourceInfo = DISTRICTS[opp.sourceDistrict];
            const targetInfo = DISTRICTS[opp.targetDistrict];

            return (
              <div
                key={`${opp.id}-${idx}`}
                className="p-2.5 rounded-lg bg-[#1E1714] border border-[#3D3029] hover:border-[#D97706] transition flex flex-wrap items-center justify-between gap-2 text-[11px]"
              >
                {/* Commodity & Route */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">📦</span>
                  <div>
                    <div className="font-bold text-[#F3E5AB] uppercase">
                      {opp.commodity}
                    </div>
                    <div className="text-[10px] text-[#A89F91] flex items-center gap-1">
                      <span style={{ color: sourceInfo.color }}>
                        {sourceInfo.name} ({opp.buyPrice} MON)
                      </span>
                      <span>➔</span>
                      <span style={{ color: targetInfo.color }}>
                        {targetInfo.name} ({opp.sellPrice} MON)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Spread & ROI */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-emerald-400 font-black">
                      +{opp.netProfit} MON Net
                    </div>
                    <div className="text-[9px] text-[#A89F91]">
                      ROI: +{opp.roiPct}% (Freight: {opp.transportCost} MON)
                    </div>
                  </div>

                  <button
                    onClick={() => onExecuteArbitrage(opp)}
                    className="px-3 py-1 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-[10px] rounded transition shadow"
                  >
                    DISPATCH HAUL
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
