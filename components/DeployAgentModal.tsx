'use client';

import React, { useState } from 'react';
import {
  DistrictId,
  AgentJobType,
  CommodityType,
  AgentContract,
  Agent,
} from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

interface DeployAgentModalProps {
  isOpen: boolean;
  defaultDistrict?: DistrictId;
  playerBalance: number;
  onClose: () => void;
  onDeploy: (newAgent: Omit<Agent, 'id' | 'createdAt' | 'lastActionTime'>) => void;
}

const AVATARS: Record<AgentJobType, string[]> = {
  TRADER: ['👳🏽‍♂️', '🧔🏽‍♂️', '👨🏽‍💼'],
  COURIER: ['🛵', '🛺', '🚚'],
  SHOPKEEPER: ['🏪', '🏬', '👨🏽‍🍳'],
  BROKER: ['🤝', '💼', '📊'],
};

export default function DeployAgentModal({
  isOpen,
  defaultDistrict = 'khari_baoli',
  playerBalance,
  onClose,
  onDeploy,
}: DeployAgentModalProps) {
  const [name, setName] = useState('Salim the Mandi Agent');
  const [jobType, setJobType] = useState<AgentJobType>('TRADER');
  const [district, setDistrict] = useState<DistrictId>(defaultDistrict);
  const [commodity, setCommodity] = useState<CommodityType>('spices');
  const [buyBelow, setBuyBelow] = useState(11);
  const [sellAbove, setSellAbove] = useState(16);
  const [capital, setCapital] = useState(150);

  if (!isOpen) return null;

  const deploymentFee = 50;
  const totalRequired = deploymentFee + capital;
  const canAfford = playerBalance >= totalRequired;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) return;

    const contract: AgentContract = {
      targetCommodity: commodity,
      buyBelow,
      sellAbove,
      maxCapital: capital * 2,
      minAcceptableProfit: 4,
      sourceDistrict: district,
      targetDistrict: district === 'khari_baoli' ? 'chandni_chowk' : 'jama_masjid',
      durationHours: 24,
    };

    const avatar = AVATARS[jobType][Math.floor(Math.random() * AVATARS[jobType].length)];

    onDeploy({
      ownerPlayerId: 'player-1',
      name,
      avatar,
      jobType,
      level: 1,
      experience: 0,
      location: district,
      status: 'WORKING',
      efficiency: 80,
      operatingCost: 1.5,
      deploymentCost: deploymentFee,
      availableCapital: capital,
      currentTask: `Initialized ${jobType} in ${DISTRICTS[district].name}`,
      contract,
      inventory: {},
      grossEarnings: 0,
      totalExpenses: 0,
      netProfit: 0,
      speechBubble: `Deployed in ${DISTRICTS[district].name}! Ready for trade 🚀`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="relative w-full max-w-lg rounded-xl border-4 border-[#2A211D] bg-[#1A1412] p-5 shadow-2xl space-y-4 text-[#D4C4B5]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3D3029] pb-3">
          <h3 className="text-lg font-black text-[#F3E5AB] flex items-center gap-2">
            <span>🤖</span> DEPLOY WORKFORCE AGENT
          </h3>
          <button
            onClick={onClose}
            className="text-xl text-[#A89F91] hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Agent Name */}
          <div>
            <label className="block text-[11px] text-[#A89F91] font-bold mb-1">
              AGENT NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#120D0B] border border-[#4A3B32] rounded text-[#F3E5AB] focus:border-[#D97706] focus:outline-none"
              required
            />
          </div>

          {/* Job Selection */}
          <div>
            <label className="block text-[11px] text-[#A89F91] font-bold mb-1">
              SELECT JOB ROLE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['TRADER', 'COURIER', 'SHOPKEEPER', 'BROKER'] as AgentJobType[]).map((job) => (
                <button
                  type="button"
                  key={job}
                  onClick={() => setJobType(job)}
                  className={`p-2 rounded border text-left flex items-center gap-2 ${
                    jobType === job
                      ? 'border-[#F59E0B] bg-[#2E211A] text-[#F59E0B] font-bold'
                      : 'border-[#3D3029] bg-[#120D0B] hover:border-[#D97706]'
                  }`}
                >
                  <span className="text-base">{AVATARS[job][0]}</span>
                  <span>{job}</span>
                </button>
              ))}
            </div>
          </div>

          {/* District & Commodity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#A89F91] font-bold mb-1">
                ASSIGNED DISTRICT
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value as DistrictId)}
                className="w-full px-3 py-2 bg-[#120D0B] border border-[#4A3B32] rounded text-[#F3E5AB] focus:border-[#D97706] focus:outline-none"
              >
                {(Object.keys(DISTRICTS) as DistrictId[]).map((dId) => (
                  <option key={dId} value={dId}>
                    {DISTRICTS[dId].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A89F91] font-bold mb-1">
                TARGET COMMODITY
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value as CommodityType)}
                className="w-full px-3 py-2 bg-[#120D0B] border border-[#4A3B32] rounded text-[#F3E5AB] focus:border-[#D97706] focus:outline-none"
              >
                <option value="spices">🌶️ Spices</option>
                <option value="grain">🌾 Grain</option>
                <option value="textiles">🧵 Textiles</option>
                <option value="food">🍛 Food</option>
                <option value="fuel">⛽ Fuel</option>
                <option value="labor">🛠️ Labor</option>
              </select>
            </div>
          </div>

          {/* Rule Bounds */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#120D0B] rounded border border-[#3D3029]">
            <div>
              <label className="block text-[10px] text-[#A89F91] font-bold mb-1">
                BUY BELOW (MON)
              </label>
              <input
                type="number"
                value={buyBelow}
                onChange={(e) => setBuyBelow(Number(e.target.value))}
                className="w-full px-2 py-1 bg-[#1E1714] border border-[#4A3B32] rounded text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#A89F91] font-bold mb-1">
                SELL ABOVE (MON)
              </label>
              <input
                type="number"
                value={sellAbove}
                onChange={(e) => setSellAbove(Number(e.target.value))}
                className="w-full px-2 py-1 bg-[#1E1714] border border-[#4A3B32] rounded text-amber-400 font-bold"
              />
            </div>
          </div>

          {/* Capital Allocation */}
          <div>
            <label className="block text-[11px] text-[#A89F91] font-bold mb-1">
              INITIAL MON CAPITAL ALLOCATION: {capital} MON
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full accent-[#D97706]"
            />
          </div>

          {/* Summary & Cost Breakdown */}
          <div className="p-3 rounded bg-[#261E1A] border border-[#4A3B32] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span>Deployment Fee:</span>
              <span className="text-amber-500 font-bold">{deploymentFee} MON</span>
            </div>
            <div className="flex justify-between">
              <span>Working Capital:</span>
              <span className="text-emerald-400 font-bold">{capital} MON</span>
            </div>
            <div className="flex justify-between border-t border-[#3D3029] pt-1 text-sm font-black">
              <span>Total Required:</span>
              <span className={canAfford ? 'text-emerald-400' : 'text-red-400'}>
                {totalRequired} MON (Bal: {playerBalance} MON)
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canAfford}
            className={`w-full py-2.5 rounded-lg font-mono font-black text-xs shadow-xl transition ${
              canAfford
                ? 'bg-[#D97706] hover:bg-[#F59E0B] text-black hover:scale-[1.02]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'CONFIRM AGENT DEPLOYMENT' : 'INSUFFICIENT PLAYER MON BALANCE'}
          </button>
        </form>
      </div>
    </div>
  );
}
