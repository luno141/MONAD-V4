// CHAIN REACTION — Autonomous Agent Workforce Execution Engine

import { Agent, DistrictEconomyState, CommodityType } from '../types/agentTypes';
import { getTransportCost } from './districtEconomy';

export interface AgentTickResult {
  updatedAgent: Agent;
  playerBalanceDelta: number;
  logMessage?: string;
}

export const INITIAL_PLAYER_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    ownerPlayerId: 'player-1',
    name: 'Rafi the Autonomous Trader',
    avatar: '👳🏽‍♂️',
    jobType: 'TRADER',
    level: 2,
    experience: 140,
    location: 'khari_baoli',
    status: 'WORKING',
    efficiency: 85,
    operatingCost: 0.2,
    deploymentCost: 10,
    availableCapital: 25,
    currentTask: 'Autonomous Spices Arbitrage',
    contract: {
      targetCommodity: 'spices',
      buyBelow: 11,
      sellAbove: 15,
      maxCapital: 50,
      minAcceptableProfit: 2,
      sourceDistrict: 'khari_baoli',
      targetDistrict: 'jama_masjid',
      durationHours: 24,
    },
    inventory: { spices: 2 },
    grossEarnings: 45,
    totalExpenses: 8,
    netProfit: 37,
    speechBubble: 'Scanning micro spice spreads... 🌶️',
    createdAt: Date.now() - 3600000,
    lastActionTime: Date.now(),
  },
  {
    id: 'agent-2',
    ownerPlayerId: 'player-1',
    name: 'Kabir the Autonomous Courier',
    avatar: '🛵',
    jobType: 'COURIER',
    level: 1,
    experience: 75,
    location: 'khari_baoli',
    targetLocation: 'chandni_chowk',
    status: 'WORKING',
    efficiency: 80,
    operatingCost: 0.3,
    deploymentCost: 15,
    availableCapital: 30,
    currentTask: 'Auto Hauling Grain to Chandni Chowk',
    contract: {
      targetCommodity: 'grain',
      buyBelow: 8,
      sellAbove: 11,
      maxCapital: 60,
      minAcceptableProfit: 2,
      sourceDistrict: 'khari_baoli',
      targetDistrict: 'chandni_chowk',
      durationHours: 12,
    },
    inventory: { grain: 3 },
    grossEarnings: 38,
    totalExpenses: 9,
    netProfit: 29,
    speechBubble: 'Auto cargo transit on Chandni route! 🌾',
    createdAt: Date.now() - 1800000,
    lastActionTime: Date.now(),
  },
];

export function tickAgent(
  agent: Agent,
  economy: DistrictEconomyState
): AgentTickResult {
  if (agent.status === 'IDLE' || agent.status === 'BLOCKED') {
    return { updatedAgent: agent, playerBalanceDelta: 0 };
  }

  let updated = { ...agent };
  let balanceDelta = 0;
  let logMsg: string | undefined;

  // Deduct operating cost
  updated.totalExpenses += updated.operatingCost;
  updated.availableCapital -= updated.operatingCost;

  if (updated.availableCapital <= updated.operatingCost) {
    updated.status = 'BLOCKED';
    updated.speechBubble = 'Out of capital! Need MON funding ⚠️';
    updated.currentTask = 'Halted — Insufficient Capital';
    return {
      updatedAgent: updated,
      playerBalanceDelta: 0,
      logMessage: `${updated.name} ran out of operating capital!`,
    };
  }

  const contract = updated.contract;
  const commodity = contract.targetCommodity;
  const market = economy.markets[commodity];

  if (!market) {
    return { updatedAgent: updated, playerBalanceDelta: 0 };
  }

  const currentLoc = updated.location;
  const currentPrice = market.districtPrices[currentLoc];

  // JOB TYPE 1: TRADER
  if (updated.jobType === 'TRADER') {
    const invCount = updated.inventory[commodity] || 0;

    // BUY condition
    if (currentPrice <= contract.buyBelow && updated.availableCapital >= currentPrice * 5) {
      const unitsToBuy = Math.min(5, Math.floor(updated.availableCapital / currentPrice));
      const cost = unitsToBuy * currentPrice;

      updated.inventory[commodity] = invCount + unitsToBuy;
      updated.availableCapital -= cost;
      updated.totalExpenses += cost;
      updated.experience += 10;
      updated.speechBubble = `Bought ${unitsToBuy} ${commodity} @ ${currentPrice} MON! 📉`;
      updated.currentTask = `Acquired ${unitsToBuy} ${commodity}`;
      logMsg = `${updated.name} bought ${unitsToBuy} ${commodity} in ${currentLoc} for ${cost.toFixed(1)} MON.`;
    }
    // SELL condition
    else if (currentPrice >= contract.sellAbove && invCount > 0) {
      const unitsToSell = invCount;
      const revenue = unitsToSell * currentPrice;

      updated.inventory[commodity] = 0;
      updated.availableCapital += revenue;
      updated.grossEarnings += revenue;
      updated.experience += 25;
      updated.speechBubble = `Sold ${unitsToSell} ${commodity} @ ${currentPrice} MON! 📈`;
      updated.currentTask = `Sold ${unitsToSell} ${commodity} for ${revenue.toFixed(1)} MON`;
      balanceDelta += revenue * 0.2; // 20% dividend directly to player balance
      logMsg = `${updated.name} sold ${unitsToSell} ${commodity} in ${currentLoc} for ${revenue.toFixed(1)} MON!`;
    } else {
      updated.speechBubble = `Monitoring ${commodity} (Current: ${currentPrice} MON)`;
    }
  }

  // JOB TYPE 2: COURIER
  else if (updated.jobType === 'COURIER') {
    const targetLoc = contract.targetDistrict || 'chandni_chowk';

    if (updated.status === 'WORKING') {
      const invCount = updated.inventory[commodity] || 0;

      if (invCount === 0 && currentPrice <= contract.buyBelow && updated.availableCapital >= currentPrice * 5) {
        const units = Math.min(8, Math.floor(updated.availableCapital / currentPrice));
        const cost = units * currentPrice;
        updated.inventory[commodity] = units;
        updated.availableCapital -= cost;
        updated.totalExpenses += cost;
        updated.status = 'TRAVELLING';
        updated.targetLocation = targetLoc;
        updated.speechBubble = `Loaded ${units} ${commodity}! Heading to ${targetLoc} 🛵`;
        updated.currentTask = `Transporting to ${targetLoc}`;
      } else {
        updated.speechBubble = `Waiting for bargain ${commodity} at ${currentLoc}...`;
      }
    } else if (updated.status === 'TRAVELLING') {
      // Arrived at destination
      updated.location = updated.targetLocation || 'chandni_chowk';
      updated.status = 'WORKING';
      const invCount = updated.inventory[commodity] || 0;
      const destPrice = market.districtPrices[updated.location];
      const transportFee = getTransportCost(contract.sourceDistrict, updated.location);

      const revenue = invCount * destPrice;
      const netYield = revenue - transportFee;

      updated.inventory[commodity] = 0;
      updated.availableCapital += netYield;
      updated.grossEarnings += revenue;
      updated.totalExpenses += transportFee;
      updated.experience += 30;
      updated.speechBubble = `Delivered to ${updated.location}! Earned +${netYield.toFixed(1)} MON ✨`;
      updated.currentTask = `Completed haul to ${updated.location}`;
      balanceDelta += netYield * 0.25;
      logMsg = `${updated.name} delivered ${invCount} ${commodity} to ${updated.location} (+${netYield.toFixed(1)} MON).`;
    }
  }

  // JOB TYPE 3: SHOPKEEPER
  else if (updated.jobType === 'SHOPKEEPER') {
    const invCount = updated.inventory[commodity] || 0;

    if (invCount < 5 && updated.availableCapital >= currentPrice * 5) {
      const buyCount = 5;
      const cost = buyCount * currentPrice;
      updated.inventory[commodity] = invCount + buyCount;
      updated.availableCapital -= cost;
      updated.totalExpenses += cost;
      updated.speechBubble = `Restocked ${buyCount} ${commodity} wholesale! 🏪`;
    } else if (invCount > 0) {
      const retailPrice = Math.round(currentPrice * 1.3 * 10) / 10;
      const sales = Math.min(invCount, 3);
      const revenue = sales * retailPrice;

      updated.inventory[commodity] = invCount - sales;
      updated.availableCapital += revenue;
      updated.grossEarnings += revenue;
      updated.experience += 15;
      updated.speechBubble = `Retail sale: ${sales} ${commodity} @ ${retailPrice} MON! 🛒`;
      updated.currentTask = `Retail Shop Active (${sales} sold)`;
      balanceDelta += revenue * 0.2;
    }
  }

  // JOB TYPE 4: BROKER
  else if (updated.jobType === 'BROKER') {
    // Scans arbitrage opportunity
    const khariP = market.districtPrices['khari_baoli'];
    const jamaP = market.districtPrices['jama_masjid'];
    const spread = Math.abs(jamaP - khariP);

    if (spread >= contract.minAcceptableProfit) {
      const commission = Math.round(spread * 3 * 10) / 10;
      updated.availableCapital += commission;
      updated.grossEarnings += commission;
      updated.experience += 20;
      updated.speechBubble = `Matched trade deal! Commission +${commission} MON 🤝`;
      updated.currentTask = `Brokered trade spread of ${spread.toFixed(1)} MON`;
      balanceDelta += commission * 0.3;
      logMsg = `${updated.name} brokered trade spread of ${spread.toFixed(1)} MON (+${commission} MON commission).`;
    } else {
      updated.speechBubble = `Scanning market spreads... (Current spread: ${spread.toFixed(1)} MON)`;
    }
  }

  // Recalculate net profit & levels
  updated.netProfit = Math.round((updated.grossEarnings - updated.totalExpenses) * 10) / 10;
  if (updated.experience >= updated.level * 100) {
    updated.level += 1;
    updated.efficiency = Math.min(99, updated.efficiency + 3);
    logMsg = `🎉 ${updated.name} leveled up to Level ${updated.level}! Efficiency increased to ${updated.efficiency}%.`;
  }

  updated.lastActionTime = Date.now();

  return {
    updatedAgent: updated,
    playerBalanceDelta: Math.round(balanceDelta * 10) / 10,
    logMessage: logMsg,
  };
}
