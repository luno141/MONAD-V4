'use client';

import React from 'react';

interface EconomyExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EconomyExplainerModal({
  isOpen,
  onClose,
}: EconomyExplainerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono text-[#D4C4B5]">
      <div className="relative w-full max-w-2xl rounded-2xl border-4 border-[#2A211D] bg-[#16110F] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3D3029] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706] flex items-center justify-center text-xl text-black font-black shadow-lg">
              📜
            </div>
            <div>
              <h3 className="text-lg font-black text-[#F3E5AB]">
                OLD DELHI AUTONOMOUS ECONOMY GUIDE
              </h3>
              <p className="text-xs text-[#A89F91]">
                Understanding Micro-Payloads & Multi-District Arbitrage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#A89F91] hover:text-white font-bold text-base flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* 3 Step Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#1E1714] border border-[#3D3029] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706] flex items-center justify-center font-black text-sm">
              1
            </div>
            <h4 className="font-bold text-[#F3E5AB] text-xs">Micro-Payload Deployment</h4>
            <p className="text-[11px] text-[#A89F91] leading-relaxed">
              Enable autonomous agents with minimal capital payloads (5–25 MON). No large capital locks or manual micro-management.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E1714] border border-[#3D3029] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h4 className="font-bold text-[#F3E5AB] text-xs">City Network Arbitrage</h4>
            <p className="text-[11px] text-[#A89F91] leading-relaxed">
              Agents scan price spreads between Khari Baoli (Spices), Chandni Chowk (Textiles), and Jama Masjid (Food) autonomously.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E1714] border border-[#3D3029] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h4 className="font-bold text-[#F3E5AB] text-xs">Continuous Net Yield Settle</h4>
            <p className="text-[11px] text-[#A89F91] leading-relaxed">
              Agents buy low, transport along city lanes, sell high, and stream net MON profits directly back into your wallet balance.
            </p>
          </div>
        </div>

        {/* District Matrix Diagram */}
        <div className="p-4 rounded-xl bg-[#120D0B] border border-[#3D3029] space-y-3">
          <h4 className="text-xs font-bold text-[#F3E5AB] flex items-center gap-2">
            <span>🗺️</span> DISTRICT TOPOLOGY & COMMODITY MATRIX
          </h4>

          <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-mono">
            <div className="p-2.5 rounded bg-[#1A1412] border border-[#D97706]/40">
              <span className="text-base block mb-1">🏛️</span>
              <div className="font-bold text-[#F3E5AB]">Khari Baoli</div>
              <div className="text-[#A89F91]">Spices & Grain</div>
              <div className="text-emerald-400 font-bold mt-1">Wholesale Hub</div>
            </div>

            <div className="p-2.5 rounded bg-[#1A1412] border border-[#3B82F6]/40">
              <span className="text-base block mb-1">🏪</span>
              <div className="font-bold text-[#F3E5AB]">Chandni Chowk</div>
              <div className="text-[#A89F91]">Textiles & Labor</div>
              <div className="text-blue-400 font-bold mt-1">Trade Marketplace</div>
            </div>

            <div className="p-2.5 rounded bg-[#1A1412] border border-[#EC4899]/40">
              <span className="text-base block mb-1">🕌</span>
              <div className="font-bold text-[#F3E5AB]">Jama Masjid</div>
              <div className="text-[#A89F91]">Food & Services</div>
              <div className="text-pink-400 font-bold mt-1">Retail Demand</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#D97706] hover:bg-[#F59E0B] text-black font-mono font-black text-xs rounded-xl shadow-xl transition transform hover:scale-[1.01]"
        >
          GOT IT — RETURN TO LIVE CITY NETWORK 🚀
        </button>
      </div>
    </div>
  );
}
