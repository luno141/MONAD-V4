// CHAIN REACTION — Agent Skill Specification (SKILL.md) Template

export const DEFAULT_AGENT_SKILL_MD = `# Chain Reaction Autonomous Agent Skill Specification (SKILL.md)
name: Salim the Spice Master
role: TRADER
version: 1.0.0
owner: player-1

## Target Strategy & District Routes
source_district: khari_baoli
target_district: jama_masjid
primary_commodity: spices

## Payload & Capital Constraints
deployment_fee: 5 MON
micro_payload_capital: 15 MON
max_capital_bound: 50 MON

## Execution Rules
buy_below_price: 11 MON
sell_above_price: 15 MON
min_acceptable_profit: 2 MON
reinvest_profit_pct: 80%

## Custom Behavioral Prompt
"Execute high-frequency micro spice arbitrage between Khari Baoli wholesale mandi and Jama Masjid retail district. Minimize transport overhead and return net yield directly to wallet."
`;
