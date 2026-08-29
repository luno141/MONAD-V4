'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { monadTestnet } from '@/lib/config/monadChain';
import WalletPassportModal from './WalletPassportModal';

export default function Header() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCorrectNetwork = isConnected && chainId === monadTestnet.id;

  return (
    <>
      <header className="px-6 py-4 border-b-4 border-[#2A211D] bg-[#F7F0DF] shadow-md relative">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Newspaper / Gazette Header Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#D96B27] border-2 border-[#2A211D] flex items-center justify-center font-bold text-2xl text-[#F7F0DF] shadow-[2px_2px_0px_#2A211D]">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-wider uppercase text-[#2A211D] font-serif">
                  PURANI DILLI <span className="text-[#B23B23]">GAZETTE</span>
                </h1>
                <span className="stamp-badge border-[#B23B23] text-[#B23B23] text-[10px] hidden sm:inline-block">
                  EST. 1974
                </span>
              </div>
              <p className="text-xs text-[#524339] font-mono tracking-wide">
                Official Monad Stage Showcase — <span className="underline italic">Chakka Jam Economics</span>
              </p>
            </div>
          </div>

          {/* Right side: Stamps for Network + Wallet */}
          <div className="flex items-center gap-3">
            {/* Network Status Stamp */}
            {isConnected ? (
              isCorrectNetwork ? (
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#2D6A4F] bg-[#E2F0D9] text-[#2D6A4F] font-mono text-xs font-bold shadow-[2px_2px_0px_#2D6A4F] cursor-pointer hover:bg-[#D5E8CA]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse-glow" />
                  <span>MONAD TESTNET</span>
                </div>
              ) : (
                <button
                  onClick={() => switchChain?.({ chainId: monadTestnet.id })}
                  className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#A8201A] bg-[#FADBD8] text-[#A8201A] font-mono text-xs font-bold shadow-[2px_2px_0px_#A8201A] cursor-pointer hover:bg-[#F5B7B1]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#A8201A] animate-pulse-glow" />
                  <span>WRONG NETWORK (SWITCH)</span>
                </button>
              )
            ) : (
              <div
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#7D6C60] bg-[#EADCBF] text-[#524339] font-mono text-xs font-bold cursor-pointer hover:bg-[#D5C29D]"
              >
                <div className="w-2 h-2 rounded-full bg-[#7D6C60]" />
                <span>OFFLINE (NO STAMP)</span>
              </div>
            )}

            {/* Wallet Connection / Passport Button */}
            {isConnected ? (
              <button
                id="passport-modal-btn"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 border-2 border-[#2A211D] bg-[#EADCBF] text-[#2A211D] font-mono text-xs font-bold 
                  shadow-[3px_3px_0px_#2A211D] hover:bg-[#D5C29D] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#2A211D] transition-all cursor-pointer"
              >
                PASSPORT: {address?.slice(0, 6)}...{address?.slice(-4)} 📜
              </button>
            ) : (
              <button
                id="connect-passport-btn"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 border-2 border-[#2A211D] bg-[#D96B27] text-[#F7F0DF] font-mono text-xs font-bold uppercase tracking-wider
                  shadow-[3px_3px_0px_#2A211D] hover:bg-[#C05A1C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#2A211D] transition-all cursor-pointer"
              >
                CONNECT PASSPORT 📜
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Passport Identity Modal */}
      <WalletPassportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
