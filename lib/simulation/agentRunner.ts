// CHAIN REACTION — Autonomous Working Class Civilian Economy Execution Engine

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
    name: 'Rafi the Mandi Merchant',
    avatar: '👳🏽‍♂️',
    jobType: 'TRADER',
    civilianRole: 'Khari Baoli Spice Wholesaler',
    level: 2,
    experience: 160,
    location: 'khari_baoli',
    status: 'WORKING',
    efficiency: 88,
    operatingCost: 0.2,
    deploymentCost: 10,
    availableCapital: 35,
    energyLevel: 85,
    dailyLivingCost: 0.2,
    currentTask: 'Buying wholesale cardamom & hiring freight haulers',
    contract: {
      targetCommodity: 'spices',
      buyBelow: 11,
      sellAbove: 15,
      maxCapital: 60,
      minAcceptableProfit: 2,
      sourceDistrict: 'khari_baoli',
      targetDistrict: 'jama_masjid',
      durationHours: 24,
    },
    inventory: { spices: 3 },
    grossEarnings: 55,
    totalExpenses: 12,
    netProfit: 43,
    speechBubble: 'Sourcing spice crates from Khari Baoli warehouse 🌶️',
    createdAt: Date.now() - 3600000,
    lastActionTime: Date.now(),
  },
  {
    id: 'agent-2',
    ownerPlayerId: 'player-1',
    name: 'Kabir the Rickshaw Puller',
    avatar: '🛺',
    jobType: 'COURIER',
    civilianRole: 'Heavy Cargo Cycle Rickshaw Porter',
    level: 2,
    experience: 120,
    location: 'khari_baoli',
    targetLocation: 'jama_masjid',
    status: 'WORKING',
    efficiency: 85,
    operatingCost: 0.15,
    deploymentCost: 12,
    availableCapital: 22,
    energyLevel: 65,
    dailyLivingCost: 0.15,
    currentTask: 'Hauling 25kg spice payload to Jama Masjid retail hub',
    contract: {
      targetCommodity: 'spices',
      buyBelow: 11,
      sellAbove: 15,
      maxCapital: 40,
      minAcceptableProfit: 2,
      sourceDistrict: 'khari_baoli',
      targetDistrict: 'jama_masjid',
      durationHours: 12,
    },
    inventory: { spices: 2 },
    grossEarnings: 42,
    totalExpenses: 10,
    netProfit: 32,
    speechBubble: 'Pedaling cargo through Chandni Chowk alleys! 🛺',
    createdAt: Date.now() - 2800000,
    lastActionTime: Date.now(),
  },
  {
    id: 'agent-3',
    ownerPlayerId: 'player-1',
    name: 'Chachi Shanti Chaiwala',
    avatar: '☕',
    jobType: 'CHAIWALA',
    civilianRole: 'Roadside Tea & Samosa Vendor',
    level: 3,
    experience: 210,
    location: 'chandni_chowk',
    status: 'WORKING',
    efficiency: 92,
    operatingCost: 0.1,
    deploymentCost: 8,
    availableCapital: 28,
    energyLevel: 90,
    dailyLivingCost: 0.1,
    currentTask: 'Brewing ginger masala chai & serving market workers',
    contract: {
      targetCommodity: 'food',
      buyBelow: 14,
      sellAbove: 17,
      maxCapital: 30,
      minAcceptableProfit: 1,
      sourceDistrict: 'chandni_chowk',
      durationHours: 24,
    },
    inventory: { food: 8 },
    grossEarnings: 68,
    totalExpenses: 14,
    netProfit: 54,
    speechBubble: 'Hot Masala Chai ready! 5 MON per cup ☕',
    createdAt: Date.now() - 4500000,
    lastActionTime: Date.now(),
  },
  {
    id: 'agent-4',
    ownerPlayerId: 'player-1',
    name: 'Master Ramdas Weaver',
    avatar: '🧵',
    jobType: 'CRAFTSMAN',
    civilianRole: 'Old Delhi Silk & Zari Loom Master',
    level: 2,
    experience: 135,
    location: 'chandni_chowk',
    status: 'WORKING',
    efficiency: 86,
    operatingCost: 0.25,
    deploymentCost: 15,
    availableCapital: 30,
    energyLevel: 75,
    dailyLivingCost: 0.2,
    currentTask: 'Weaving traditional brocade silk saris for market stalls',
    contract: {
      targetCommodity: 'textiles',
      buyBelow: 18,
      sellAbove: 23,
      maxCapital: 50,
      minAcceptableProfit: 3,
      sourceDistrict: 'chandni_chowk',
      durationHours: 18,
    },
    inventory: { textiles: 3 },
    grossEarnings: 49,
    totalExpenses: 11,
    netProfit: 38,
    speechBubble: 'Loom running! Crafting zari textiles 🧵',
    createdAt: Date.now() - 2000000,
    lastActionTime: Date.now(),
  },
  {
    id: 'agent-5',
    ownerPlayerId: 'player-1',
    name: 'Bholu the Mandi Hammal',
    avatar: '💪',
    jobType: 'HAMMAL',
    civilianRole: 'Warehouse Daily Wage Freight Loader',
    level: 1,
    experience: 90,
    location: 'khari_baoli',
    status: 'WORKING',
    efficiency: 80,
    operatingCost: 0.1,
    deploymentCost: 5,
    availableCapital: 18,
    energyLevel: 55,
    dailyLivingCost: 0.1,
    currentTask: 'Loading grain & spice sacks onto transport rickshaws',
    contract: {
      targetCommodity: 'labor',
      buyBelow: 12,
      sellAbove: 16,
      maxCapital: 25,
      minAcceptableProfit: 1.5,
      sourceDistrict: 'khari_baoli',
      durationHours: 12,
    },
    inventory: { labor: 4 },
    grossEarnings: 31,
    totalExpenses: 6,
    netProfit: 25,
    speechBubble: 'Loading 50kg grain sacks at mandi gate! 💪',
    createdAt: Date.now() - 1200000,
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

  // Deduct daily living cost & operating expense
  const totalCost = updated.operatingCost + updated.dailyLivingCost;
  updated.totalExpenses += totalCost;
  updated.availableCapital -= totalCost;

  // Energy depletion during civilian labor
  updated.energyLevel = Math.max(0, updated.energyLevel - Math.floor(Math.random() * 5 + 3));

  // CIVILIAN NEED: Chai & Food break when energy is low (<35)
  if (updated.energyLevel < 35 && updated.jobType !== 'CHAIWALA') {
    const chaiCost = 1.5;
    if (updated.availableCapital >= chaiCost) {
      updated.availableCapital -= chaiCost;
      updated.totalExpenses += chaiCost;
      updated.energyLevel = Math.min(100, updated.energyLevel + 45);
      updated.totalChaiBought = (updated.totalChaiBought || 0) + 1;
      updated.speechBubble = `Chai & Samosa break! (+45 Energy, -1.5 MON) ☕`;
      updated.currentTask = `Resting at Chandni Chowk Tea Stall`;
      return {
        updatedAgent: updated,
        playerBalanceDelta: 0,
        logMessage: `☕ ${updated.name} bought hot masala chai & samosas to replenish energy.`,
      };
    }
  }

  // Capital check
  if (updated.availableCapital <= totalCost) {
    updated.status = 'BLOCKED';
    updated.speechBubble = 'Out of daily capital! Need MON wage funding ⚠️';
    updated.currentTask = 'Halted — Insufficient Daily Capital';
    return {
      updatedAgent: updated,
      playerBalanceDelta: 0,
      logMessage: `⚠️ ${updated.name} (${updated.civilianRole}) ran out of working capital!`,
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

  // OCCUPATION 1: MANDI MERCHANT (TRADER)
  if (updated.jobType === 'TRADER') {
    const invCount = updated.inventory[commodity] || 0;

    if (currentPrice <= contract.buyBelow && updated.availableCapital >= currentPrice * 3) {
      const unitsToBuy = Math.min(4, Math.floor(updated.availableCapital / currentPrice));
      const cost = unitsToBuy * currentPrice;

      updated.inventory[commodity] = invCount + unitsToBuy;
      updated.availableCapital -= cost;
      updated.totalExpenses += cost;
      updated.experience += 12;
      updated.speechBubble = `Acquired ${unitsToBuy} ${commodity} wholesale @ ${currentPrice} MON! 📉`;
      updated.currentTask = `Mandi Merchant: Stocked ${unitsToBuy} ${commodity}`;
      logMsg = `👳🏽‍♂️ ${updated.name} purchased ${unitsToBuy} ${commodity} wholesale in ${currentLoc}.`;
    } else if (currentPrice >= contract.sellAbove && invCount > 0) {
      const unitsToSell = invCount;
      const revenue = unitsToSell * currentPrice;

      updated.inventory[commodity] = 0;
      updated.availableCapital += revenue;
      updated.grossEarnings += revenue;
      updated.experience += 25;
      updated.speechBubble = `Sold ${unitsToSell} ${commodity} @ ${currentPrice} MON! 📈`;
      updated.currentTask = `Mandi Merchant: Sold stock for ${revenue.toFixed(1)} MON`;
      balanceDelta += revenue * 0.2;
      logMsg = `📈 ${updated.name} sold wholesale ${commodity} in ${currentLoc} for ${revenue.toFixed(1)} MON!`;
    } else {
      updated.speechBubble = `Evaluating Mandi ${commodity} spreads (Current: ${currentPrice} MON)`;
    }
  }

  // OCCUPATION 2: RICKSHAW PULLER & FREIGHT HAULER (COURIER)
  else if (updated.jobType === 'COURIER') {
    const targetLoc = contract.targetDistrict || 'jama_masjid';

    if (updated.status === 'WORKING') {
      const invCount = updated.inventory[commodity] || 0;

      if (invCount === 0 && currentPrice <= contract.buyBelow && updated.availableCapital >= currentPrice * 3) {
        const units = Math.min(6, Math.floor(updated.availableCapital / currentPrice));
        const cost = units * currentPrice;
        updated.inventory[commodity] = units;
        updated.availableCapital -= cost;
        updated.totalExpenses += cost;
        updated.status = 'TRAVELLING';
        updated.targetLocation = targetLoc;
        updated.speechBubble = `Loaded rickshaw with ${units} ${commodity}! Hauling to ${targetLoc} 🛺`;
        updated.currentTask = `Rickshaw Freight: En route to ${targetLoc}`;
      } else {
        updated.speechBubble = `Waiting for cargo hauling contract at ${currentLoc} mandi...`;
      }
    } else if (updated.status === 'TRAVELLING') {
      updated.location = updated.targetLocation || 'jama_masjid';
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
      updated.speechBubble = `Delivered cargo to ${updated.location}! Freight yield +${netYield.toFixed(1)} MON 🛺`;
      updated.currentTask = `Completed Rickshaw Haul to ${updated.location}`;
      balanceDelta += netYield * 0.25;
      logMsg = `🛺 ${updated.name} hauled ${invCount} ${commodity} to ${updated.location} (+${netYield.toFixed(1)} MON freight).`;
    }
  }

  // OCCUPATION 3: STREET CHAIWALA & VENDOR (CHAIWALA)
  else if (updated.jobType === 'CHAIWALA') {
    const teaSales = Math.floor(Math.random() * 4 + 2);
    const cupPrice = 1.5;
    const revenue = teaSales * cupPrice;

    updated.availableCapital += revenue;
    updated.grossEarnings += revenue;
    updated.experience += 15;
    updated.speechBubble = `Served ${teaSales} cups of Masala Chai (+${revenue.toFixed(1)} MON)! ☕`;
    updated.currentTask = `Roadside Tea Stall: Brewed & served ${teaSales} workers`;
    balanceDelta += revenue * 0.2;
    logMsg = `☕ ${updated.name} served ${teaSales} cups of tea to market coolies (+${revenue.toFixed(1)} MON).`;
  }

  // OCCUPATION 4: ARTISAN & WEAVER (CRAFTSMAN)
  else if (updated.jobType === 'CRAFTSMAN') {
    const yarnCost = 6;
    const invCount = updated.inventory['textiles'] || 0;

    if (invCount < 3 && updated.availableCapital >= yarnCost) {
      updated.availableCapital -= yarnCost;
      updated.totalExpenses += yarnCost;
      updated.inventory['textiles'] = invCount + 2;
      updated.speechBubble = `Bought silk yarn & started loom production! 🧵`;
      updated.currentTask = `Loom Active: Crafting Zari Silks`;
    } else if (invCount > 0) {
      const sariPrice = 22;
      const sales = Math.min(invCount, 2);
      const revenue = sales * sariPrice;

      updated.inventory['textiles'] = invCount - sales;
      updated.availableCapital += revenue;
      updated.grossEarnings += revenue;
      updated.experience += 25;
      updated.speechBubble = `Sold ${sales} handwoven silk saris @ ${sariPrice} MON! 🧵`;
      updated.currentTask = `Artisan Stall: Sold ${sales} silk garments`;
      balanceDelta += revenue * 0.25;
      logMsg = `🧵 ${updated.name} crafted and sold ${sales} handwoven silk saris for ${revenue.toFixed(1)} MON!`;
    }
  }

  // OCCUPATION 5: MANDI HAMMAL & WAREHOUSE LOADER (HAMMAL)
  else if (updated.jobType === 'HAMMAL') {
    const cratesLoaded = Math.floor(Math.random() * 3 + 2);
    const wagePerCrate = 2.5;
    const wageEarned = cratesLoaded * wagePerCrate;

    updated.availableCapital += wageEarned;
    updated.grossEarnings += wageEarned;
    updated.totalWagesPaidOut = (updated.totalWagesPaidOut || 0) + wageEarned;
    updated.experience += 18;
    updated.speechBubble = `Loaded ${cratesLoaded} heavy crates! Daily wage +${wageEarned.toFixed(1)} MON 💪`;
    updated.currentTask = `Mandi Warehouse: Heavy Crate Loading (${cratesLoaded} sacks)`;
    balanceDelta += wageEarned * 0.3;
    logMsg = `💪 ${updated.name} loaded ${cratesLoaded} cargo crates at mandi warehouse (+${wageEarned.toFixed(1)} MON wage).`;
  }

  // OCCUPATION 6: RETAIL SHOPKEEPER
  else if (updated.jobType === 'SHOPKEEPER') {
    const invCount = updated.inventory[commodity] || 0;

    if (invCount < 4 && updated.availableCapital >= currentPrice * 3) {
      const buyCount = 4;
      const cost = buyCount * currentPrice;
      updated.inventory[commodity] = invCount + buyCount;
      updated.availableCapital -= cost;
      updated.totalExpenses += cost;
      updated.speechBubble = `Restocked ${buyCount} ${commodity} for retail stall! 🏪`;
    } else if (invCount > 0) {
      const retailPrice = Math.round(currentPrice * 1.35 * 10) / 10;
      const sales = Math.min(invCount, 2);
      const revenue = sales * retailPrice;

      updated.inventory[commodity] = invCount - sales;
      updated.availableCapital += revenue;
      updated.grossEarnings += revenue;
      updated.experience += 15;
      updated.speechBubble = `Retail sale: ${sales} ${commodity} @ ${retailPrice} MON! 🛒`;
      updated.currentTask = `Retail Stall: Sold ${sales} units`;
      balanceDelta += revenue * 0.2;
    }
  }

  // OCCUPATION 7: COMMODITY BROKER
  else if (updated.jobType === 'BROKER') {
    const khariP = market.districtPrices['khari_baoli'];
    const jamaP = market.districtPrices['jama_masjid'];
    const spread = Math.abs(jamaP - khariP);

    if (spread >= contract.minAcceptableProfit) {
      const commission = Math.round(spread * 2.5 * 10) / 10;
      updated.availableCapital += commission;
      updated.grossEarnings += commission;
      updated.experience += 20;
      updated.speechBubble = `Matched trade contract! Commission +${commission} MON 🤝`;
      updated.currentTask = `Brokered trade spread of ${spread.toFixed(1)} MON`;
      balanceDelta += commission * 0.3;
      logMsg = `🤝 ${updated.name} brokered trade spread of ${spread.toFixed(1)} MON (+${commission} MON commission).`;
    } else {
      updated.speechBubble = `Scanning market spreads... (Current spread: ${spread.toFixed(1)} MON)`;
    }
  }

  // Recalculate net profit & levels
  updated.netProfit = Math.round((updated.grossEarnings - updated.totalExpenses) * 10) / 10;
  if (updated.experience >= updated.level * 100) {
    updated.level += 1;
    updated.efficiency = Math.min(99, updated.efficiency + 3);
    logMsg = `🎉 ${updated.name} (${updated.civilianRole}) leveled up to Level ${updated.level}! Efficiency ${updated.efficiency}%.`;
  }

  updated.lastActionTime = Date.now();

  return {
    updatedAgent: updated,
    playerBalanceDelta: Math.round(balanceDelta * 10) / 10,
    logMessage: logMsg,
  };
}
