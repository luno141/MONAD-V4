// CHAIN REACTION — Agent Workforce & District Economy Types

export type DistrictId = 'khari_baoli' | 'chandni_chowk' | 'jama_masjid';

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  hindiName: string;
  tagline: string;
  primaryCommodities: string[];
  color: string;
  icon: string;
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

export type AgentJobType = 'TRADER' | 'COURIER' | 'SHOPKEEPER' | 'BROKER';

export type AgentStatus = 'IDLE' | 'WORKING' | 'TRAVELLING' | 'BLOCKED';

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
  level: number;
  experience: number;
  location: DistrictId;
  targetLocation?: DistrictId;
  status: AgentStatus;
  efficiency: number; // percentage e.g. 85
  operatingCost: number; // per tick cost in MON
  deploymentCost: number; // initial deployment cost
  availableCapital: number; // allocated MON capital
  currentTask: string;
  contract: AgentContract;
  inventory: Partial<Record<CommodityType, number>>;
  grossEarnings: number;
  totalExpenses: number;
  netProfit: number;
  speechBubble?: string;
  createdAt: number;
  lastActionTime: number;
}

export interface DistrictEconomyState {
  districts: Record<DistrictId, DistrictInfo>;
  markets: Record<CommodityType, CommodityMarketData>;
  transportCostPerDistance: number;
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
