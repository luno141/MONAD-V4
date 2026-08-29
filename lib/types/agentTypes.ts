// CHAIN REACTION — Working Class Autonomous Civilian Economy Types

export type DistrictId = 'khari_baoli' | 'chandni_chowk' | 'jama_masjid';

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  hindiName: string;
  tagline: string;
  primaryCommodities: string[];
  color: string;
  icon: string;
  laborPool: number;
  totalWagesPaid: number;
  publicTreasury: number;
}

export type CommodityType = 'spices' | 'grain' | 'textiles' | 'food' | 'fuel' | 'labor';

export interface CommodityMarketData {
  id: CommodityType;
  name: string;
  symbol: string;
  districtPrices: Record<DistrictId, number>;
  districtSupply: Record<DistrictId, number>;
  districtDemand: Record<DistrictId, number>;
  basePrice: number;
}

// Working Class Civilian Occupations
export type AgentJobType =
  | 'TRADER'       // Mandi Wholesale Merchant 👳🏽‍♂️
  | 'COURIER'      // Rickshaw Puller & Freight Hauler 🛺
  | 'SHOPKEEPER'   // Retail Stallholder 🏪
  | 'BROKER'       // Commodity Agent / Arbitrageur 🤝
  | 'CHAIWALA'     // Street Tea & Snack Vendor ☕
  | 'CRAFTSMAN'    // Artisan & Textile Weaver 🧵
  | 'HAMMAL';      // Daily Wage Mandi Loader 💪

export type AgentStatus = 'IDLE' | 'WORKING' | 'TRAVELLING' | 'RESTING' | 'BLOCKED';

export interface AgentContract {
  targetCommodity: CommodityType;
  buyBelow: number;
  sellAbove: number;
  maxCapital: number;
  minAcceptableProfit: number;
  sourceDistrict: DistrictId;
  targetDistrict?: DistrictId;
  durationHours: number;
}

export interface Agent {
  id: string;
  ownerPlayerId: string;
  name: string;
  avatar: string;
  jobType: AgentJobType;
  civilianRole: string; // Detailed civilian occupation label
  level: number;
  experience: number;
  location: DistrictId;
  targetLocation?: DistrictId;
  status: AgentStatus;
  efficiency: number; // percentage e.g. 85
  operatingCost: number; // per tick cost in MON
  deploymentCost: number; // initial deployment cost
  availableCapital: number; // allocated MON capital
  energyLevel: number; // 0 to 100
  dailyLivingCost: number; // living expense per cycle
  currentTask: string;
  contract: AgentContract;
  inventory: Partial<Record<CommodityType, number>>;
  grossEarnings: number;
  totalExpenses: number;
  netProfit: number;
  totalWagesPaidOut?: number;
  totalChaiBought?: number;
  speechBubble?: string;
  createdAt: number;
  lastActionTime: number;
}

export interface DistrictEconomyState {
  districts: Record<DistrictId, DistrictInfo>;
  markets: Record<CommodityType, CommodityMarketData>;
  transportCostPerDistance: number;
  totalCivilianWages: number;
  totalChaiTransactions: number;
  totalCargoHauls: number;
  activeEvent?: {
    id: string;
    title: string;
    description: string;
    affectedDistrict?: DistrictId;
    affectedCommodity?: CommodityType;
    priceMultiplier: number;
    demandMultiplier: number;
    durationTicks: number;
  };
}
