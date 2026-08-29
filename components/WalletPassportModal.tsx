'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { monadTestnet } from '@/lib/config/monadChain';

interface WalletPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletPassportModal({ isOpen, onClose }: WalletPassportModalProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });

  const [agentHandle, setAgentHandle] = useState('@NetaJi_Dilli');
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'passport' | 'faucet'>('passport');

  const isCorrectNetwork = isConnected && chainId === monadTestnet.id;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#140F0E]/80 backdrop-blur-xs" />

      {/* Modal Card — Purani Dilli Gazette Identity Card */}
      <div
        className="relative w-full max-w-lg vintage-card p-0 overflow-hidden shadow-[8px_8px_0px_#140F0E] animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#2A211D] text-[#F7F0DF] px-6 py-4 flex items-center justify-between border-b-4 border-[#D96B27]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D96B27] border-2 border-[#F7F0DF] flex items-center justify-center text-xl shadow-[2px_2px_0px_#140F0E]">
              📜
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest font-serif text-[#F7F0DF]">
                SARKARI IDENTITY PASSPORT
              </h2>
              <p className="text-[10px] font-mono text-[#D5C29D]">
                Tiny.place-style Agent & Human Identity Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-[#D96B27] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('passport')}
              className={`py-2 px-3 border-2 font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_#2A211D] ${
                activeTab === 'passport'
                  ? 'bg-[#D96B27] text-[#F7F0DF] border-[#2A211D]'
                  : 'bg-[#EADCBF] text-[#2A211D] border-[#2A211D] hover:bg-[#D5C29D]'
              }`}
            >
              ID Passport
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`py-2 px-3 border-2 font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_#2A211D] ${
                activeTab === 'connect'
                  ? 'bg-[#1B4965] text-[#F7F0DF] border-[#2A211D]'
                  : 'bg-[#EADCBF] text-[#2A211D] border-[#2A211D] hover:bg-[#D5C29D]'
              }`}
            >
              Wallets
            </button>
            <button
              onClick={() => setActiveTab('faucet')}
              className={`py-2 px-3 border-2 font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_#2A211D] ${
                activeTab === 'faucet'
                  ? 'bg-[#2D6A4F] text-[#F7F0DF] border-[#2A211D]'
                  : 'bg-[#EADCBF] text-[#2A211D] border-[#2A211D] hover:bg-[#D5C29D]'
              }`}
            >
              MON Faucet
            </button>
          </div>

          {/* TAB 1: ID PASSPORT (Tiny.place style) */}
          {activeTab === 'passport' && (
            <div className="space-y-4 font-mono">
              {/* Agent Identity Card Stamp */}
              <div className="bg-[#F7F0DF] border-4 border-[#2A211D] p-4 relative shadow-[4px_4px_0px_#2A211D]">
                <div className="absolute top-3 right-3">
                  {isConnected ? (
                    <span className="stamp-badge border-[#2D6A4F] text-[#2D6A4F] text-[10px] bg-[#E2F0D9]">
                      VERIFIED PASSPORT
                    </span>
                  ) : (
                    <span className="stamp-badge border-[#A8201A] text-[#A8201A] text-[10px] bg-[#FADBD8]">
                      UNSTAMPED
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-bold text-[#7D6C60] mb-1">REGISTERED HANDLE</div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={agentHandle}
                    onChange={(e) => setAgentHandle(e.target.value)}
                    placeholder="@your-handle"
                    className="border-2 border-[#2A211D] bg-[#EADCBF] px-3 py-1.5 font-bold text-sm text-[#2A211D] focus:outline-none flex-1"
                  />
                  <button
                    onClick={() => setIsRegistered(true)}
                    className="px-3 py-1.5 bg-[#2D6A4F] text-[#F7F0DF] border-2 border-[#2A211D] text-xs font-bold shadow-[2px_2px_0px_#2A211D] hover:bg-[#23533E] transition-all cursor-pointer"
                  >
                    {isRegistered ? 'CLAIMED ✓' : 'CLAIM @'}
                  </button>
                </div>

                {/* Public Key / Address */}
                <div className="text-[10px] font-bold text-[#7D6C60] mb-1">PUBLIC ADDRESS / KEY</div>
                <div className="bg-[#EADCBF] border-2 border-[#2A211D] p-2 text-xs font-bold text-[#2A211D] break-all flex items-center justify-between">
                  <span>{address || '0x (Connect Wallet below)'}</span>
                  {address && (
                    <button
                      onClick={() => navigator.clipboard.writeText(address)}
                      className="ml-2 text-[10px] bg-[#2A211D] text-[#F7F0DF] px-2 py-0.5 rounded hover:bg-[#D96B27] cursor-pointer"
                    >
                      COPY
                    </button>
                  )}
                </div>

                {/* Balance & Network State */}
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t-2 border-[#D5C29D]">
                  <div>
                    <div className="text-[9px] text-[#7D6C60] font-bold">MONAD BALANCE</div>
                    <div className="text-lg font-black text-[#2D6A4F]">
                      {balanceData ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}` : '0.00 MON'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#7D6C60] font-bold">NETWORK STATE</div>
                    <div className="text-xs font-bold text-[#2A211D]">
                      {isConnected ? (isCorrectNetwork ? '🟢 MONAD TESTNET' : '🔴 WRONG NET') : '⚪ DISCONNECTED'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONNECT WALLET OPTIONS */}
          {activeTab === 'connect' && (
            <div className="space-y-3 font-mono">
              <div className="text-xs text-[#524339] font-bold mb-2">CHOOSE WALLET CONNECTOR:</div>

              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                  className="w-full p-3 border-2 border-[#2A211D] bg-[#F7F0DF] text-[#2A211D] font-bold text-sm flex items-center justify-between shadow-[3px_3px_0px_#2A211D] hover:bg-[#EADCBF] transition-all cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🦊</span>
                    <span>{connector.name}</span>
                  </div>
                  <span className="text-xs text-[#D96B27] font-bold">CONNECT ➔</span>
                </button>
              ))}

              {isConnected && (
                <div className="pt-3 border-t-2 border-[#D5C29D]">
                  <button
                    onClick={() => disconnect()}
                    className="w-full py-2 border-2 border-[#A8201A] bg-[#FADBD8] text-[#A8201A] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#A8201A] hover:bg-[#F5B7B1] transition-all cursor-pointer"
                  >
                    DISCONNECT WALLET PASSPORT ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAUCET & FUNDING */}
          {activeTab === 'faucet' && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#EADCBF] border-2 border-[#2A211D] p-4 shadow-[2px_2px_0px_#2A211D]">
                <div className="font-bold text-sm text-[#2A211D] mb-1">MONAD TESTNET FAUCET 💧</div>
                <p className="text-xs text-[#524339] mb-3">
                  Get free testnet MON tokens to trade resources, build thekas, and invest in autonomous company treasuries.
                </p>

                <a
                  href="https://faucet.monad.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 text-center border-2 border-[#2A211D] bg-[#2D6A4F] text-[#F7F0DF] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#2A211D] hover:bg-[#23533E] transition-all"
                >
                  OPEN MONAD OFFICIAL FAUCET ↗
                </a>
              </div>

              {!isCorrectNetwork && isConnected && (
                <button
                  onClick={() => switchChain?.({ chainId: monadTestnet.id })}
                  className="w-full py-3 border-2 border-[#A8201A] bg-[#A8201A] text-[#F7F0DF] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#2A211D] hover:bg-[#851915] transition-all cursor-pointer"
                >
                  SWITCH WALLET TO MONAD TESTNET (CHAIN ID 10143)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
