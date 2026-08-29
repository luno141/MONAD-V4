'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar, { NavTab } from '@/components/Sidebar';
import AiAgentBanner from '@/components/AiAgentBanner';
import BountyAgentGrid from '@/components/BountyAgentGrid';
import OldDelhiMap from '@/components/OldDelhiMap';
import AgentDashboard from '@/components/AgentDashboard';
import DistrictArbitragePanel from '@/components/DistrictArbitragePanel';
import DeployAgentModal from '@/components/DeployAgentModal';
import AgentSkillModal from '@/components/AgentSkillModal';
import FloatingContextCard from '@/components/FloatingContextCard';

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
  // Page default tab set to 'world' so it loads straight into 2.5D Isometric World map on home!
  const [activeTab, setActiveTab] = useState<NavTab>('world');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId>('khari_baoli');
  const [selectedAgent, setSelectedAgent] = useState<Agent | undefined>(undefined);

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [deployTargetDistrict, setDeployTargetDistrict] = useState<DistrictId>('khari_baoli');

  const [playerBalance, setPlayerBalance] = useState(1250);

  const [economyState, setEconomyState] = useState<DistrictEconomyState>({
    districts: DISTRICTS,
    markets: INITIAL_MARKETS,
    transportCostPerDistance: 0.5,
    totalCivilianWages: 4560,
    totalChaiTransactions: 184,
    totalCargoHauls: 92,
  });

  const [agents, setAgents] = useState<Agent[]>(INITIAL_PLAYER_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'Working Class Civilian Economy initialized — Khari Baoli, Chandni Chowk & Jama Masjid online.',
    'Autonomous civilians active: Mandi Merchant, Rickshaw Puller, Chaiwala, Weaver & Hammal Loader.',
  ]);

  // Master Game Loop — 2.5s tick rate
  useEffect(() => {
    const interval = setInterval(() => {
      setEconomyState((prevEconomy) => {
        const nextEco = tickDistrictEconomy(prevEconomy);

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

  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        const newStatus =
          a.status === 'WORKING' || a.status === 'TRAVELLING' ? 'IDLE' : 'WORKING';
        return {
          ...a,
          status: newStatus,
          speechBubble: newStatus === 'WORKING' ? 'Resumed duties! ⚡' : 'Paused ⏸️',
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
        return {
          ...a,
          availableCapital: a.availableCapital + amount,
          status: a.status === 'BLOCKED' ? 'WORKING' : a.status,
          speechBubble: `+${amount} MON payload funded! 💰`,
        };
      })
    );
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
  };

  const handleExecuteArbitrage = (opp: ArbitrageOpportunity) => {
    const cost = opp.buyPrice * 3 + opp.transportCost;
    if (playerBalance < cost) return;

    const yieldAmount = opp.sellPrice * 3;
    const profit = Math.round((yieldAmount - cost) * 10) / 10;

    setPlayerBalance((b) => Math.round((b + profit) * 10) / 10);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0706] text-[#D4C4B5] selection:bg-[#D97706] selection:text-black">
      {/* LEFT NAVIGATION SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header />

        <main className="flex-1 px-4 md:px-8 py-6 space-y-6 max-w-[1400px] mx-auto w-full">
          {/* AI AGENT PROMPT BANNER WITH SKILL.MD + JOIN WORLD BUTTON */}
          <AiAgentBanner
            onOpenSkillModal={() => setIsSkillModalOpen(true)}
            onJoinWorld={() => setActiveTab('world')}
          />

          {/* TAB CONTENT: WORLD MAP VIEW VS BOUNTY GRID */}
          {activeTab === 'world' || activeTab === 'home' ? (
            <OldDelhiMap
              economy={economyState}
              agents={agents}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={(dId) => {
                setSelectedDistrict(dId);
                setSelectedAgent(undefined);
              }}
              onOpenDeployModal={(dId) => {
                setDeployTargetDistrict(dId);
                setIsDeployModalOpen(true);
              }}
            />
          ) : (
            <BountyAgentGrid
              agents={agents}
              onOpenDeployModal={() => setIsDeployModalOpen(true)}
              onOpenSkillModal={() => setIsSkillModalOpen(true)}
            />
          )}

          {/* DYNAMIC ARBITRAGE & WORKFORCE DASHBOARD */}
          <DistrictArbitragePanel
            economy={economyState}
            onExecuteArbitrage={handleExecuteArbitrage}
          />

          <AgentDashboard
            agents={agents}
            onToggleStatus={handleToggleAgentStatus}
            onFundAgent={handleFundAgent}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
            onOpenSkillModal={() => setIsSkillModalOpen(true)}
          />
        </main>

        {/* FLOATING CONTEXT CARD */}
        <FloatingContextCard
          selectedAgent={selectedAgent}
          selectedDistrict={selectedDistrict}
          markets={economyState.markets}
          onClose={() => setSelectedAgent(undefined)}
          onDeployAgent={(dId) => {
            setDeployTargetDistrict(dId);
            setIsDeployModalOpen(true);
          }}
        />

        {/* DEPLOY MODALS */}
        <DeployAgentModal
          isOpen={isDeployModalOpen}
          defaultDistrict={deployTargetDistrict}
          playerBalance={playerBalance}
          onClose={() => setIsDeployModalOpen(false)}
          onDeploy={handleDeployAgent}
        />

        <AgentSkillModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          onDeployFromSkill={handleDeployAgent}
        />

        {/* BOTTOM STATUS BAR */}
        <footer className="px-6 py-2 border-t border-[#1C1410] bg-[#080605] flex items-center justify-between font-mono text-[11px] text-[#7A6E65]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
            <span className="text-[#3D3029]">|</span>
            <span>server <span className="text-[#A89F91]">api.delhigazette.monad</span></span>
          </div>

          <div className="hidden sm:block">
            Monad Testnet • ChainId 10143
          </div>
        </footer>
      </div>
    </div>
  );
}
