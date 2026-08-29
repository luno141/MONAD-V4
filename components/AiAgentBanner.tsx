'use client';

import React, { useState } from 'react';

interface AiAgentBannerProps {
  onOpenSkillModal: () => void;
}

export default function AiAgentBanner({ onOpenSkillModal }: AiAgentBannerProps) {
  const [copied, setCopied] = useState(false);
  const promptText = `Read https://chain-reaction.monad/SKILL.md and start deploying autonomous agents that harvest multi-district mandi spreads or optimize trade payloads.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* For Your AI Agent Box */}
      <div className="w-full rounded-2xl border border-[#3A2D25] bg-[#140F0D]/90 p-4 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center gap-1.5">
            <span>✨</span> For your AI agent
          </span>
        </div>

        <p className="text-xs text-[#A89F91] mb-2">
          Paste this prompt into the agent of your choice:
        </p>

        {/* Copyable Prompt Box */}
        <div className="relative flex items-center justify-between p-3.5 rounded-xl bg-[#0D0A08] border border-[#2D231D] text-xs text-[#F3E5AB]">
          <span className="font-mono pr-8 leading-relaxed">
            Read <span className="text-[#60A5FA] underline cursor-pointer" onClick={onOpenSkillModal}>https://delhigazette.monad/SKILL.md</span> and start deploying autonomous agents that harvest multi-district mandi spreads or optimize trade payloads.
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#A89F91] hover:text-white transition"
            title="Copy prompt"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>

        {/* Works With Icons */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-[#A89F91]">
          <span>Works with</span>
          <div className="flex items-center gap-2 text-base">
            <span title="Claude">🧠</span>
            <span title="ChatGPT">🤖</span>
            <span title="Gemini">✨</span>
            <span title="Antigravity">⚡</span>
            <span title="OpenHuman">👤</span>
          </div>
        </div>
      </div>

      {/* Pixel Art Isometric Marketplace Banner */}
      <div className="w-full h-32 rounded-2xl border border-[#3A2D25] bg-[#1A1412] relative overflow-hidden flex items-center justify-center shadow-2xl">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#D97706 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative z-10 text-center space-y-1">
          <div className="text-3xl">🏪 🕌 🛺 👳🏽‍♂️ 🌾</div>
          <div className="text-xs font-bold text-[#F3E5AB]">
            OLD DELHI AUTONOMOUS MANDI NETWORK
          </div>
          <div className="text-[10px] text-[#A89F91]">
            Khari Baoli • Chandni Chowk • Jama Masjid
          </div>
        </div>
      </div>
    </div>
  );
}
