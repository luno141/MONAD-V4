'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { BLACKOUT_COOLDOWN_SECONDS } from '@/lib/config/gameConstants';
import { MARKET_CONTRACT_ADDRESS, MARKET_ABI } from '@/lib/contracts/marketAbi';

export default function WorldEvent() {
  const [isActive, setIsActive] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [factoryEfficiency, setFactoryEfficiency] = useState(100);

  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleTriggerChakkaJam = () => {
    setStatusText(null);

    if (isConnected && MARKET_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      writeContract({
        address: MARKET_CONTRACT_ADDRESS,
        abi: MARKET_ABI,
        functionName: 'triggerChakkaJam',
      }, {
        onSuccess: (txHash) => {
          setIsActive(true);
          setFactoryEfficiency(20);
          setStatusText(`CHAKKA JAM CONFIRMED ON MONAD! TX: ${txHash.slice(0, 10)}...`);
        },
        onError: (err) => {
          setStatusText(`TRIGGER ERROR: ${err.message.slice(0, 50)}...`);
        }
      });
    } else {
      setIsActive(true);
      setFactoryEfficiency(20);
      setStatusText('CHAKKA JAM ACTIVATED! Katiya supply cut by 80%, price spiked!');
      setTimeout(() => {
        setIsActive(false);
        setFactoryEfficiency(100);
      }, 10000);
    }
  };

  return (
    <section id="world-event-panel" className="vintage-card p-5 border-2 border-[#A8201A] shadow-[4px_4px_0px_rgba(168,32,26,0.25)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#A8201A] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#A8201A] border border-[#2A211D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[#A8201A] font-serif">
            CHAKKA JAM / HARTAL (WORLD EVENT)
          </h2>
        </div>
        <span className="stamp-badge text-[9px] border-[#A8201A] text-[#A8201A] animate-pulse-glow">
          EMERGENCY LEVER
        </span>
      </div>

      {/* Babu Efficiency */}
      <div className="bg-[#EADCBF] border border-[#D5C29D] p-3 mb-4 font-mono">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#524339] font-bold">THEKA BABU WORK EFFICIENCY</span>
          <span className={`text-sm font-black tabular-nums ${
            factoryEfficiency >= 100 ? 'text-[#2D6A4F]' : 'text-[#A8201A]'
          }`}>
            {factoryEfficiency}%
          </span>
        </div>
        <div className="w-full h-3 bg-[#F7F0DF] border border-[#2A211D] overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              factoryEfficiency >= 100 ? 'bg-[#2D6A4F]' : 'bg-[#A8201A]'
            }`}
            style={{ width: `${factoryEfficiency}%` }}
          />
        </div>
      </div>

      {/* Chakka Jam Big Red Button */}
      <button
        id="blackout-btn"
        onClick={handleTriggerChakkaJam}
        disabled={isPending || isActive}
        className="group relative w-full py-4 border-2 border-[#2A211D] bg-[#A8201A] text-[#F7F0DF] font-black text-lg uppercase tracking-widest
          shadow-[4px_4px_0px_#2A211D] hover:bg-[#851915] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2A211D]
          transition-all cursor-pointer font-serif disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">{isPending ? '⏳' : isActive ? '🔥' : '🛑'}</span>
          <span>{isPending ? 'STAMPING ON MONAD...' : isActive ? 'CHAKKA JAM IN PROGRESS!' : 'ACTIVATE CHAKKA JAM!'}</span>
        </div>
      </button>

      {/* Status Alert */}
      {statusText && (
        <div className="mt-3 p-2 border border-[#A8201A] bg-[#FADBD8] text-[#A8201A] font-mono text-[10px] font-bold text-center">
          {statusText}
        </div>
      )}

      {/* Cooldown Info */}
      <div className="mt-3 flex items-center justify-center gap-2 font-mono">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#D96B27] animate-pulse-glow' : 'bg-[#2D6A4F]'}`} />
        <span className="text-[11px] font-bold text-[#524339]">
          {isActive ? `CHAKKA JAM ACTIVE — COOLDOWN: ${BLACKOUT_COOLDOWN_SECONDS}s` : 'READY TO PROTEST'}
        </span>
      </div>
    </section>
  );
}
