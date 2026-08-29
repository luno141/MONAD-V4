'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { runEconomicTwin, SimulationResult, MarketSnapshot, CompanyState } from '@/lib/simulation/economicTwin';
import { INITIAL_ECONOMY } from '@/lib/config/gameConstants';
import { MARKET_CONTRACT_ADDRESS, MARKET_ABI } from '@/lib/contracts/marketAbi';

interface EconomicTwinModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    id?: number;
    name: string;
    emoji: string;
    type: string;
    cash: number;
    energy: number;
    steel: number;
    food: number;
    thekas: number;
  };
}

export default function EconomicTwinModal({ isOpen, onClose, company }: EconomicTwinModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [invested, setInvested] = useState(false);
  const [txHashStr, setTxHashStr] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setResult(null);

    // Small delay for dramatic effect
    setTimeout(() => {
      const market: MarketSnapshot = {
        energyPrice: INITIAL_ECONOMY.ENERGY.price,
        steelPrice: INITIAL_ECONOMY.STEEL.price,
        foodPrice: INITIAL_ECONOMY.FOOD.price,
        energySupply: INITIAL_ECONOMY.ENERGY.supply,
        steelSupply: INITIAL_ECONOMY.STEEL.supply,
        foodSupply: INITIAL_ECONOMY.FOOD.supply,
      };

      const companyState: CompanyState = {
        name: company.name,
        cash: company.cash,
        energy: company.energy,
        steel: company.steel,
        food: company.food,
        thekas: company.thekas,
      };

      const sim = runEconomicTwin(market, companyState, investmentAmount, 1000);
      setResult(sim);
      setIsSimulating(false);
    }, 1500);
  }, [investmentAmount, company]);

  const handleInvest = () => {
    const compId = company.id ?? 0;
    if (isConnected && MARKET_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      writeContract({
        address: MARKET_CONTRACT_ADDRESS,
        abi: MARKET_ABI,
        functionName: 'investInCompany',
        args: [BigInt(compId)],
        value: parseEther(investmentAmount.toString()),
      }, {
        onSuccess: (txHash) => {
          setTxHashStr(txHash);
          setInvested(true);
        },
        onError: (err) => {
          alert(`Investment failed: ${err.message}`);
        }
      });
    } else {
      setTxHashStr(`0xsimulated${Math.random().toString(16).slice(2, 10)}`);
      setInvested(true);
    }
  };

  if (!isOpen) return null;

  const riskColors = {
    LOW: { bg: 'bg-[#2D6A4F]', text: 'text-[#F7F0DF]' },
    MEDIUM: { bg: 'bg-[#D96B27]', text: 'text-[#F7F0DF]' },
    HIGH: { bg: 'bg-[#A8201A]', text: 'text-[#F7F0DF]' },
  };

  const recColors = {
    INVEST: { bg: 'bg-[#2D6A4F]', text: 'INVEST — Paisa Lagao! 💰' },
    HOLD: { bg: 'bg-[#D48C00]', text: 'HOLD — Ruko Zara, Sabar Karo 🤚' },
    AVOID: { bg: 'bg-[#A8201A]', text: 'AVOID — Chhodo Yaar! ❌' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#140F0E]/80" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto vintage-card p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2A211D] text-[#F7F0DF] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest font-serif">
              📊 ARTHIK JODUA (ECONOMIC TWIN)
            </h2>
            <p className="text-[11px] font-mono opacity-70 mt-0.5">
              1,000 Simulated Market Futures — Purani Dilli Engine
            </p>
          </div>
          <button onClick={onClose} className="text-2xl font-bold hover:text-[#D96B27] transition-colors cursor-pointer">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Company Info */}
          <div className="flex items-center gap-4 bg-[#EADCBF] border-2 border-[#2A211D] p-4 shadow-[2px_2px_0px_#2A211D]">
            <div className="w-14 h-14 bg-[#D96B27] border-2 border-[#2A211D] flex items-center justify-center text-2xl shadow-[1px_1px_0px_#2A211D]">
              {company.emoji}
            </div>
            <div>
              <div className="font-black text-[#2A211D] text-lg font-serif">{company.name}</div>
              <div className="text-[10px] font-mono text-[#7D6C60] font-bold">{company.type}</div>
            </div>
            <div className="ml-auto text-right font-mono">
              <div className="text-xs text-[#7D6C60]">TREASURY</div>
              <div className="text-lg font-black text-[#2A211D]">₹{company.cash.toLocaleString()}</div>
            </div>
          </div>

          {/* Investment Input */}
          {!invested && (
            <div className="bg-[#F7F0DF] border-2 border-[#2A211D] p-4">
              <div className="text-[10px] font-mono font-bold text-[#524339] mb-2">INVESTMENT AMOUNT (MON)</div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 border-2 border-[#2A211D] bg-[#EADCBF] px-3 py-2 font-mono font-bold text-lg text-[#2A211D] focus:outline-none"
                />
                <div className="flex gap-1">
                  {[50, 100, 500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setInvestmentAmount(amt)}
                      className="px-3 py-2 border-2 border-[#2A211D] bg-[#EADCBF] font-mono text-xs font-bold hover:bg-[#D5C29D] cursor-pointer shadow-[1px_1px_0px_#2A211D]"
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full mt-3 py-3 border-2 border-[#2A211D] bg-[#1B4965] text-[#F7F0DF] font-black text-sm uppercase tracking-widest shadow-[3px_3px_0px_#2A211D] hover:bg-[#153B52] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#2A211D] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? 'CALCULATING 1,000 FUTURES...' : 'RUN ARTHIK JODUA (SIMULATE) 🔮'}
              </button>
            </div>
          )}

          {/* Simulation Running Animation */}
          {isSimulating && (
            <div className="bg-[#EADCBF] border-2 border-[#2A211D] p-6 text-center">
              <div className="text-2xl mb-2 animate-pulse">🔮</div>
              <div className="font-mono font-bold text-[#2A211D] text-sm">
                PURANI DILLI ENGINE COMPUTING...
              </div>
              <div className="text-[10px] font-mono text-[#7D6C60] mt-1">
                Simulating 1,000 parallel market futures on the Arthik Jodua
              </div>
            </div>
          )}

          {/* Results */}
          {result && !invested && (
            <div className="space-y-4">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-[#F7F0DF] border-2 border-[#2A211D] p-3 text-center shadow-[2px_2px_0px_#2A211D]">
                  <div className="text-[9px] text-[#7D6C60] font-bold">MUNAFA CHANCE</div>
                  <div className={`text-2xl font-black ${result.profitProbability > 60 ? 'text-[#2D6A4F]' : 'text-[#A8201A]'}`}>
                    {result.profitProbability}%
                  </div>
                </div>
                <div className="bg-[#F7F0DF] border-2 border-[#2A211D] p-3 text-center shadow-[2px_2px_0px_#2A211D]">
                  <div className="text-[9px] text-[#7D6C60] font-bold">AVG RETURN</div>
                  <div className={`text-2xl font-black ${result.averageReturn > 0 ? 'text-[#2D6A4F]' : 'text-[#A8201A]'}`}>
                    {result.averageReturn > 0 ? '+' : ''}{result.averageReturn}%
                  </div>
                </div>
                <div className={`${riskColors[result.risk].bg} ${riskColors[result.risk].text} border-2 border-[#2A211D] p-3 text-center shadow-[2px_2px_0px_#2A211D]`}>
                  <div className="text-[9px] font-bold opacity-80">RISK LEVEL</div>
                  <div className="text-2xl font-black">{result.risk}</div>
                </div>
              </div>

              {/* Return Range */}
              <div className="bg-[#F7F0DF] border-2 border-[#2A211D] p-4 font-mono">
                <div className="text-[9px] text-[#7D6C60] font-bold mb-2">RETURN RANGE (1,000 SIMS)</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A8201A] font-bold">WORST: {result.worstCase}%</span>
                  <span className="text-[#7D6C60] font-bold">MEDIAN: {result.medianReturn}%</span>
                  <span className="text-[#2D6A4F] font-bold">BEST: +{result.bestCase}%</span>
                </div>

                {/* ASCII-style histogram */}
                <div className="mt-3 flex items-end gap-[2px] h-16">
                  {result.distribution.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#1B4965] border-t border-x border-[#2A211D] transition-all"
                      style={{ height: `${Math.max(2, height)}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-[#7D6C60] mt-1">
                  <span>-50%</span>
                  <span>0%</span>
                  <span>+80%</span>
                </div>
              </div>

              {/* Stress Scenarios */}
              <div className="bg-[#F7F0DF] border-2 border-[#2A211D] p-4 font-mono">
                <div className="text-[9px] text-[#7D6C60] font-bold mb-2">STRESS TESTS (PURANI DILLI SCENARIOS)</div>
                <div className="space-y-1.5">
                  {result.scenarios.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#EADCBF] border border-[#D5C29D] px-3 py-1.5">
                      <span className="text-[11px] font-bold text-[#2A211D]">{s.name}</span>
                      <span className={`text-xs font-black ${s.returnPct >= 0 ? 'text-[#2D6A4F]' : 'text-[#A8201A]'}`}>
                        {s.returnPct >= 0 ? '+' : ''}{s.returnPct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className={`${recColors[result.recommendation].bg} border-2 border-[#2A211D] p-4 text-[#F7F0DF] text-center shadow-[3px_3px_0px_#2A211D]`}>
                <div className="text-[9px] font-bold opacity-80 font-mono">ARTHIK JODUA RECOMMENDATION</div>
                <div className="text-xl font-black uppercase tracking-wider mt-1 font-serif">
                  {recColors[result.recommendation].text}
                </div>
                <div className="text-xs font-mono mt-1 opacity-80">Confidence: {result.confidence}%</div>
              </div>

              {/* Approve Investment Button */}
              {result.recommendation !== 'AVOID' && (
                <button
                  onClick={handleInvest}
                  disabled={isPending}
                  className="w-full py-4 border-2 border-[#2A211D] bg-[#2D6A4F] text-[#F7F0DF] font-black text-base uppercase tracking-widest shadow-[4px_4px_0px_#2A211D] hover:bg-[#23533E] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2A211D] transition-all cursor-pointer font-serif disabled:opacity-50"
                >
                  {isPending ? 'STAMPING TRANSACTION ON MONAD...' : `APPROVE & INVEST ${investmentAmount} MON ON MONAD 🚀`}
                </button>
              )}
            </div>
          )}

          {/* Investment Confirmed */}
          {invested && (
            <div className="bg-[#2D6A4F] border-2 border-[#2A211D] p-6 text-[#F7F0DF] text-center shadow-[4px_4px_0px_#2A211D]">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-black text-xl uppercase tracking-widest font-serif">
                INVESTMENT STAMPED ON MONAD!
              </div>
              <div className="font-mono text-sm mt-2 opacity-90">
                {investmentAmount} MON → {company.name}
              </div>
              <div className="font-mono text-[10px] mt-3 opacity-80 bg-[#140F0E]/30 p-2 border border-black/20 rounded">
                TX: {txHashStr || '0x4f82...monad'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
