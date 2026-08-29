// CHAIN REACTION — Multi-District Economy & Arbitrage Engine

import {
  DistrictId,
  DistrictInfo,
  CommodityType,
  CommodityMarketData,
  DistrictEconomyState,
} from '../types/agentTypes';

export const DISTRICTS: Record<DistrictId, DistrictInfo> = {
  khari_baoli: {
    id: 'khari_baoli',
    name: 'Khari Baoli',
    hindiName: 'खारी बाओली',
    tagline: 'Asia’s Largest Spice & Wholesale Hub',
    primaryCommodities: ['spices', 'grain', 'fuel'],
    color: '#D97706', // Amber
    icon: '🌶️',
    laborPool: 450,
    totalWagesPaid: 1250,
    publicTreasury: 3400,
  },
  chandni_chowk: {
    id: 'chandni_chowk',
    name: 'Chandni Chowk',
    hindiName: 'चांदनी चौक',
    tagline: 'Historic Retail & Textile Heart',
    primaryCommodities: ['textiles', 'labor', 'grain'],
    color: '#3B82F6', // Blue
    icon: '🧵',
    laborPool: 680,
    totalWagesPaid: 1890,
    publicTreasury: 4100,
  },
  jama_masjid: {
    id: 'jama_masjid',
    name: 'Jama Masjid Food District',
    hindiName: 'जामा मस्जिद फ़ूड हब',
    tagline: 'Culinary & Hospitality Epicenter',
    primaryCommodities: ['food', 'spices', 'labor'],
    color: '#10B981', // Emerald
    icon: '🍛',
    laborPool: 520,
    totalWagesPaid: 1420,
    publicTreasury: 2950,
  },
};

export const INITIAL_MARKETS: Record<CommodityType, CommodityMarketData> = {
  spices: {
    id: 'spices',
    name: 'Khari Baoli Spices',
    symbol: '🌶️',
    basePrice: 12,
    districtPrices: { khari_baoli: 10, chandni_chowk: 15, jama_masjid: 18 },
    districtSupply: { khari_baoli: 1200, chandni_chowk: 400, jama_masjid: 250 },
    districtDemand: { khari_baoli: 500, chandni_chowk: 600, jama_masjid: 850 },
  },
  grain: {
    id: 'grain',
    name: 'Basmati & Wheat Grain',
    symbol: '🌾',
    basePrice: 8,
    districtPrices: { khari_baoli: 7, chandni_chowk: 9, jama_masjid: 11 },
    districtSupply: { khari_baoli: 1500, chandni_chowk: 600, jama_masjid: 300 },
    districtDemand: { khari_baoli: 400, chandni_chowk: 500, jama_masjid: 900 },
  },
  textiles: {
    id: 'textiles',
    name: 'Silk & Zari Textiles',
    symbol: '🧵',
    basePrice: 20,
    districtPrices: { khari_baoli: 24, chandni_chowk: 17, jama_masjid: 22 },
    districtSupply: { khari_baoli: 200, chandni_chowk: 1100, jama_masjid: 350 },
    districtDemand: { khari_baoli: 450, chandni_chowk: 500, jama_masjid: 600 },
  },
  food: {
    id: 'food',
    name: 'Prepared Feast & Sweets',
    symbol: '🍛',
    basePrice: 15,
    districtPrices: { khari_baoli: 18, chandni_chowk: 16, jama_masjid: 13 },
    districtSupply: { khari_baoli: 300, chandni_chowk: 450, jama_masjid: 1400 },
    districtDemand: { khari_baoli: 600, chandni_chowk: 700, jama_masjid: 800 },
  },
  fuel: {
    id: 'fuel',
    name: 'Kerosene & Charcoal',
    symbol: '⛽',
    basePrice: 10,
    districtPrices: { khari_baoli: 9, chandni_chowk: 11, jama_masjid: 13 },
    districtSupply: { khari_baoli: 900, chandni_chowk: 500, jama_masjid: 300 },
    districtDemand: { khari_baoli: 350, chandni_chowk: 450, jama_masjid: 700 },
  },
  labor: {
    id: 'labor',
    name: 'Mandi Workforce & Coolies',
    symbol: '🛠️',
    basePrice: 14,
    districtPrices: { khari_baoli: 16, chandni_chowk: 13, jama_masjid: 15 },
    districtSupply: { khari_baoli: 400, chandni_chowk: 950, jama_masjid: 600 },
    districtDemand: { khari_baoli: 750, chandni_chowk: 450, jama_masjid: 700 },
  },
};

export const DISTANCE_MATRIX: Record<DistrictId, Record<DistrictId, number>> = {
  khari_baoli: { khari_baoli: 0, chandni_chowk: 1.5, jama_masjid: 2.8 },
  chandni_chowk: { khari_baoli: 1.5, chandni_chowk: 0, jama_masjid: 1.8 },
  jama_masjid: { khari_baoli: 2.8, chandni_chowk: 1.8, jama_masjid: 0 },
};

export function getTransportCost(from: DistrictId, to: DistrictId): number {
  const dist = DISTANCE_MATRIX[from][to];
  return Math.round(dist * 0.5 * 10) / 10;
}

export interface ArbitrageOpportunity {
  id: string;
  commodity: CommodityType;
  sourceDistrict: DistrictId;
  targetDistrict: DistrictId;
  buyPrice: number;
  sellPrice: number;
  profitMargin: number;
  distance: number;
  transportCost: number;
  netProfit: number;
  roiPct: number;
}

export function scanArbitrageOpportunities(
  economy: DistrictEconomyState
): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];
  const districtIds: DistrictId[] = ['khari_baoli', 'chandni_chowk', 'jama_masjid'];

  Object.values(economy.markets).forEach((market) => {
    for (let i = 0; i < districtIds.length; i++) {
      for (let j = 0; j < districtIds.length; j++) {
        if (i === j) continue;
        const source = districtIds[i];
        const target = districtIds[j];

        const buyP = market.districtPrices[source];
        const sellP = market.districtPrices[target];

        if (sellP > buyP) {
          const distance = DISTANCE_MATRIX[source][target];
          const transportCost = getTransportCost(source, target);
          const rawProfit = sellP - buyP;
          const netP = Math.round((rawProfit - transportCost) * 10) / 10;
          const roi = Math.round((netP / buyP) * 100);

          if (netP > 0.5) {
            opportunities.push({
              id: `${market.id}-${source}-${target}`,
              commodity: market.id,
              sourceDistrict: source,
              targetDistrict: target,
              buyPrice: buyP,
              sellPrice: sellP,
              profitMargin: rawProfit,
              distance,
              transportCost,
              netProfit: netP,
              roiPct: roi,
            });
          }
        }
      }
    }
  });

  return opportunities.sort((a, b) => b.netProfit - a.netProfit);
}

export function tickDistrictEconomy(prev: DistrictEconomyState): DistrictEconomyState {
  const nextMarkets = { ...prev.markets };

  Object.keys(nextMarkets).forEach((key) => {
    const comKey = key as CommodityType;
    const m = { ...nextMarkets[comKey] };
    const nextPrices = { ...m.districtPrices };

    (Object.keys(nextPrices) as DistrictId[]).forEach((dId) => {
      const delta = (Math.random() - 0.49) * 0.4;
      nextPrices[dId] = Math.max(3, Math.round((nextPrices[dId] + delta) * 10) / 10);
    });

    m.districtPrices = nextPrices;
    nextMarkets[comKey] = m;
  });

  return {
    ...prev,
    markets: nextMarkets,
  };
}
