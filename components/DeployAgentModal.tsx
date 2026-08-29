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
  COURIER: ['🛺', '🛵', '🚚'],
  SHOPKEEPER: ['🏪', '🏬', '👨🏽‍🍳'],
  BROKER: ['🤝', '💼', '📊'],
  CHAIWALA: ['☕', '🍵', '🥪'],
  CRAFTSMAN: ['🧵', '🪡', '🎨'],
  HAMMAL: ['💪', '📦', '🪜'],
};

const CIVILIAN_TITLES: Record<AgentJobType, string> = {
  TRADER: 'Mandi Spice Wholesaler',
  COURIER: 'Cycle Rickshaw Cargo Freight Hauler',
  SHOPKEEPER: 'Bazaar Retail Stallholder',
  BROKER: 'Mandi Arbitrage Broker',
  CHAIWALA: 'Roadside Tea & Samosa Vendor',
  CRAFTSMAN: 'Traditional Silk Loom Weaver',
  HAMMAL: 'Warehouse Heavy Sack Loader',
};

export default function DeployAgentModal({
  isOpen,
  defaultDistrict = 'khari_baoli',
  playerBalance,
  onClose,
  onDeploy,
}: DeployAgentModalProps) {
  const [name, setName] = useState('Chachi Shanti');
  const [jobType, setJobType] = useState<AgentJobType>('CHAIWALA');
  const [district, setDistrict] = useState<DistrictId>(defaultDistrict);
  const [commodity, setCommodity] = useState<CommodityType>('food');
  const [buyBelow, setBuyBelow] = useState(11);
  const [sellAbove, setSellAbove] = useState(15);
  const [capital, setCapital] = useState(10);

  if (!isOpen) return null;

  const deploymentFee = 5;
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
      civilianRole: CIVILIAN_TITLES[jobType],
      level: 1,
      experience: 0,
      location: district,
      status: 'WORKING',
      efficiency: 82,
      operatingCost: 0.15,
      deploymentCost: deploymentFee,
      availableCapital: capital,
      energyLevel: 90,
      dailyLivingCost: 0.15,
      currentTask: `Initialized ${CIVILIAN_TITLES[jobType]} in ${DISTRICTS[district].name}`,
      contract,
      inventory: {},
      grossEarnings: 0,
      totalExpenses: 0,
      netProfit: 0,
      speechBubble: `Deployed in ${DISTRICTS[district].name}! Starting civilian work 🚀`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-lg rounded-xl border-4 border-[#2A211D] bg-[#1A1412] p-5 shadow-2xl space-y-4 text-[#D4C4B5]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3D3029] pb-3">
          <h3 className="text-lg font-black text-[#F3E5AB] flex items-center gap-2">
            <span>👳🏽‍♂️</span> DEPLOY CIVILIAN AGENT
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
              CIVILIAN AGENT NAME
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
              SELECT CIVILIAN OCCUPATION
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'TRADER',
                  'COURIER',
                  'CHAIWALA',
                  'CRAFTSMAN',
                  'HAMMAL',
                  'SHOPKEEPER',
                ] as AgentJobType[]
              ).map((job) => (
                <button
                  type="button"
                  key={job}
                  onClick={() => {
                    setJobType(job);
                    if (job === 'CHAIWALA') setName('Chachi Shanti');
                    else if (job === 'COURIER') setName('Kabir Rickshaw Puller');
                    else if (job === 'CRAFTSMAN') setName('Master Ramdas');
                    else if (job === 'HAMMAL') setName('Bholu Loader');
                    else if (job === 'TRADER') setName('Salim Spice Wholesaler');
                  }}
                  className={`p-2 rounded border text-left flex items-center gap-2 ${
                    jobType === job
                      ? 'border-[#F59E0B] bg-[#2E211A] text-[#F59E0B] font-bold'
                      : 'border-[#3D3029] bg-[#120D0B] hover:border-[#D97706]'
                  }`}
                >
                  <span className="text-base">{AVATARS[job][0]}</span>
                  <span className="text-[10px] uppercase truncate">{job}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#F59E0B] mt-1 italic">
              Role: {CIVILIAN_TITLES[jobType]}
            </p>
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
                PRIMARY COMMODITY
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value as CommodityType)}
                className="w-full px-3 py-2 bg-[#120D0B] border border-[#4A3B32] rounded text-[#F3E5AB] focus:border-[#D97706] focus:outline-none"
              >
                <option value="spices">🌶️ Spices</option>
                <option value="grain">🌾 Grain</option>
                <option value="textiles">🧵 Textiles</option>
                <option value="food">🍛 Food/Tea</option>
                <option value="fuel">⛽ Fuel</option>
                <option value="labor">🛠️ Labor</option>
              </select>
            </div>
          </div>

          {/* Capital Allocation */}
          <div>
            <label className="block text-[11px] text-[#A89F91] font-bold mb-1">
              OPTIMIZED WORKING CAPITAL: {capital} MON
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
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
            {canAfford ? 'CONFIRM CIVILIAN DEPLOYMENT' : 'INSUFFICIENT PLAYER MON BALANCE'}
          </button>
        </form>
      </div>
    </div>
  );
}
