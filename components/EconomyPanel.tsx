'use client';

import { INITIAL_ECONOMY, RESOURCES } from '@/lib/config/gameConstants';

interface ResourceData {
  price: number;
  supply: number;
  demand: number;
}

function ResourceCard({ 
  resource, 
  data, 
  badgeColor 
}: { 
  resource: typeof RESOURCES[keyof typeof RESOURCES]; 
  data: ResourceData;
  badgeColor: string;
}) {
  const demandRatio = data.demand / (data.supply || 1);
  const barWidth = Math.min(demandRatio * 100, 100);

  return (
    <div className="vintage-card p-5 hover:translate-y-[-2px] transition-all">
      {/* Stamp Header */}
      <div className="flex items-center justify-between mb-3 border-b-2 border-[#D5C29D] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{resource.symbol}</span>
          <span className="text-sm font-bold text-[#2A211D] uppercase tracking-wider font-serif">
            {resource.name}
          </span>
        </div>
        <div className={`stamp-badge text-[10px] ${badgeColor}`}>
          RATION CARD #{resource.id + 101}
        </div>
      </div>

      {/* Price — Large Vintage Mandi Rate */}
      <div className="mb-4 bg-[#EADCBF]/60 p-3 border border-[#D5C29D]">
        <div className="text-[10px] text-[#7D6C60] font-mono mb-0.5 tracking-wider font-bold">MANDI RATE (PRICE)</div>
        <div className="text-3xl font-black tabular-nums tracking-tight text-[#B23B23] font-mono">
          ₹{data.price} <span className="text-xs text-[#524339] font-normal">/ unit</span>
        </div>
      </div>

      {/* Supply & Demand Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
        <div className="bg-[#F7F0DF] border border-[#D5C29D] p-2">
          <div className="text-[9px] text-[#7D6C60] font-bold">GODOWN SUPPLY</div>
          <div className="text-base font-bold text-[#2A211D]">{data.supply.toLocaleString()}</div>
        </div>
        <div className="bg-[#F7F0DF] border border-[#D5C29D] p-2">
          <div className="text-[9px] text-[#7D6C60] font-bold">JANTA DEMAND</div>
          <div className="text-base font-bold text-[#2A211D]">{data.demand.toLocaleString()}</div>
        </div>
      </div>

      {/* Market Demand Ratio bar */}
      <div>
        <div className="flex justify-between text-[10px] text-[#524339] font-mono font-bold mb-1">
          <span>SHORTAGE INDEX</span>
          <span>{demandRatio.toFixed(2)}x</span>
        </div>
        <div className="w-full h-2 bg-[#EADCBF] border border-[#D5C29D] overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              demandRatio > 0.8 ? 'bg-[#A8201A]' : demandRatio > 0.5 ? 'bg-[#D96B27]' : 'bg-[#2D6A4F]'
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function EconomyPanel() {
  const economyData = INITIAL_ECONOMY;

  const badgeMap: Record<string, string> = {
    ENERGY: 'border-[#D96B27] text-[#D96B27]',
    STEEL: 'border-[#1B4965] text-[#1B4965]',
    FOOD: 'border-[#D48C00] text-[#D48C00]',
  };

  return (
    <section id="economy-panel" className="space-y-3">
      <div className="flex items-center justify-between border-b-2 border-[#2A211D] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#B23B23] border border-[#2A211D]" />
          <h2 className="text-base font-black uppercase tracking-widest text-[#2A211D] font-serif">
            PURANI DILLI MANDI RATES (LIVE MARKET)
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-[#E2F0D9] border border-[#2D6A4F] px-2 py-0.5 text-[10px] font-mono font-bold text-[#2D6A4F]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse-glow" />
          <span>SARKAR TELEGRAM LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(RESOURCES) as Array<keyof typeof RESOURCES>).map((key) => (
          <ResourceCard
            key={key}
            resource={RESOURCES[key]}
            data={economyData[key]}
            badgeColor={badgeMap[key]}
          />
        ))}
      </div>
    </section>
  );
}
