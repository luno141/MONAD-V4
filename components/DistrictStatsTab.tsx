'use client';

import React from 'react';
import { DistrictEconomyState } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

interface DistrictStatsTabProps {
  economy: DistrictEconomyState;
}

export default function DistrictStatsTab({ economy }: DistrictStatsTabProps) {
  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Stats Header */}
      <div className="border-b border-[#2D231D] pb-3">
        <h3 className="text-base font-black text-[#F3E5AB] flex items-center gap-2">
          <span>📊</span> DISTRICT MACROECONOMY & TREASURY STATS
        </h3>
        <p className="text-[11px] text-[#A89F91]">
          Public treasury reserves, labor pool capacity, and district commodity price indexes.
        </p>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#140F0D] border border-[#2D231D]">
          <span className="text-[10px] text-[#A89F91]">TOTAL WAGES PAID</span>
          <div className="text-lg font-black text-emerald-400">{economy.totalCivilianWages || 4560} MON</div>
        </div>

        <div className="p-3 rounded-xl bg-[#140F0D] border border-[#2D231D]">
          <span className="text-[10px] text-[#A89F91]">CHAI STALL TRANSACTIONS</span>
          <div className="text-lg font-black text-[#F59E0B]">{economy.totalChaiTransactions || 184} SERVED</div>
        </div>

        <div className="p-3 rounded-xl bg-[#140F0D] border border-[#2D231D]">
          <span className="text-[10px] text-[#A89F91]">CARGO FREIGHT HAULS</span>
          <div className="text-lg font-black text-blue-400">{economy.totalCargoHauls || 92} DELIVERIES</div>
        </div>

        <div className="p-3 rounded-xl bg-[#140F0D] border border-[#2D231D]">
          <span className="text-[10px] text-[#A89F91]">FREIGHT COST / DISTANCE</span>
          <div className="text-lg font-black text-[#F3E5AB]">{economy.transportCostPerDistance} MON / tile</div>
        </div>
      </div>

      {/* District Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {Object.values(DISTRICTS).map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-[#140F0D] border border-[#2D231D] hover:border-[#D97706] transition space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-[#231A15] pb-2">
              <span className="text-2xl">{d.icon}</span>
              <div>
                <h4 className="font-bold text-sm text-[#F3E5AB]">{d.name}</h4>
                <div className="text-[10px] text-[#A89F91]">{d.tagline}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#A89F91]">
                <span>Public Treasury:</span>
                <span className="text-emerald-400 font-bold">{d.publicTreasury} MON</span>
              </div>
              <div className="flex justify-between text-[#A89F91]">
                <span>Labor Pool Capacity:</span>
                <span className="text-[#F3E5AB] font-bold">{d.laborPool} Workers</span>
              </div>
              <div className="flex justify-between text-[#A89F91]">
                <span>Total Wages Disbursed:</span>
                <span className="text-amber-400 font-bold">{d.totalWagesPaid} MON</span>
              </div>
              <div className="flex justify-between text-[#A89F91]">
                <span>Primary Commodities:</span>
                <span className="text-[#D4C4B5] font-bold uppercase">{d.primaryCommodities.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
