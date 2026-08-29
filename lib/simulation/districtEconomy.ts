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
  },
  chandni_chowk: {
    id: 'chandni_chowk',
    name: 'Chandni Chowk',
    hindiName: 'चांदनी चौक',
    tagline: 'Historic Retail & Textile Heart',
    primaryCommodities: ['textiles', 'labor', 'grain'],
    color: '#3B82F6', // Blue
    icon: '🧵',
  },
  jama_masjid: {
    id: 'jama_masjid',
    name: 'Jama Masjid Food District',
    hindiName: 'जामा मस्जिद फ़ूड हब',
    tagline: 'Culinary & Hospitality Epicenter',
    primaryCommodities: ['food', 'spices', 'labor'],
    color: '#10B981', // Emerald
    icon: '🍛',
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

export function getTransportCost(from: DistrictId, to: DistrictId, baseRate = 0.5): number {
  const dist = DISTANCE_MATRIX[from][to];
  return Math.round(dist * baseRate * 10) / 10;
}

export interface ArbitrageOpportunity {
  commodity: CommodityType;
  commodityName: string;
  symbol: string;
  sourceDistrict: DistrictId;
  targetDistrict: DistrictId;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  transportCost: number;
  netSpread: number;
  roiPct: number;
}

export function findArbitrageOpportunities(
  state: DistrictEconomyState
): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];
  const districts: DistrictId[] = ['khari_baoli', 'chandni_chowk', 'jama_masjid'];

  Object.values(state.markets).forEach((market) => {
    districts.forEach((from) => {
      districts.forEach((to) => {
        if (from === to) return;
        const buyPrice = market.districtPrices[from];
        const sellPrice = market.districtPrices[to];
        const transportCost = getTransportCost(from, to, state.transportCostPerDistance);
        const spread = sellPrice - buyPrice;
        const netSpread = spread - transportCost;

        if (netSpread > 0.5) {
          const roiPct = Math.round((netSpread / buyPrice) * 100);
          opportunities.push({
            commodity: market.id,
            commodityName: market.name,
            symbol: market.symbol,
            sourceDistrict: from,
            targetDistrict: to,
            buyPrice,
            sellPrice,
            spread: Math.round(spread * 10) / 10,
            transportCost,
            netSpread: Math.round(netSpread * 10) / 10,
            roiPct,
          });
        }
      });
    });
  });

  return opportunities.sort((a, b) => b.netSpread - a.netSpread);
}

export function calculateDistrictPrice(
  basePrice: number,
  supply: number,
  demand: number,
  eventMultiplier = 1.0
): number {
  const ratio = Math.max(0.2, Math.min(5.0, demand / Math.max(1, supply)));
  const calculated = basePrice * Math.sqrt(ratio) * eventMultiplier;
  return Math.max(1, Math.round(calculated * 10) / 10);
}

export function tickDistrictEconomy(
  state: DistrictEconomyState
): DistrictEconomyState {
  const nextMarkets: Record<CommodityType, CommodityMarketData> = { ...state.markets };
  const districts: DistrictId[] = ['khari_baoli', 'chandni_chowk', 'jama_masjid'];

  Object.keys(nextMarkets).forEach((key) => {
    const commKey = key as CommodityType;
    const market = { ...nextMarkets[commKey] };
    const nextPrices = { ...market.districtPrices };
    const nextSupply = { ...market.districtSupply };
    const nextDemand = { ...market.districtDemand };

    districts.forEach((dId) => {
      // Natural organic oscillation +/- 3%
      const supplyDelta = (Math.random() - 0.48) * 0.05;
      const demandDelta = (Math.random() - 0.48) * 0.05;

      nextSupply[dId] = Math.max(50, Math.round(nextSupply[dId] * (1 + supplyDelta)));
      nextDemand[dId] = Math.max(50, Math.round(nextDemand[dId] * (1 + demandDelta)));

      let eventMult = 1.0;
      if (
        state.activeEvent &&
        (!state.activeEvent.affectedDistrict || state.activeEvent.affectedDistrict === dId) &&
        (!state.activeEvent.affectedCommodity || state.activeEvent.affectedCommodity === commKey)
      ) {
        eventMult = state.activeEvent.priceMultiplier;
      }

      nextPrices[dId] = calculateDistrictPrice(
        market.basePrice,
        nextSupply[dId],
        nextDemand[dId],
        eventMult
      );
    });

    nextMarkets[commKey] = {
      ...market,
      districtPrices: nextPrices,
      districtSupply: nextSupply,
      districtDemand: nextDemand,
    };
  });

  return {
    ...state,
    markets: nextMarkets,
  };
}
