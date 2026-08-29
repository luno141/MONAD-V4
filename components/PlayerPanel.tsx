'use client';

import { INITIAL_PLAYER } from '@/lib/config/gameConstants';

export default function PlayerPanel() {
  const player = INITIAL_PLAYER;

  return (
    <section id="player-panel" className="vintage-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#D5C29D] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#D96B27] border border-[#2A211D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2A211D] font-serif">
            NETA JI VAULT (PLAYER STATUS)
          </h2>
        </div>
        <span className="stamp-badge text-[9px] border-[#2A211D] text-[#2A211D]">
          LICENSED OPERATOR
        </span>
      </div>

      {/* Black Money Cash — Featured */}
      <div className="bg-[#EADCBF] border-2 border-[#2A211D] p-4 mb-4 shadow-[2px_2px_0px_#2A211D]">
        <div className="text-[10px] text-[#524339] font-mono font-bold mb-0.5 tracking-wider">
          KALA DHAN (BLACK MONEY) 💵
        </div>
        <div className="text-3xl font-black tabular-nums text-[#2A211D] font-mono">
          ₹{player.credits.toLocaleString()}
          <span className="text-xs font-bold text-[#7D6C60] ml-1.5">CASH IN TRUNK</span>
        </div>
      </div>

      {/* Stats Grid: Thekas + Babus */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-mono">
        <div className="bg-[#F7F0DF] border border-[#D5C29D] p-3 text-center">
          <div className="text-[9px] text-[#7D6C60] font-bold">DESI THEKAS 🍺</div>
          <div className="text-2xl font-black text-[#2A211D]">{player.factories}</div>
        </div>
        <div className="bg-[#F7F0DF] border border-[#D5C29D] p-3 text-center">
          <div className="text-[9px] text-[#7D6C60] font-bold">SARKARI BABUS 👔</div>
          <div className="text-2xl font-black text-[#2A211D]">{player.miners}</div>
        </div>
      </div>

      {/* Inventory List */}
      <div>
        <div className="text-[10px] text-[#524339] font-mono font-bold mb-2 uppercase border-b border-[#D5C29D] pb-1">
          GODOWN INVENTORY
        </div>
        <div className="space-y-2">
          <InventoryRow label="Katiya Line" symbol="⚡" amount={player.energy} color="text-[#D96B27]" />
          <InventoryRow label="Sarkari Files" symbol="📁" amount={player.steel} color="text-[#1B4965]" />
          <InventoryRow label="Chole Bhature" symbol="🍛" amount={player.food} color="text-[#D48C00]" />
        </div>
      </div>
    </section>
  );
}

function InventoryRow({ label, symbol, amount, color }: {
  label: string;
  symbol: string;
  amount: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-[#EADCBF]/50 border border-[#D5C29D] px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">{symbol}</span>
        <span className="text-xs font-bold text-[#2A211D]">{label}</span>
      </div>
      <span className={`text-sm font-black font-mono tabular-nums ${color}`}>{amount} UNITS</span>
    </div>
  );
}
