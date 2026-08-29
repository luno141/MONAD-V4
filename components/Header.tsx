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
      <header className="px-6 py-3.5 border-b border-[#181926] bg-[#090A0F] shadow-lg relative select-none font-sans">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Brand Product Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md">
              🪐
            </div>
            <span className="text-base font-extrabold tracking-tight text-white font-sans">
              tiny.place
            </span>
          </div>

          {/* Controls & Wallet Bar */}
          <div className="flex items-center gap-3">
            {/* Economy Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3.5 py-1.5 bg-[#141622] hover:bg-[#1E2234] text-gray-300 border border-[#24283A] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📜</span> Guide
            </button>

            {/* Network Badge */}
            {isConnected ? (
              isCorrectNetwork ? (
                <div
                  onClick={() => setIsPassportOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-semibold cursor-pointer hover:bg-emerald-500/20 transition"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Monad Testnet</span>
                </div>
              ) : (
                <button
                  onClick={() => switchChain?.({ chainId: monadTestnet.id })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-semibold cursor-pointer hover:bg-red-500/20 transition"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>Switch Network</span>
                </button>
              )
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs text-gray-400">
                <span>🇬🇧</span>
              </div>
            )}

            {/* Wallet Passport / Connect Button */}
            {isConnected ? (
              <button
                onClick={() => setIsPassportOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-600/20 transition transform hover:scale-[1.02] active:scale-95"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            ) : (
              <button
                onClick={() => setIsPassportOpen(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-600/20 transition transform hover:scale-[1.02] active:scale-95"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MODALS */}
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
