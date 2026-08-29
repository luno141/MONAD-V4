'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { RESOURCES, FACTORY_COST } from '@/lib/config/gameConstants';
import { MARKET_CONTRACT_ADDRESS, MARKET_ABI } from '@/lib/contracts/marketAbi';

type ActionMode = 'buy' | 'sell' | 'factory' | null;

export default function ActionsPanel() {
  const [mode, setMode] = useState<ActionMode>('buy');
  const [selectedResource, setSelectedResource] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleExecuteOrder = () => {
    setStatusMessage(null);

    if (mode === 'factory') {
      if (isConnected && MARKET_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        writeContract({
          address: MARKET_CONTRACT_ADDRESS,
          abi: MARKET_ABI,
          functionName: 'buildTheka',
          value: parseEther('0.05'),
        }, {
          onSuccess: (txHash) => {
            setStatusMessage(`THEKA STAMPED ON MONAD! TX: ${txHash.slice(0, 10)}...`);
          },
          onError: (err) => {
            setStatusMessage(`STAMPING ERROR: ${err.message.slice(0, 50)}...`);
          }
        });
      } else {
        setStatusMessage('SIMULATED: Theka Bribe Approved! +1 Desi Theka');
      }
      return;
    }

    if (mode === 'buy') {
      if (isConnected && MARKET_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        writeContract({
          address: MARKET_CONTRACT_ADDRESS,
          abi: MARKET_ABI,
          functionName: 'buyResource',
          args: [selectedResource, BigInt(quantity)],
          value: parseEther((0.01 * quantity).toString()),
        }, {
          onSuccess: (txHash) => {
            setStatusMessage(`KHARIDO ORDER SUBMITTED TO MONAD! TX: ${txHash.slice(0, 10)}...`);
          },
          onError: (err) => {
            setStatusMessage(`ORDER FAILED: ${err.message.slice(0, 50)}...`);
          }
        });
      } else {
        setStatusMessage(`SIMULATED: Kharido Order Placed for ${quantity}x item!`);
      }
    } else if (mode === 'sell') {
      if (isConnected && MARKET_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        writeContract({
          address: MARKET_CONTRACT_ADDRESS,
          abi: MARKET_ABI,
          functionName: 'sellResource',
          args: [selectedResource, BigInt(quantity)],
        }, {
          onSuccess: (txHash) => {
            setStatusMessage(`BECHO ORDER SUBMITTED TO MONAD! TX: ${txHash.slice(0, 10)}...`);
          },
          onError: (err) => {
            setStatusMessage(`ORDER FAILED: ${err.message.slice(0, 50)}...`);
          }
        });
      } else {
        setStatusMessage(`SIMULATED: Becho Order Executed for ${quantity}x item!`);
      }
    }
  };

  return (
    <section id="actions-panel" className="vintage-card p-5">
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#D5C29D] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#2D6A4F] border border-[#2A211D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2A211D] font-serif">
            SARKARI COUNTER (DEALINGS)
          </h2>
        </div>
        <span className="stamp-badge text-[9px] border-[#2D6A4F] text-[#2D6A4F]">
          OFFICIAL WINDOW
        </span>
      </div>

      {/* Action Mode Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4 font-mono">
        <button
          id="action-buy-btn"
          onClick={() => setMode('buy')}
          className={`py-2 px-2 text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer shadow-[2px_2px_0px_#2A211D]
            ${mode === 'buy'
              ? 'bg-[#2D6A4F] text-[#F7F0DF] border-[#2A211D]'
              : 'bg-[#EADCBF] text-[#2A211D] border-[#2A211D] hover:bg-[#D5C29D]'
            }`}
        >
          Kharido (Buy)
        </button>
        <button
          id="action-sell-btn"
          onClick={() => setMode('sell')}
          className={`py-2 px-2 text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer shadow-[2px_2px_0px_#2A211D]
            ${mode === 'sell'
              ? 'bg-[#A8201A] text-[#F7F0DF] border-[#2A211D]'
              : 'bg-[#EADCBF] text-[#2A211D] border-[#2A211D] hover:bg-[#D5C29D]'
            }`}
        >
          Becho (Sell)
        </button>
        <button
          id="action-factory-btn"
          onClick={() => setMode('factory')}
          className={`py-2 px-2 text-xs font-bold uppercase tracking-wider border-2 border-[#2A211D] transition-all cursor-pointer shadow-[2px_2px_0px_#2A211D]
            ${mode === 'factory'
              ? 'bg-[#D96B27] text-[#F7F0DF]'
              : 'bg-[#EADCBF] text-[#2A211D] hover:bg-[#D5C29D]'
            }`}
        >
          Theka Bribe
        </button>
      </div>

      {/* Resource Selector for Buy / Sell */}
      {(mode === 'buy' || mode === 'sell') && (
        <div className="space-y-3 mb-4 font-mono">
          <div className="text-[10px] text-[#524339] font-bold">CHOOSE ITEM:</div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(RESOURCES) as Array<keyof typeof RESOURCES>).map((key) => {
              const res = RESOURCES[key];
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedResource(res.id)}
                  className={`py-2 px-1 text-[11px] font-bold border-2 transition-all cursor-pointer
                    ${selectedResource === res.id
                      ? 'bg-[#1B4965] text-[#F7F0DF] border-[#2A211D] shadow-[2px_2px_0px_#2A211D]'
                      : 'bg-[#F7F0DF] text-[#2A211D] border-[#D5C29D] hover:bg-[#EADCBF]'
                    }`}
                >
                  {res.symbol} {res.name}
                </button>
              );
            })}
          </div>

          {/* Quantity selector */}
          <div>
            <div className="text-[10px] text-[#524339] font-bold mb-1">QUANTITY (UNITS):</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#F7F0DF] border-2 border-[#2A211D] px-3 py-1.5 text-sm font-bold text-[#2A211D]
                  focus:outline-none focus:bg-[#EADCBF]"
              />
              <div className="flex gap-1">
                {[1, 5, 10].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className="px-2.5 py-1.5 border-2 border-[#2A211D] text-xs font-bold bg-[#EADCBF] hover:bg-[#D5C29D] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Factory / Theka Mode Info */}
      {mode === 'factory' && (
        <div className="bg-[#F7F0DF] border-2 border-[#2A211D] p-3 mb-4 font-mono">
          <div className="text-xs font-bold text-[#2A211D]">DESI THEKA CONSTRUCTION PERMIT</div>
          <div className="text-[10px] text-[#7D6C60] mt-1">
            Builds 1 additional resource production unit. Generates passive Kala Dhan & Files every block.
          </div>
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={handleExecuteOrder}
        disabled={isPending}
        className={`w-full py-3 border-2 border-[#2A211D] font-bold text-sm uppercase tracking-wider shadow-[3px_3px_0px_#2A211D] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#2A211D] disabled:opacity-50
          ${mode === 'buy'
            ? 'bg-[#2D6A4F] text-[#F7F0DF] hover:bg-[#23533E]'
            : mode === 'sell'
            ? 'bg-[#A8201A] text-[#F7F0DF] hover:bg-[#851915]'
            : 'bg-[#D96B27] text-[#F7F0DF] hover:bg-[#C05A1C]'
          }`}
      >
        {isPending ? 'STAMPING ON MONAD...' : mode === 'buy' ? 'SUBMIT KHARIDO ORDER 📝' : mode === 'sell' ? 'SUBMIT BECHO ORDER 💵' : 'PAY THEKA BRIBE (0.05 MON) 🏗️'}
      </button>

      {/* Status Message */}
      {statusMessage && (
        <div className="mt-3 p-2 border border-[#2A211D] bg-[#E2F0D9] text-[#2D6A4F] font-mono text-[10px] font-bold">
          {statusMessage}
        </div>
      )}

      {/* Theka Bribe Cost Breakdown */}
      <div className="border-t-2 border-[#D5C29D] pt-3 mt-3 font-mono">
        <div className="text-[10px] text-[#524339] font-bold mb-2">NEW THEKA BRIBE REQUIRED:</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#F7F0DF] border border-[#D5C29D] p-1.5">
            <div className="font-bold text-[#A8201A]">₹{FACTORY_COST.credits}</div>
            <div className="text-[9px] text-[#7D6C60]">KALA DHAN</div>
          </div>
          <div className="bg-[#F7F0DF] border border-[#D5C29D] p-1.5">
            <div className="font-bold text-[#1B4965]">{FACTORY_COST.steel}</div>
            <div className="text-[9px] text-[#7D6C60]">FILES</div>
          </div>
          <div className="bg-[#F7F0DF] border border-[#D5C29D] p-1.5">
            <div className="font-bold text-[#D96B27]">{FACTORY_COST.energy}</div>
            <div className="text-[9px] text-[#7D6C60]">KATIYA</div>
          </div>
        </div>
      </div>
    </section>
  );
}
