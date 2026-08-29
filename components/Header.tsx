'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { monadTestnet } from '@/lib/config/monadChain';
import WalletPassportModal from './WalletPassportModal';
import EconomyExplainerModal from './EconomyExplainerModal';

export default function Header() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const isCorrectNetwork = isConnected && chainId === monadTestnet.id;

  return (
    <>
      <header className="px-6 py-3.5 border-b-4 border-[#2A211D] bg-[#16110F] shadow-2xl relative select-none font-mono">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Production Product Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#D97706] rounded-xl border-2 border-[#2A211D] flex items-center justify-center font-black text-2xl text-black shadow-lg">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-wider text-[#F3E5AB]">
                  DELHI<span className="text-[#D97706]">GAZETTE</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]">
                  AUTONOMOUS WORKFORCE
                </span>
              </div>
              <p className="text-[11px] text-[#A89F91]">
                Purani Dilli Mandi Engine — Monad Testnet (ChainId 10143)
              </p>
            </div>
          </div>

          {/* Controls & Wallet Bar */}
          <div className="flex items-center gap-3">
            {/* Economy Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3 py-1.5 bg-[#261E1A] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#4A3B32] rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <span>📜</span> ECONOMY GUIDE
            </button>

            {/* Network Badge */}
            {isConnected ? (
              isCorrectNetwork ? (
                <div
                  onClick={() => setIsPassportOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs font-bold cursor-pointer hover:bg-emerald-500/20 shadow"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MONAD TESTNET</span>
                </div>
              ) : (
                <button
                  onClick={() => switchChain?.({ chainId: monadTestnet.id })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-bold cursor-pointer hover:bg-red-500/20 shadow"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>SWITCH NETWORK</span>
                </button>
              )
            ) : (
              <div
                onClick={() => setIsPassportOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#4A3B32] bg-[#1E1714] text-[#A89F91] text-xs font-bold cursor-pointer hover:bg-[#2A1F19]"
              >
                <div className="w-2 h-2 rounded-full bg-[#A89F91]" />
                <span>OFFLINE</span>
              </div>
            )}

            {/* Wallet Passport Button */}
            {isConnected ? (
              <button
                onClick={() => setIsPassportOpen(true)}
                className="px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs rounded-lg shadow-xl transition transform hover:scale-105"
              >
                WALLETS: {address?.slice(0, 6)}...{address?.slice(-4)} 💳
              </button>
            ) : (
              <button
                onClick={() => setIsPassportOpen(true)}
                className="px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs rounded-lg shadow-xl transition transform hover:scale-105"
              >
                CONNECT WALLET 💳
              </button>
            )}
          </div>
        </div>
      </header>

      <WalletPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />

      <EconomyExplainerModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
}
