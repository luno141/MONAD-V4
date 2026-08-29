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

  const walletIcons: Record<string, string> = {
    MetaMask: '🦊',
    'Coinbase Wallet': '🔵',
    Phantom: '👻',
    WalletConnect: '🔗',
    Injected: '⚡',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-none animate-fade-in" onClick={onClose}>
      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg rounded-2xl border-4 border-[#2A211D] bg-[#16110F] p-0 overflow-hidden shadow-2xl space-y-0 text-[#D4C4B5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#1E1714] text-[#F3E5AB] px-6 py-4 flex items-center justify-between border-b-2 border-[#3D3029]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-xl text-[#F59E0B] shadow">
              💳
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide text-[#F3E5AB]">
                WEB3 WALLET & IDENTITY PASSPORT
              </h2>
              <p className="text-[11px] text-[#A89F91]">
                Monad Testnet • ChainId 10143
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#A89F91] hover:text-white font-bold text-base flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('passport')}
              className={`py-2 px-3 rounded-xl border font-bold transition-all ${
                activeTab === 'passport'
                  ? 'bg-[#2A1F19] text-[#F3E5AB] border-[#D97706] shadow'
                  : 'bg-[#100C0A] text-[#A89F91] border-[#2D231D] hover:text-white'
              }`}
            >
              ID PASSPORT
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`py-2 px-3 rounded-xl border font-bold transition-all ${
                activeTab === 'connect'
                  ? 'bg-[#2A1F19] text-[#F3E5AB] border-[#D97706] shadow'
                  : 'bg-[#100C0A] text-[#A89F91] border-[#2D231D] hover:text-white'
              }`}
            >
              WALLETS
            </button>
            <button
              onClick={() => setActiveTab('faucet')}
              className={`py-2 px-3 rounded-xl border font-bold transition-all ${
                activeTab === 'faucet'
                  ? 'bg-[#2A1F19] text-[#F3E5AB] border-[#D97706] shadow'
                  : 'bg-[#100C0A] text-[#A89F91] border-[#2D231D] hover:text-white'
              }`}
            >
              MON FAUCET 💧
            </button>
          </div>

          {/* TAB 1: ID PASSPORT */}
          {activeTab === 'passport' && (
            <div className="space-y-4">
              <div className="bg-[#100C0A] border border-[#3D3029] rounded-xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#A89F91]">AGENT HANDLE</span>
                  {isConnected ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500">
                      VERIFIED PASSPORT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500">
                      UNSTAMPED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={agentHandle}
                    onChange={(e) => setAgentHandle(e.target.value)}
                    placeholder="@your-handle"
                    className="flex-1 bg-[#1A1412] border border-[#3D3029] rounded-lg px-3 py-2 text-xs font-bold text-[#F3E5AB] focus:border-[#D97706] focus:outline-none"
                  />
                  <button
                    onClick={() => setIsRegistered(true)}
                    className="px-3 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs rounded-lg transition"
                  >
                    {isRegistered ? 'CLAIMED ✓' : 'CLAIM @'}
                  </button>
                </div>

                {/* Public Key / Address */}
                <div>
                  <div className="text-[10px] font-bold text-[#A89F91] mb-1">PUBLIC ADDRESS</div>
                  <div className="bg-[#1A1412] border border-[#3D3029] rounded-lg p-2.5 text-xs text-[#F3E5AB] font-bold break-all flex items-center justify-between">
                    <span>{address || '0x (Connect Wallet in Wallets tab)'}</span>
                    {address && (
                      <button
                        onClick={() => navigator.clipboard.writeText(address)}
                        className="ml-2 text-[10px] bg-[#261E1A] text-[#F3E5AB] px-2 py-1 rounded border border-[#4A3B32] hover:bg-[#3D3029]"
                      >
                        COPY
                      </button>
                    )}
                  </div>
                </div>

                {/* Balance & Network State */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2D231D]">
                  <div>
                    <div className="text-[10px] text-[#A89F91]">MONAD BALANCE</div>
                    <div className="text-base font-black text-emerald-400">
                      {balanceData ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}` : '0.00 MON'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#A89F91]">NETWORK</div>
                    <div className="text-xs font-bold text-[#F3E5AB]">
                      {isConnected ? (isCorrectNetwork ? '🟢 MONAD TESTNET' : '🔴 WRONG NET') : '⚪ DISCONNECTED'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONNECT WALLET OPTIONS */}
          {activeTab === 'connect' && (
            <div className="space-y-3">
              <div className="text-xs text-[#A89F91] font-bold mb-2">CHOOSE WALLET CONNECTOR:</div>

              {connectors.length > 0 ? (
                connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className="w-full p-3.5 rounded-xl border border-[#3D3029] bg-[#100C0A] hover:bg-[#1C1410] text-[#F3E5AB] font-bold text-xs flex items-center justify-between shadow transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{walletIcons[connector.name] || '💳'}</span>
                      <span>{connector.name}</span>
                    </div>
                    <span className="text-[11px] text-[#D97706] font-bold">CONNECT ➔</span>
                  </button>
                ))
              ) : (
                <div className="p-4 bg-[#100C0A] rounded-xl text-xs text-[#A89F91] text-center border border-[#3D3029]">
                  Browser wallet extensions (MetaMask, Coinbase Wallet, etc.) ready. Click to initialize.
                </div>
              )}

              {isConnected && (
                <div className="pt-3 border-t border-[#2D231D]">
                  <button
                    onClick={() => disconnect()}
                    className="w-full py-2.5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-wider hover:bg-red-500/20 transition"
                  >
                    DISCONNECT WALLET PASSPORT ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAUCET & NETWORK SWITCH */}
          {activeTab === 'faucet' && (
            <div className="space-y-4">
              <div className="bg-[#100C0A] border border-[#3D3029] rounded-xl p-4 space-y-3 shadow-inner">
                <div className="font-bold text-xs text-[#F3E5AB] flex items-center gap-2">
                  <span>💧</span> MONAD TESTNET FAUCET
                </div>
                <p className="text-xs text-[#A89F91]">
                  Obtain free testnet MON tokens to fund autonomous agent micro-payloads and deploy mandi workforce contracts.
                </p>

                <a
                  href="https://faucet.monad.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 text-center rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs uppercase tracking-wider shadow transition"
                >
                  OPEN MONAD OFFICIAL FAUCET ↗
                </a>
              </div>

              {!isCorrectNetwork && isConnected && (
                <button
                  onClick={() => switchChain?.({ chainId: monadTestnet.id })}
                  className="w-full py-3 rounded-xl border border-red-500/50 bg-red-500/20 text-red-300 font-bold text-xs uppercase tracking-wider hover:bg-red-500/30 transition"
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
