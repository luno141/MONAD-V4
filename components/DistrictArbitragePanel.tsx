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
    <div className="w-full rounded-2xl border border-[#1E2232] bg-[#0E1018] p-5 shadow-2xl space-y-3 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A1D2B] pb-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <span>⚡</span> CROSS-DISTRICT CIVILIAN ARBITRAGE OPPORTUNITIES
        </h3>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold">
          {opportunities.length} SPREADS DETECTED
        </span>
      </div>

      {/* Arbitrage Opportunities List */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {opportunities.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 bg-[#06070B] rounded-xl border border-[#1A1D2B]">
            No profitable arbitrage spreads right now. Prices are balanced across Mandi hubs.
          </div>
        ) : (
          opportunities.map((opp, idx) => {
            const sourceInfo = DISTRICTS[opp.sourceDistrict];
            const targetInfo = DISTRICTS[opp.targetDistrict];

            return (
              <div
                key={`${opp.id}-${idx}`}
                className="p-3 rounded-xl bg-[#06070B] border border-[#1A1D2B] hover:border-blue-500/50 transition flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                {/* Commodity & Route */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="font-bold text-white uppercase">
                      {opp.commodity}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
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
                    <div className="text-emerald-400 font-extrabold">
                      +{opp.netProfit} MON Net
                    </div>
                    <div className="text-[10px] text-gray-400">
                      ROI: +{opp.roiPct}% (Freight: {opp.transportCost} MON)
                    </div>
                  </div>

                  <button
                    onClick={() => onExecuteArbitrage(opp)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow shadow-blue-600/20"
                  >
                    Dispatch Haul
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
