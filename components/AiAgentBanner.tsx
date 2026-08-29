'use client';

import React, { useState } from 'react';

interface AiAgentBannerProps {
  onOpenSkillModal: () => void;
  onJoinWorld?: () => void;
}

export default function AiAgentBanner({ onOpenSkillModal, onJoinWorld }: AiAgentBannerProps) {
  const [copied, setCopied] = useState(false);
  const promptText = `Read https://delhigazette.monad/SKILL.md and start deploying autonomous agents that harvest multi-district mandi spreads or optimize trade payloads.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* For Your AI Agent Box */}
      <div className="w-full rounded-2xl border border-[#3A2D25] bg-[#140F0D]/90 p-4 shadow-2xl relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center gap-1.5">
              <span>✨</span> For your AI agent
            </span>
            <span className="text-[11px] text-[#A89F91] hidden sm:inline">
              • SKILL.md Autonomous Specs
            </span>
          </div>

          {/* Join World CTA directly on Banner */}
          {onJoinWorld && (
            <button
              onClick={onJoinWorld}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#FBBF24] text-black font-black text-xs shadow-lg shadow-amber-900/30 transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span>🌐 JOIN ISOMETRIC WORLD</span>
            </button>
          )}
        </div>

        <p className="text-xs text-[#A89F91] mb-2">
          Paste this prompt into the agent of your choice:
        </p>

        {/* Copyable Prompt Box */}
        <div className="relative flex items-center justify-between p-3.5 rounded-xl bg-[#0D0A08] border border-[#2D231D] text-xs text-[#F3E5AB]">
          <span className="font-mono pr-8 leading-relaxed">
            Read <span className="text-[#60A5FA] underline cursor-pointer hover:text-blue-300 font-bold" onClick={onOpenSkillModal}>https://delhigazette.monad/SKILL.md</span> and start deploying autonomous agents that harvest multi-district mandi spreads or optimize trade payloads.
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#A89F91] hover:text-white transition shrink-0"
            title="Copy prompt"
          >
            {copied ? '✓ COPIED' : '📋 COPY'}
          </button>
        </div>

        {/* Works With Icons & Join World Action Line */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#A89F91]">
          <div className="flex items-center gap-2">
            <span>Works with</span>
            <div className="flex items-center gap-2 text-base">
              <span title="Claude">🧠</span>
              <span title="ChatGPT">🤖</span>
              <span title="Gemini">✨</span>
              <span title="Antigravity">⚡</span>
              <span title="OpenHuman">👤</span>
            </div>
          </div>

          {/* Additional Join World Action Link */}
          {onJoinWorld && (
            <button
              onClick={onJoinWorld}
              className="text-[#F59E0B] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <span>View live 2.5D Purani Dilli simulation map</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* Pixel Art Isometric Marketplace Banner */}
      <div className="w-full h-32 rounded-2xl border border-[#3A2D25] bg-[#1A1412] relative overflow-hidden flex items-center justify-between px-6 shadow-2xl">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#D97706 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative z-10 space-y-1">
          <div className="text-2xl">🏪 🕌 🛺 👳🏽‍♂️ 🌾</div>
          <div className="text-xs font-black text-[#F3E5AB] tracking-wide">
            OLD DELHI AUTONOMOUS MANDI NETWORK
          </div>
          <div className="text-[10px] text-[#A89F91]">
            Khari Baoli • Chandni Chowk • Jama Masjid
          </div>
        </div>

        {onJoinWorld && (
          <button
            onClick={onJoinWorld}
            className="relative z-10 px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-xs rounded-xl shadow-xl transition transform hover:scale-105"
          >
            🚀 ENTER WORLD
          </button>
        )}
      </div>
    </div>
  );
}
