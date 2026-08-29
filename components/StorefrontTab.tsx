'use client';

import React, { useState } from 'react';
import { CommodityType, CommodityMarketData } from '@/lib/types/agentTypes';

interface StorefrontTabProps {
  markets: Record<CommodityType, CommodityMarketData>;
  playerBalance: number;
  onTrade: (commodity: CommodityType, amount: number, isBuy: boolean) => void;
}

export default function StorefrontTab({
  markets,
  playerBalance,
  onTrade,
}: StorefrontTabProps) {
  const [tradeAmount] = useState<number>(1);

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Storefront Header */}
      <div className="flex items-center justify-between border-b border-[#2D231D] pb-3">
        <div>
          <h3 className="text-base font-black text-[#F3E5AB] flex items-center gap-2">
            <span>🏪</span> MANDI WHOLESALE COMMODITY STOREFRONT
          </h3>
          <p className="text-[11px] text-[#A89F91]">
            Direct wholesale trading terminal for spices, grain, textiles, food, fuel & labor contracts.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#2A1F19] border border-[#D97706] text-xs font-bold text-emerald-400">
          Player Balance: {playerBalance} MON
        </div>
      </div>

      {/* Commodity Market Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(markets) as CommodityType[]).map((cType) => {
          const m = markets[cType];
          const avgPrice = m.basePrice || m.districtPrices.khari_baoli;
          const kbSupply = m.districtSupply.khari_baoli;

          return (
            <div
              key={cType}
              className="p-4 rounded-xl bg-[#140F0D] border border-[#2D231D] hover:border-[#D97706] transition space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-[#231A15] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{m.symbol}</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#F3E5AB] uppercase">{m.name}</h4>
                    <div className="text-[10px] text-[#A89F91]">Khari Baoli Supply: {kbSupply} units</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500">
                  WHOLESALE
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#A89F91]">
                  <span>Khari Baoli Price:</span>
                  <span className="text-emerald-400 font-bold">{m.districtPrices.khari_baoli} MON</span>
                </div>
                <div className="flex justify-between text-[#A89F91]">
                  <span>Chandni Chowk Price:</span>
                  <span className="text-[#F59E0B] font-bold">{m.districtPrices.chandni_chowk} MON</span>
                </div>
                <div className="flex justify-between text-[#A89F91]">
                  <span>Jama Masjid Price:</span>
                  <span className="text-blue-400 font-bold">{m.districtPrices.jama_masjid} MON</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-2 border-t border-[#231A15]">
                <button
                  onClick={() => onTrade(cType, tradeAmount, true)}
                  className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded transition shadow"
                >
                  BUY 1 ({avgPrice} MON)
                </button>
                <button
                  onClick={() => onTrade(cType, tradeAmount, false)}
                  className="flex-1 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded transition shadow"
                >
                  SELL 1 ({avgPrice} MON)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
