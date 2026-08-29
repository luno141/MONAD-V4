// CHAIN REACTION — Game Constants (Purani Dilli Edition)
// Source of truth for onchain economic values stays deterministic.

export const RESOURCES = {
  ENERGY: { id: 0, name: 'Katiya Line', symbol: '⚡', color: 'saffron' },
  STEEL: { id: 1, name: 'Sarkari Files', symbol: '📁', color: 'postal' },
  FOOD: { id: 2, name: 'Chole Bhature', symbol: '🍛', color: 'amber' },
} as const;

export const INITIAL_ECONOMY = {
  ENERGY: { price: 10, supply: 1000, demand: 500 },
  STEEL: { price: 15, supply: 800, demand: 400 },
  FOOD: { price: 8, supply: 1200, demand: 600 },
} as const;

export const INITIAL_PLAYER = {
  credits: 1000,
  factories: 1,
  miners: 1,
  energy: 20,
  steel: 20,
  food: 20,
} as const;

export const FACTORY_COST = {
  credits: 200,
  steel: 20,
  energy: 10,
} as const;

export const BLACKOUT_COOLDOWN_SECONDS = 60;

export const BLACKOUT_EFFECTS = {
  energySupplyMultiplier: 20, // 20% (reduces by 80%)
  energyPriceMultiplier: 160, // 160% (+60%)
  steelPriceMultiplier: 130, // 130% (+30%)
  factoryEfficiency: 70, // 70% (-30%)
  energyDemandIncrease: 200,
  steelDemandIncrease: 100,
} as const;

export const CASCADE_STEPS = [
  { label: 'CHAKKA JAM INITIATED! 🛑', type: 'event' as const },
  { label: 'KATTYA POWER CUT (-80%) ⚡', type: 'danger' as const },
  { label: 'BLACK MARKET KATYA +60% 📈', type: 'danger' as const },
  { label: 'THEKA EFFICIENCY -30% 🍺', type: 'warning' as const },
  { label: 'SARKARI FILE COST +30% 📄', type: 'warning' as const },
  { label: 'PURANI DILLI MARKET UPDATED 📜', type: 'success' as const },
] as const;

export const MONAD_CONFIG = {
  chainId: 10143,
  name: 'Monad Testnet',
  rpc: 'https://testnet-rpc.monad.xyz',
  explorer: 'https://testnet.monadvision.com',
  currency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
} as const;

// MCD (Purani Dilli Municipal Body) decision rules
export const MONA_CORP = {
  name: 'MCD (Dilli Corp)',
  sellSteelThreshold: 20,
  sellEnergyThreshold: 15,
  buildFactoryThreshold: 15, // when steel price <= this
  buildFactoryCreditsRequired: 200,
} as const;
