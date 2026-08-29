'use client';

import React from 'react';
import { DistrictEconomyState } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

interface DistrictStatsTabProps {
  economy: DistrictEconomyState;
}

export default function DistrictStatsTab({ economy }: DistrictStatsTabProps) {
  return (
    <div className="w-full space-y-4 font-sans select-none">
      {/* Stats Header */}
      <div className="border-b border-[#1A1D2B] pb-3">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <span>📊</span> DISTRICT MACROECONOMY & TREASURY STATS
        </h3>
        <p className="text-xs text-gray-400">
          Public treasury reserves, labor pool capacity, and district commodity price indexes.
        </p>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#0E1018] border border-[#1E2232]">
          <span className="text-[10px] text-gray-400 font-medium">TOTAL WAGES PAID</span>
          <div className="text-lg font-black text-emerald-400">{economy.totalCivilianWages || 4560} MON</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1018] border border-[#1E2232]">
          <span className="text-[10px] text-gray-400 font-medium">CHAI STALL TRANSACTIONS</span>
          <div className="text-lg font-black text-amber-400">{economy.totalChaiTransactions || 184} SERVED</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1018] border border-[#1E2232]">
          <span className="text-[10px] text-gray-400 font-medium">CARGO FREIGHT HAULS</span>
          <div className="text-lg font-black text-blue-400">{economy.totalCargoHauls || 92} DELIVERIES</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1018] border border-[#1E2232]">
          <span className="text-[10px] text-gray-400 font-medium">FREIGHT COST / DISTANCE</span>
          <div className="text-lg font-black text-white">{economy.transportCostPerDistance} MON / tile</div>
        </div>
      </div>

      {/* District Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {Object.values(DISTRICTS).map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-[#0E1018] border border-[#1E2232] hover:border-blue-500/50 transition space-y-3 shadow-lg"
          >
            <div className="flex items-center gap-3 border-b border-[#1A1D2B] pb-2.5">
              <span className="text-2xl">{d.icon}</span>
              <div>
                <h4 className="font-bold text-sm text-white">{d.name}</h4>
                <div className="text-[10px] text-gray-400">{d.tagline}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Public Treasury:</span>
                <span className="text-emerald-400 font-bold">{d.publicTreasury} MON</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Labor Pool Capacity:</span>
                <span className="text-white font-bold">{d.laborPool} Workers</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Total Wages Disbursed:</span>
                <span className="text-amber-400 font-bold">{d.totalWagesPaid} MON</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Primary Commodities:</span>
                <span className="text-blue-400 font-bold uppercase">{d.primaryCommodities.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
