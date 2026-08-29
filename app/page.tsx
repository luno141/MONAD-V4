'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import OldDelhiMap from '@/components/OldDelhiMap';
import AgentDashboard from '@/components/AgentDashboard';
import DistrictArbitragePanel from '@/components/DistrictArbitragePanel';
import DeployAgentModal from '@/components/DeployAgentModal';
import EconomyPanel from '@/components/EconomyPanel';
import PlayerPanel from '@/components/PlayerPanel';
import ActionsPanel from '@/components/ActionsPanel';
import WorldEvent from '@/components/WorldEvent';
import CascadeVisualization from '@/components/CascadeVisualization';
import MonaCorpPanel from '@/components/MonaCorpPanel';
import ActivityLog from '@/components/ActivityLog';
import CompanyCards from '@/components/CompanyCards';

import {
  DistrictId,
  Agent,
  DistrictEconomyState,
} from '@/lib/types/agentTypes';
import {
  DISTRICTS,
  INITIAL_MARKETS,
  tickDistrictEconomy,
  ArbitrageOpportunity,
} from '@/lib/simulation/districtEconomy';
import {
  INITIAL_PLAYER_AGENTS,
  tickAgent,
} from '@/lib/simulation/agentRunner';

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId>('khari_baoli');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployTargetDistrict, setDeployTargetDistrict] = useState<DistrictId>('khari_baoli');

  const [playerBalance, setPlayerBalance] = useState(1250);

  const [economyState, setEconomyState] = useState<DistrictEconomyState>({
    districts: DISTRICTS,
    markets: INITIAL_MARKETS,
    transportCostPerDistance: 0.5,
  });

  const [agents, setAgents] = useState<Agent[]>(INITIAL_PLAYER_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'Welcome to Chain Reaction: Old Delhi Mandi Edition.',
    'System initialized — Khari Baoli, Chandni Chowk & Jama Masjid online.',
    'Workforce agents deployed: Rafi the Spice Trader & Kabir the Mandi Courier.',
  ]);

  // Master Game Loop — 2.5s tick rate
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick District Economy
      setEconomyState((prevEconomy) => {
        const nextEco = tickDistrictEconomy(prevEconomy);

        // 2. Tick Active Agents
        setAgents((prevAgents) => {
          let balanceAccumulator = 0;
          const newLogs: string[] = [];

          const nextAgents = prevAgents.map((ag) => {
            const res = tickAgent(ag, nextEco);
            balanceAccumulator += res.playerBalanceDelta;
            if (res.logMessage) {
              newLogs.push(res.logMessage);
            }
            return res.updatedAgent;
          });

          if (balanceAccumulator !== 0) {
            setPlayerBalance((b) => Math.max(0, Math.round((b + balanceAccumulator) * 10) / 10));
          }

          if (newLogs.length > 0) {
            setLogs((prev) => [...newLogs, ...prev].slice(0, 30));
          }

          return nextAgents;
        });

        return nextEco;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Agent Actions
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        const newStatus =
          a.status === 'WORKING' || a.status === 'TRAVELLING' ? 'IDLE' : 'WORKING';
        return {
          ...a,
          status: newStatus,
          speechBubble: newStatus === 'WORKING' ? 'Resumed duties! ⚡' : 'Paused by player ⏸️',
        };
      })
    );
  };

  const handleFundAgent = (agentId: string, amount: number) => {
    if (playerBalance < amount) return;

    setPlayerBalance((b) => Math.max(0, b - amount));
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        const newCapital = a.availableCapital + amount;
        return {
          ...a,
          availableCapital: newCapital,
          status: a.status === 'BLOCKED' ? 'WORKING' : a.status,
          speechBubble: `Received +${amount} MON capital funding! 💰`,
        };
      })
    );

    setLogs((prev) => [`Funded agent with ${amount} MON capital.`, ...prev]);
  };

  const handleDeployAgent = (
    newAgentData: Omit<Agent, 'id' | 'createdAt' | 'lastActionTime'>
  ) => {
    const totalCost = newAgentData.deploymentCost + newAgentData.availableCapital;
    if (playerBalance < totalCost) return;

    setPlayerBalance((b) => Math.max(0, b - totalCost));

    const newAgent: Agent = {
      ...newAgentData,
      id: `agent-${Date.now()}`,
      createdAt: Date.now(),
      lastActionTime: Date.now(),
    };

    setAgents((prev) => [...prev, newAgent]);
    setLogs((prev) => [
      `🎉 Deployed new agent '${newAgent.name}' in ${newAgent.location} (${newAgent.jobType}).`,
      ...prev,
    ]);
  };

  const handleExecuteArbitrage = (opp: ArbitrageOpportunity) => {
    const cost = opp.buyPrice * 5 + opp.transportCost;
    if (playerBalance < cost) return;

    const yieldAmount = opp.sellPrice * 5;
    const profit = Math.round((yieldAmount - cost) * 10) / 10;

    setPlayerBalance((b) => Math.round((b + profit) * 10) / 10);
    setLogs((prev) => [
      `⚡ Manual Arbitrage Haul: Carried 5 ${opp.commodity} from ${DISTRICTS[opp.sourceDistrict].name} to ${DISTRICTS[opp.targetDistrict].name} (+${profit} MON net profit)!`,
      ...prev,
    ]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#140F0D] text-[#D4C4B5] selection:bg-[#D97706] selection:text-black">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* SPATIAL WORLD MAP — OLD DELHI */}
        <OldDelhiMap
          economy={economyState}
          agents={agents}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          onOpenDeployModal={(dId) => {
            setDeployTargetDistrict(dId);
            setIsDeployModalOpen(true);
          }}
        />

        {/* CROSS-DISTRICT ARBITRAGE SCANNER */}
        <DistrictArbitragePanel
          economy={economyState}
          onExecuteArbitrage={handleExecuteArbitrage}
        />

        {/* WORKFORCE AGENT DASHBOARD */}
        <AgentDashboard
          agents={agents}
          onToggleStatus={handleToggleAgentStatus}
          onFundAgent={handleFundAgent}
          onOpenDeployModal={() => {
            setDeployTargetDistrict(selectedDistrict);
            setIsDeployModalOpen(true);
          }}
        />

        {/* MANDI OVERVIEW & COMPANIES */}
        <EconomyPanel />
        <CompanyCards />

        {/* MAIN GAME GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <PlayerPanel />
            <ActionsPanel />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-4 space-y-6">
            <WorldEvent />
            <CascadeVisualization />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <MonaCorpPanel />
            <ActivityLog />
          </div>
        </div>
      </main>

      {/* DEPLOY AGENT MODAL */}
      <DeployAgentModal
        isOpen={isDeployModalOpen}
        defaultDistrict={deployTargetDistrict}
        playerBalance={playerBalance}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeployAgent}
      />

      {/* FOOTER */}
      <footer className="px-6 py-3 border-t-4 border-[#2A211D] bg-[#1A1412] flex items-center justify-between font-mono text-[10px] text-[#A89F91] font-bold">
        <span>
          CHAIN REACTION v0.2.0 — Old Delhi Agent Workforce Edition
        </span>
        <span>
          MONAD TESTNET SIMULATION — LIVE MANDI WORLD 📜
        </span>
      </footer>
    </div>
  );
}
