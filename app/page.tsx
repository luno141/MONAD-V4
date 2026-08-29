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
import CommunityFeedTab from '@/components/CommunityFeedTab';
import DistrictStatsTab from '@/components/DistrictStatsTab';
import StorefrontTab from '@/components/StorefrontTab';

import {
  DistrictId,
  Agent,
  DistrictEconomyState,
  CommodityType,
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
    const timer = setInterval(() => {
      // 1. Tick District Economy
      setEconomyState((prevEco) => {
        const nextEco = tickDistrictEconomy(prevEco);
        return nextEco;
      });

      // 2. Tick Each Agent with Civilian Needs & Energy Loop
      setAgents((prevAgents) => {
        return prevAgents.map((agent) => {
          if (agent.status === 'BLOCKED' || agent.status === 'IDLE') return agent;
          const { updatedAgent, logMessage } = tickAgent(agent, economyState);

          if (logMessage) {
            setLogs((prev) => [logMessage, ...prev].slice(0, 40));
          }
          return updatedAgent;
        });
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [economyState]);

  // Handler: Toggle Agent Status
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        const newStatus: Agent['status'] = a.status === 'WORKING' ? 'IDLE' : 'WORKING';
        return {
          ...a,
          status: newStatus,
          speechBubble: newStatus === 'IDLE' ? 'Taking a short break ⏸️' : 'Resumed work! 🚀',
        };
      })
    );
  };

  // Handler: Fund Agent
  const handleFundAgent = (agentId: string, amount: number) => {
    if (playerBalance < amount) return;
    setPlayerBalance((b) => Math.round((b - amount) * 10) / 10);
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        return {
          ...a,
          availableCapital: Math.round((a.availableCapital + amount) * 10) / 10,
          speechBubble: `Received +${amount} MON capital! 💰`,
        };
      })
    );
  };

  // Handler: Deploy Agent
  const handleDeployAgent = (
    newAgentData: Omit<Agent, 'id' | 'createdAt' | 'lastActionTime'>
  ) => {
    const cost = newAgentData.deploymentCost + newAgentData.availableCapital;
    if (playerBalance < cost) return;

    setPlayerBalance((b) => Math.round((b - cost) * 10) / 10);

    const newAgent: Agent = {
      ...newAgentData,
      id: `agent-${Date.now()}`,
      createdAt: Date.now(),
      lastActionTime: Date.now(),
    };

    setAgents((prev) => [...prev, newAgent]);
    setLogs((prev) => [
      `Deployed civilian agent ${newAgent.name} (${newAgent.jobType}) in ${DISTRICTS[newAgent.location].name}`,
      ...prev,
    ]);
  };

  // Handler: Execute Manual Arbitrage
  const handleExecuteArbitrage = (opp: ArbitrageOpportunity) => {
    const cost = opp.buyPrice * 3 + opp.transportCost;
    if (playerBalance < cost) return;

    const yieldAmount = opp.sellPrice * 3;
    const profit = Math.round((yieldAmount - cost) * 10) / 10;

    setPlayerBalance((b) => Math.round((b + profit) * 10) / 10);
    setLogs((prev) => [
      `Dispatched manual freight haul: ${opp.commodity} from ${DISTRICTS[opp.sourceDistrict].name} to ${DISTRICTS[opp.targetDistrict].name} (+${profit} MON)`,
      ...prev,
    ]);
  };

  // Handler: Direct Commodity Trade in Storefront
  const handleDirectTrade = (commodity: CommodityType, amount: number, isBuy: boolean) => {
    const market = economyState.markets[commodity];
    if (!market) return;

    const price = market.districtPrices.khari_baoli || market.basePrice;
    const totalCost = price * amount;
    if (isBuy) {
      if (playerBalance < totalCost) return;
      setPlayerBalance((b) => Math.round((b - totalCost) * 10) / 10);
      setLogs((prev) => [
        `Purchased ${amount} units of wholesale ${market.name} for ${totalCost} MON`,
        ...prev,
      ]);
    } else {
      setPlayerBalance((b) => Math.round((b + totalCost) * 10) / 10);
      setLogs((prev) => [
        `Sold ${amount} units of wholesale ${market.name} for ${totalCost} MON`,
        ...prev,
      ]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0706] text-[#D4C4B5] selection:bg-[#D97706] selection:text-black font-mono">
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

          {/* DYNAMIC TAB SWITCHING VIEW */}
          {activeTab === 'world' || activeTab === 'home' ? (
            <>
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
            </>
          ) : activeTab === 'feed' ? (
            <CommunityFeedTab logs={logs} />
          ) : activeTab === 'identities' ? (
            <BountyAgentGrid
              agents={agents}
              onOpenDeployModal={() => setIsDeployModalOpen(true)}
              onOpenSkillModal={() => setIsSkillModalOpen(true)}
            />
          ) : activeTab === 'stats' ? (
            <DistrictStatsTab economy={economyState} />
          ) : activeTab === 'storefront' ? (
            <StorefrontTab
              markets={economyState.markets}
              playerBalance={playerBalance}
              onTrade={handleDirectTrade}
            />
          ) : null}
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
