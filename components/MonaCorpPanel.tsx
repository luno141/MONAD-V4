'use client';

import { MONA_CORP } from '@/lib/config/gameConstants';

export default function MonaCorpPanel() {
  const strategy = 'AWAITING BRIBE';
  const lastAction = 'Inspecting local ration cards...';
  const txHash = '';

  return (
    <section id="mona-corp-panel" className="vintage-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#D5C29D] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#D48C00] border border-[#2A211D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2A211D] font-serif">
            {MONA_CORP.name}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-[#EADCBF] border border-[#D5C29D] px-2 py-0.5 text-[10px] font-mono font-bold text-[#524339]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D48C00] animate-pulse-glow" />
          <span>AUTONOMOUS BUREAU</span>
        </div>
      </div>

      {/* MCD Avatar / Badge */}
      <div className="flex items-center gap-4 bg-[#EADCBF] border-2 border-[#2A211D] p-3.5 mb-4 shadow-[2px_2px_0px_#2A211D]">
        <div className="w-12 h-12 bg-[#D48C00] border-2 border-[#2A211D] flex items-center justify-center text-2xl font-black text-[#F7F0DF] shadow-[1px_1px_0px_#2A211D]">
          🏛️
        </div>
        <div>
          <div className="text-sm font-black text-[#2A211D] font-serif">{MONA_CORP.name}</div>
          <div className="text-[10px] text-[#7D6C60] font-mono font-bold mt-0.5">Municipal Corporation of Delhi</div>
        </div>
      </div>

      {/* Strategy & Status */}
      <div className="space-y-3 font-mono text-xs">
        <div className="bg-[#F7F0DF] border border-[#D5C29D] p-2.5">
          <div className="text-[9px] text-[#7D6C60] font-bold mb-0.5">CURRENT MCD STRATEGY</div>
          <div className="font-bold text-[#D96B27] uppercase">{strategy}</div>
        </div>

        <div className="bg-[#F7F0DF] border border-[#D5C29D] p-2.5">
          <div className="text-[9px] text-[#7D6C60] font-bold mb-0.5">LAST OFFICER ACTION</div>
          <div className="text-[#2A211D]">{lastAction}</div>
        </div>

        {txHash && (
          <div className="bg-[#F7F0DF] border border-[#D5C29D] p-2.5">
            <div className="text-[9px] text-[#7D6C60] font-bold mb-0.5">RECEIPT HASH</div>
            <div className="font-mono text-[#1B4965] truncate">{txHash}</div>
          </div>
        )}
      </div>

      {/* Run MCD Button */}
      <button
        id="run-mona-corp-btn"
        disabled
        className="w-full mt-4 py-2.5 border-2 border-[#2A211D] font-mono text-xs font-bold uppercase tracking-wider
          bg-[#EADCBF] text-[#524339] shadow-[2px_2px_0px_#2A211D] cursor-not-allowed opacity-60"
      >
        TRIGGER MCD INSPECTION (ONCHAIN)
      </button>

      {/* MCD Decision Engine Rules */}
      <div className="mt-3 border-t border-[#D5C29D] pt-3 font-mono text-[10px] text-[#7D6C60]">
        <div className="font-bold mb-1 text-[#524339]">MCD AUTOMATION RULES:</div>
        <div className="space-y-1">
          <div>• IF file rate ≥ ₹{MONA_CORP.sellSteelThreshold} → SELL SARKARI FILES</div>
          <div>• IF katya rate ≥ ₹{MONA_CORP.sellEnergyThreshold} → SELL KATTYA POWER</div>
          <div>• IF file rate ≤ ₹{MONA_CORP.buildFactoryThreshold} → OPEN NEW THEKA</div>
          <div>• IF chakka jam → BUY SARKARI FILES</div>
        </div>
      </div>
    </section>
  );
}
