// Economic Twin — Client-side Monte Carlo Scenario Simulator
// Runs 1,000 random market futures to estimate investment returns

export interface MarketSnapshot {
  energyPrice: number;
  steelPrice: number;
  foodPrice: number;
  energySupply: number;
  steelSupply: number;
  foodSupply: number;
}

export interface CompanyState {
  name: string;
  cash: number;
  energy: number;
  steel: number;
  food: number;
  thekas: number;
}

export interface SimulationResult {
  simulations: number;
  profitProbability: number;
  averageReturn: number;
  medianReturn: number;
  bestCase: number;
  worstCase: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  distribution: number[]; // bucketed return percentages for histogram
  scenarios: {
    name: string;
    returnPct: number;
    description: string;
  }[];
  recommendation: 'INVEST' | 'HOLD' | 'AVOID';
  confidence: number;
}

// Named stress scenarios
const STRESS_SCENARIOS = [
  { name: 'Chakka Jam (Energy Shock)', energyMult: 1.5, steelMult: 1.1, foodMult: 1.0, prob: 0.15 },
  { name: 'Sarkari File Shortage', energyMult: 1.0, steelMult: 1.5, foodMult: 1.0, prob: 0.10 },
  { name: 'Industrial Boom (Theka Rush)', energyMult: 1.2, steelMult: 1.3, foodMult: 0.9, prob: 0.12 },
  { name: 'MCD Raids', energyMult: 0.8, steelMult: 0.7, foodMult: 1.1, prob: 0.08 },
  { name: 'Monsoon Surplus', energyMult: 0.9, steelMult: 1.0, foodMult: 0.7, prob: 0.10 },
  { name: 'Stable Market', energyMult: 1.0, steelMult: 1.0, foodMult: 1.0, prob: 0.45 },
];

function randomNormal(): number {
  // Box-Muller transform for normally distributed randomness
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function simulateOneRun(
  market: MarketSnapshot,
  company: CompanyState,
  investmentAmount: number
): number {
  // Pick a random scenario weighted by probability
  const roll = Math.random();
  let cumProb = 0;
  let scenario = STRESS_SCENARIOS[5]; // default stable
  for (const s of STRESS_SCENARIOS) {
    cumProb += s.prob;
    if (roll <= cumProb) {
      scenario = s;
      break;
    }
  }

  // Apply scenario shock + random noise
  const energyFuture = market.energyPrice * scenario.energyMult * (1 + randomNormal() * 0.12);
  const steelFuture = market.steelPrice * scenario.steelMult * (1 + randomNormal() * 0.10);
  const foodFuture = market.foodPrice * scenario.foodMult * (1 + randomNormal() * 0.08);

  // Simulate company behavior under future prices
  let simCash = company.cash + investmentAmount;
  let simEnergy = company.energy;
  let simSteel = company.steel;
  let simFood = company.food;

  // Simple deterministic strategy: buy low sell high
  if (energyFuture > market.energyPrice * 1.15 && simEnergy > 5) {
    simCash += simEnergy * 0.3 * energyFuture;
    simEnergy *= 0.7;
  }
  if (steelFuture > market.steelPrice * 1.2 && simSteel > 5) {
    simCash += simSteel * 0.4 * steelFuture;
    simSteel *= 0.6;
  }
  if (energyFuture < market.energyPrice * 0.85 && simCash > 50) {
    const buyAmount = Math.floor(simCash * 0.2 / energyFuture);
    simEnergy += buyAmount;
    simCash -= buyAmount * energyFuture;
  }

  // Calculate portfolio value
  const initialValue = company.cash + investmentAmount
    + company.energy * market.energyPrice
    + company.steel * market.steelPrice
    + company.food * market.foodPrice;

  const finalValue = simCash
    + simEnergy * energyFuture
    + simSteel * steelFuture
    + simFood * foodFuture;

  return (finalValue - initialValue) / initialValue;
}

export function runEconomicTwin(
  market: MarketSnapshot,
  company: CompanyState,
  investmentAmount: number,
  numSimulations: number = 1000
): SimulationResult {
  const returns: number[] = [];

  for (let i = 0; i < numSimulations; i++) {
    returns.push(simulateOneRun(market, company, investmentAmount));
  }

  returns.sort((a, b) => a - b);

  const profitable = returns.filter(r => r > 0).length;
  const profitProbability = profitable / numSimulations;
  const averageReturn = returns.reduce((s, r) => s + r, 0) / numSimulations;
  const medianReturn = returns[Math.floor(numSimulations / 2)];
  const bestCase = returns[returns.length - 1];
  const worstCase = returns[0];

  // Build histogram distribution (20 buckets from -50% to +80%)
  const buckets = 20;
  const minBucket = -0.5;
  const maxBucket = 0.8;
  const bucketSize = (maxBucket - minBucket) / buckets;
  const distribution = new Array(buckets).fill(0);
  for (const r of returns) {
    const idx = Math.min(buckets - 1, Math.max(0, Math.floor((r - minBucket) / bucketSize)));
    distribution[idx]++;
  }
  // Normalize to percentages
  const maxCount = Math.max(...distribution);
  const normalizedDist = distribution.map((c: number) => Math.round((c / maxCount) * 100));

  // Named stress test results
  const scenarios = STRESS_SCENARIOS.slice(0, 5).map(s => {
    // Run a small batch under this specific scenario
    const scenarioReturns: number[] = [];
    for (let i = 0; i < 100; i++) {
      const eP = market.energyPrice * s.energyMult * (1 + randomNormal() * 0.05);
      const sP = market.steelPrice * s.steelMult * (1 + randomNormal() * 0.05);
      const fP = market.foodPrice * s.foodMult * (1 + randomNormal() * 0.05);

      const iv = company.cash + investmentAmount
        + company.energy * market.energyPrice
        + company.steel * market.steelPrice
        + company.food * market.foodPrice;
      const fv = (company.cash + investmentAmount)
        + company.energy * eP
        + company.steel * sP
        + company.food * fP;
      scenarioReturns.push((fv - iv) / iv);
    }
    const avg = scenarioReturns.reduce((a, b) => a + b, 0) / scenarioReturns.length;
    return {
      name: s.name,
      returnPct: Math.round(avg * 1000) / 10,
      description: `${s.name} scenario impact`,
    };
  });

  // Risk assessment
  const volatility = Math.abs(bestCase - worstCase);
  const risk: 'LOW' | 'MEDIUM' | 'HIGH' = volatility > 0.7 ? 'HIGH' : volatility > 0.35 ? 'MEDIUM' : 'LOW';

  // Recommendation
  let recommendation: 'INVEST' | 'HOLD' | 'AVOID';
  let confidence: number;
  if (profitProbability > 0.65 && averageReturn > 0.05) {
    recommendation = 'INVEST';
    confidence = Math.round(profitProbability * 100);
  } else if (profitProbability > 0.45) {
    recommendation = 'HOLD';
    confidence = Math.round(profitProbability * 85);
  } else {
    recommendation = 'AVOID';
    confidence = Math.round((1 - profitProbability) * 90);
  }

  return {
    simulations: numSimulations,
    profitProbability: Math.round(profitProbability * 1000) / 10,
    averageReturn: Math.round(averageReturn * 1000) / 10,
    medianReturn: Math.round(medianReturn * 1000) / 10,
    bestCase: Math.round(bestCase * 1000) / 10,
    worstCase: Math.round(worstCase * 1000) / 10,
    risk,
    distribution: normalizedDist,
    scenarios,
    recommendation,
    confidence,
  };
}
