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
    <div className="w-full space-y-4 font-sans select-none">
      {/* Storefront Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#1A1D2B] pb-3 gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>🏪</span> MANDI WHOLESALE COMMODITY STOREFRONT
          </h3>
          <p className="text-xs text-gray-400">
            Direct wholesale trading terminal for spices, grain, textiles, food, fuel & labor contracts.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-[#141622] border border-emerald-500/40 text-xs font-bold text-emerald-400 shadow">
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
              className="p-4 rounded-xl bg-[#0E1018] border border-[#1E2232] hover:border-blue-500/50 transition space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[#1A1D2B] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{m.symbol}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase">{m.name}</h4>
                    <div className="text-[10px] text-gray-400">Khari Baoli Supply: {kbSupply} units</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  WHOLESALE
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Khari Baoli Price:</span>
                  <span className="text-emerald-400 font-bold">{m.districtPrices.khari_baoli} MON</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Chandni Chowk Price:</span>
                  <span className="text-amber-400 font-bold">{m.districtPrices.chandni_chowk} MON</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Jama Masjid Price:</span>
                  <span className="text-blue-400 font-bold">{m.districtPrices.jama_masjid} MON</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-2 border-t border-[#1A1D2B]">
                <button
                  onClick={() => onTrade(cType, tradeAmount, true)}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow"
                >
                  BUY 1 ({avgPrice} MON)
                </button>
                <button
                  onClick={() => onTrade(cType, tradeAmount, false)}
                  className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-lg transition shadow"
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
