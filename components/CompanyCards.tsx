'use client';

import { useState } from 'react';
import EconomicTwinModal from './EconomicTwinModal';

const COMPANIES = [
  {
    id: 0,
    name: 'Katiya Power Corp',
    emoji: '⚡',
    type: 'Rule Agent — Purani Dilli Power Mafia',
    strategy: 'Buy cheap katiya, sell when MCD raids start',
    agentType: 'RULE AGENT',
    cash: 1200,
    energy: 300,
    steel: 50,
    food: 80,
    thekas: 2,
    recentActions: [
      { action: 'SELL', asset: 'Katiya', amount: 20, reason: 'Price above ₹15' },
      { action: 'HOLD', asset: '—', amount: 0, reason: 'Market stable' },
    ],
  },
  {
    id: 1,
    name: 'Dilli Steel Corp',
    emoji: '📁',
    type: 'AI Agent — GPT-powered File Trader',
    strategy: 'Aggressive file hoarding, theka expansion',
    agentType: 'AI AGENT (GPT)',
    cash: 1800,
    energy: 100,
    steel: 520,
    food: 40,
    thekas: 4,
    recentActions: [
      { action: 'BUY', asset: 'Sarkari Files', amount: 50, reason: 'AI prediction: shortage incoming' },
      { action: 'BUILD', asset: 'Theka', amount: 1, reason: 'Steel price favorable for expansion' },
    ],
  },
  {
    id: 2,
    name: 'Rajdhani Builders',
    emoji: '🏗️',
    type: 'Rule Agent — Conservative Constructor',
    strategy: 'Maintain cash, buy cheap steel, avoid katiya spikes',
    agentType: 'RULE AGENT',
    cash: 2400,
    energy: 60,
    steel: 200,
    food: 120,
    thekas: 1,
    recentActions: [
      { action: 'BUY', asset: 'Sarkari Files', amount: 30, reason: 'Price below ₹15' },
      { action: 'HOLD', asset: '—', amount: 0, reason: 'Katiya too expensive' },
    ],
  },
];

export default function CompanyCards() {
  const [selectedCompany, setSelectedCompany] = useState<typeof COMPANIES[0] | null>(null);

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b-2 border-[#2A211D] pb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#D48C00] border border-[#2A211D]" />
            <h2 className="text-base font-black uppercase tracking-widest text-[#2A211D] font-serif">
              AUTONOMOUS COMPANIES (DILLI KI COMPANIES)
            </h2>
          </div>
          <div className="flex items-center gap-1.5 bg-[#EADCBF] border border-[#D5C29D] px-2 py-0.5 text-[10px] font-mono font-bold text-[#524339]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse-glow" />
            TRADING LIVE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className="vintage-card p-4 hover:translate-y-[-2px] transition-all cursor-pointer"
              onClick={() => setSelectedCompany(company)}
            >
              {/* Company Header */}
              <div className="flex items-center gap-3 border-b-2 border-[#D5C29D] pb-3 mb-3">
                <div className="w-10 h-10 bg-[#D96B27] border-2 border-[#2A211D] flex items-center justify-center text-xl shadow-[1px_1px_0px_#2A211D]">
                  {company.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[#2A211D] text-sm font-serif truncate">{company.name}</div>
                  <div className="text-[9px] font-mono text-[#7D6C60] font-bold">{company.agentType}</div>
                </div>
              </div>

              {/* Treasury */}
              <div className="bg-[#EADCBF]/60 border border-[#D5C29D] p-2 mb-3 font-mono">
                <div className="text-[9px] text-[#7D6C60] font-bold">TREASURY</div>
                <div className="text-xl font-black text-[#2A211D]">₹{company.cash.toLocaleString()}</div>
              </div>

              {/* Holdings Grid */}
              <div className="grid grid-cols-3 gap-1.5 mb-3 font-mono text-center text-[10px]">
                <div className="bg-[#F7F0DF] border border-[#D5C29D] p-1.5">
                  <div className="text-[8px] text-[#7D6C60]">KATIYA</div>
                  <div className="font-bold text-[#D96B27]">{company.energy}</div>
                </div>
                <div className="bg-[#F7F0DF] border border-[#D5C29D] p-1.5">
                  <div className="text-[8px] text-[#7D6C60]">FILES</div>
                  <div className="font-bold text-[#1B4965]">{company.steel}</div>
                </div>
                <div className="bg-[#F7F0DF] border border-[#D5C29D] p-1.5">
                  <div className="text-[8px] text-[#7D6C60]">CHOLE B.</div>
                  <div className="font-bold text-[#D48C00]">{company.food}</div>
                </div>
              </div>

              {/* Strategy */}
              <div className="bg-[#F7F0DF] border border-[#D5C29D] p-2 mb-3 font-mono">
                <div className="text-[8px] text-[#7D6C60] font-bold">STRATEGY</div>
                <div className="text-[10px] text-[#2A211D] mt-0.5">{company.strategy}</div>
              </div>

              {/* Recent Actions */}
              <div className="space-y-1 mb-3">
                {company.recentActions.map((action, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className={`font-bold ${action.action === 'BUY' ? 'text-[#2D6A4F]' : action.action === 'SELL' ? 'text-[#A8201A]' : 'text-[#7D6C60]'}`}>
                      {action.action}
                    </span>
                    <span className="text-[#524339]">{action.asset}</span>
                    {action.amount > 0 && <span className="text-[#7D6C60]">×{action.amount}</span>}
                  </div>
                ))}
              </div>

              {/* Simulate Button */}
              <button className="w-full py-2 border-2 border-[#2A211D] bg-[#1B4965] text-[#F7F0DF] font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_#2A211D] hover:bg-[#153B52] transition-all cursor-pointer">
                SIMULATE INVESTMENT 🔮
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Economic Twin Modal */}
      <EconomicTwinModal
        isOpen={selectedCompany !== null}
        onClose={() => setSelectedCompany(null)}
        company={selectedCompany || COMPANIES[0]}
      />
    </>
  );
}
