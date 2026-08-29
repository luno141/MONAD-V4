'use client';

import React, { useState } from 'react';
import { DEFAULT_AGENT_SKILL_MD } from '@/lib/config/defaultAgentSkill';
import { Agent, AgentJobType, CommodityType, DistrictId } from '@/lib/types/agentTypes';

interface AgentSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployFromSkill: (agent: Omit<Agent, 'id' | 'createdAt' | 'lastActionTime'>) => void;
}

export default function AgentSkillModal({
  isOpen,
  onClose,
  onDeployFromSkill,
}: AgentSkillModalProps) {
  const [skillMarkdown, setSkillMarkdown] = useState(DEFAULT_AGENT_SKILL_MD);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(skillMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([skillMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chain_reaction_agent.skill.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleParseAndDeploy = () => {
    // Basic parser for SKILL.md key-values
    const nameMatch = skillMarkdown.match(/name:\s*(.+)/);
    const roleMatch = skillMarkdown.match(/role:\s*(.+)/);
    const sourceMatch = skillMarkdown.match(/source_district:\s*(.+)/);
    const targetMatch = skillMarkdown.match(/target_district:\s*(.+)/);
    const commodityMatch = skillMarkdown.match(/primary_commodity:\s*(.+)/);
    const capitalMatch = skillMarkdown.match(/micro_payload_capital:\s*(\d+)/);
    const buyMatch = skillMarkdown.match(/buy_below_price:\s*(\d+)/);
    const sellMatch = skillMarkdown.match(/sell_above_price:\s*(\d+)/);

    const name = nameMatch ? nameMatch[1].trim() : 'Custom Skill Agent';
    const jobType = (roleMatch ? roleMatch[1].trim().toUpperCase() : 'TRADER') as AgentJobType;
    const location = (sourceMatch ? sourceMatch[1].trim() : 'khari_baoli') as DistrictId;
    const targetDistrict = (targetMatch ? targetMatch[1].trim() : 'jama_masjid') as DistrictId;
    const commodity = (commodityMatch ? commodityMatch[1].trim() : 'spices') as CommodityType;
    const capital = capitalMatch ? Number(capitalMatch[1]) : 15;
    const buyBelow = buyMatch ? Number(buyMatch[1]) : 11;
    const sellAbove = sellMatch ? Number(sellMatch[1]) : 15;

    onDeployFromSkill({
      ownerPlayerId: 'player-1',
      name,
      avatar: jobType === 'COURIER' ? '🛵' : jobType === 'SHOPKEEPER' ? '🏪' : '👳🏽‍♂️',
      jobType,
      level: 1,
      experience: 0,
      location,
      status: 'WORKING',
      efficiency: 85,
      operatingCost: 0.2,
      deploymentCost: 5,
      availableCapital: capital,
      currentTask: `Executing SKILL.md (${commodity} strategy)`,
      contract: {
        targetCommodity: commodity,
        buyBelow,
        sellAbove,
        maxCapital: capital * 2,
        minAcceptableProfit: 2,
        sourceDistrict: location,
        targetDistrict,
        durationHours: 24,
      },
      inventory: {},
      grossEarnings: 0,
      totalExpenses: 0,
      netProfit: 0,
      speechBubble: `Loaded SKILL.md strategy: ${name} active! ⚡`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono text-[#D4C4B5] animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border-4 border-[#2A211D] bg-[#16110F] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3D3029] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-xl text-[#F59E0B]">
              📄
            </div>
            <div>
              <h3 className="text-base font-black text-[#F3E5AB]">
                DEPLOY AGENT FROM SKILL.MD
              </h3>
              <p className="text-[11px] text-[#A89F91]">
                Customize, download, or paste custom markdown agent behavior specifications.
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

        {/* Skill Editor Textarea */}
        <div className="space-y-2">
          <label className="block text-[11px] text-[#A89F91] font-bold">
            SKILL.MD SPECIFICATION CONTENT
          </label>
          <textarea
            value={skillMarkdown}
            onChange={(e) => setSkillMarkdown(e.target.value)}
            rows={11}
            className="w-full p-3 bg-[#100C0A] border border-[#3D3029] rounded-xl text-xs font-mono text-[#F3E5AB] focus:border-[#D97706] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#3D3029]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#261E1A] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#4A3B32] rounded-lg text-xs font-bold transition"
            >
              {copied ? '✓ COPIED TO CLIPBOARD' : '📋 COPY SKILL.MD'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-[#261E1A] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#4A3B32] rounded-lg text-xs font-bold transition"
            >
              💾 DOWNLOAD SKILL.MD
            </button>
          </div>

          <button
            onClick={handleParseAndDeploy}
            className="px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-mono font-black text-xs rounded-xl shadow-xl transition transform hover:scale-105"
          >
            🚀 PARSE & DEPLOY AGENT FROM SKILL.MD
          </button>
        </div>
      </div>
    </div>
  );
}
