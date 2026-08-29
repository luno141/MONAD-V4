# Chain Reaction — Agent Workforce Extension
## Antigravity Implementation Specification

> **Purpose:** Extend the existing Chain Reaction game with player-owned deployable agents.
>
> **Critical constraint:** Preserve the existing Chain Reaction baseline, Old Delhi setting, economy, map, UI direction, and existing gameplay unless a change is explicitly required by this document. Do not redesign unrelated systems.

---

## 1. Existing Game Direction

Chain Reaction is an economic strategy/simulation game set in a stylized, dense Old Delhi-inspired environment.

### Existing principles to preserve

- Old Delhi is the game's economic world.
- Markets, neighborhoods, goods, trade, supply, demand, prices, movement, and player decisions create the gameplay.
- The economy should generate emergent strategy.
- The game should NOT become a Monopoly-style turn-based board game.
- The visual language should remain dense, living, map-like, and spatially readable, inspired by tiny.place.
- AI agents and the old bounty-system concept are NOT being restored as previously proposed.
- The new agent system below is specifically a **player-owned workforce/economic automation system**.

---

# 2. New Feature: Player-Owned Agents

Players can deploy their own agents into the Old Delhi economy.

An agent is a persistent economic worker controlled by a player through configurable instructions.

### Core idea

> Players make strategic decisions. Agents execute economic work.

The player should not need to manually control every individual transaction or movement.

Basic loop:

```text
Player observes economy
        ↓
Player deploys agent
        ↓
Player selects job + location + rules
        ↓
Agent performs economic work
        ↓
Agent generates revenue / costs
        ↓
Economic conditions change
        ↓
Player adapts strategy
```

---

# 3. Agents Must NOT Be Passive Money Printers

Avoid this gameplay pattern:

```text
Buy agent → wait → receive unlimited money
```

Every agent must have economic tradeoffs.

An agent should involve some combination of:

- Deployment cost
- Operating cost
- Capital requirement
- Location
- Job specialization
- Efficiency
- Risk
- Contract/rules
- Market conditions
- Opportunity cost

Players should have to decide whether an agent is worth deploying.

---

# 4. Agent Data Model

Each agent should conceptually contain:

```text
Agent
├── id
├── ownerPlayerId
├── name
├── jobType
├── level
├── experience
├── location
├── status
├── efficiency
├── operatingCost
├── deploymentCost
├── availableCapital
├── currentTask
├── contract
├── earnings
├── expenses
└── createdAt
```

### Suggested statuses

```text
IDLE
WORKING
TRAVELLING
WAITING
BLOCKED
COMPLETED
INACTIVE
```

Do not overcomplicate the first implementation.

---

# 5. Initial Agent Jobs

Start with a small number of meaningful roles.

## 5.1 Trader Agent

Purpose:

- Buys goods when conditions are favorable.
- Sells goods when profitable.
- Exploits price differences between markets.

Example rules:

```text
BUY: spices below ₹80
SELL: spices above ₹110
MAX CAPITAL: ₹1,000
LOCATION: Khari Baoli
```

The agent should make decisions within the limits defined by the player.

---

## 5.2 Courier Agent

Purpose:

- Moves goods/orders between locations.
- Connects markets.
- Creates logistical value.

Example:

```text
FROM: Khari Baoli
TO: Chandni Chowk
CARGO: spices
MINIMUM PROFIT: ₹50
```

Courier profitability should depend on:

- Distance
- Demand
- Transport cost
- Congestion
- Route conditions
- Agent efficiency

---

## 5.3 Shopkeeper Agent

Purpose:

- Operates a player-owned shop/business.
- Buys or receives inventory.
- Sells goods to satisfy local demand.

Revenue should depend on:

```text
local demand
×
available inventory
×
price
×
agent efficiency
```

---

## 5.4 Broker Agent

Purpose:

- Searches for profitable opportunities.
- Connects supply with demand.
- Earns a commission when a successful transaction occurs.

Broker agents should create economic connections rather than simply printing money.

---

# 6. Agent Contracts

Agents should not simply receive a vague command such as:

> "Trade."

Players should define basic operating rules.

A contract can contain:

```text
Job
Location
Target commodity
Buy conditions
Sell conditions
Maximum capital
Minimum acceptable profit
Maximum operating cost
Duration
Optional destination
```

Example:

```yaml
agent:
  job: trader
  location: khari_baoli
  commodity: spices

rules:
  buy_below: 80
  sell_above: 110
  max_capital: 1000
  min_profit: 20

duration:
  hours: 24
```

The exact implementation may differ depending on the existing architecture.

---

# 7. Agent Economics

Every agent needs both income and expenses.

### Income examples

- Trade profit
- Delivery fee
- Shop revenue
- Brokerage commission

### Expenses

- Operating cost
- Transportation
- Inventory acquisition
- Contract costs
- Location/business costs where applicable

The player should see:

```text
Gross Earnings
- Operating Costs
- Transaction Costs
= Net Earnings
```

The UI should prioritize **net economic impact**, not just revenue.

---

# 8. Agent Deployment

Players should have a clear deployment flow:

```text
Select Agent
      ↓
Choose Job
      ↓
Choose Location
      ↓
Set Contract
      ↓
Allocate Capital
      ↓
Confirm Deployment
      ↓
Agent Begins Working
```

Deployment should consume resources where appropriate.

If the player cannot afford the deployment or required working capital, the system should clearly explain why.

---

# 9. Agent Locations

Agents exist physically inside the Old Delhi game world.

Their location matters.

Examples:

- Chandni Chowk
- Khari Baoli
- Sadar Bazaar
- Dariba Kalan
- Jama Masjid
- Other existing markets/neighborhoods already represented in the game

**Do not invent a large number of locations if the current map does not support them.**

Reuse existing map locations wherever possible.

---

# 10. Economy Interaction

This is the most important part of the feature.

Agents must interact with the existing economy rather than operating in an isolated simulation.

For example:

```text
Player A deploys 3 Trader Agents
        ↓
Agents purchase spices
        ↓
Spice demand increases
        ↓
Available supply decreases
        ↓
Market price changes
        ↓
Player B notices the opportunity
        ↓
Player B deploys Courier + Trader Agents
        ↓
Goods move between markets
        ↓
Supply/demand changes again
        ↓
New prices emerge
```

The economy should therefore produce emergent interactions.

---

# 11. Chain Reaction Mechanic

The agent system should strengthen the game's core identity.

The intended loop is:

```text
PLAYER DECISION
      ↓
AGENT DEPLOYMENT
      ↓
RESOURCE MOVEMENT
      ↓
SUPPLY / DEMAND CHANGE
      ↓
PRICE CHANGE
      ↓
OTHER PLAYERS REACT
      ↓
THEIR AGENTS MOVE
      ↓
NEW MARKET CONDITIONS
      ↓
CHAIN REACTION
```

The name "Chain Reaction" should feel mechanically justified by this behavior.

---

# 12. Agent Progression

Agents can gain experience through successful work.

Keep progression lightweight.

Possible progression:

```text
Level 1 → Level 2 → Level 3 → ...
```

Experience can improve:

- Transaction speed
- Transport efficiency
- Operating efficiency
- Reliability
- Access to better contracts

Avoid turning agents into a large RPG/stat-management system.

The game is primarily an economic strategy game.

---

# 13. Risk and Failure

Agents should not be perfectly deterministic.

Their results can be influenced by existing economic conditions.

Examples:

### Market congestion

```text
Transport costs increase
```

### Commodity shortage

```text
Commodity price rises
```

### Market boom

```text
Demand increases
```

### Route disruption

```text
Courier becomes delayed
```

### High local demand

```text
Shopkeeper revenue increases
```

These should preferably emerge from the simulation instead of feeling like arbitrary arcade modifiers.

---

# 14. Agent Dashboard

Add an agent management interface without replacing the existing UI.

The player should be able to see:

```text
MY AGENTS

Agent Name
Job
Location
Status
Current Task
Revenue
Costs
Net Profit
Efficiency
```

Example:

```text
Rafi
Trader
Khari Baoli
WORKING
Spice trade
₹240 revenue
₹70 costs
+₹170 net
Efficiency 82%
```

The dashboard should make it easy to answer:

1. What are my agents doing?
2. Where are they?
3. Are they profitable?
4. What are they currently carrying/working on?
5. Should I change their contract?
6. Should I move or deactivate them?

---

# 15. Map Visualization

Agents should be visible in the world.

Do not clutter the map with huge UI elements.

Use lightweight visual indicators.

Examples:

- Small agent marker
- Job icon
- Player ownership indicator
- Movement indicator
- Working/idle state

The map should still feel like a living Old Delhi economic environment.

The tiny.place-inspired density and spatial character should remain intact.

---

# 16. Player Ownership

Agents belong to players.

A player should only be able to:

- View their own agents in detail
- Configure their own agents
- Deploy their own agents
- Allocate their own capital
- Modify their own contracts
- Stop their own agents

Other players may be able to observe public economic activity depending on the existing game's information model.

Do not expose private configuration unless the current game design already allows it.

---

# 17. Agent Lifecycle

Basic lifecycle:

```text
AVAILABLE
   ↓
DEPLOYED
   ↓
WORKING
   ↓
EARNING
   ↓
PLAYER ADJUSTS / AGENT COMPLETES TASK
   ↓
WORKING or IDLE
```

If an agent becomes unprofitable, the player should be able to:

- Pause it
- Change its contract
- Move it
- Reassign its job where supported
- Withdraw it

Do not permanently delete agents from the game unless that behavior already exists in the baseline.

---

# 18. Anti-Exploitation Rules

The system should prevent trivial economic exploits.

Potential safeguards:

- Operating costs
- Deployment limits
- Capital requirements
- Transaction fees
- Market capacity
- Diminishing efficiency where appropriate
- Contract constraints
- Existing player/economy limits

Do not add arbitrary cooldowns simply to slow the player down.

Every restriction should have an economic/gameplay justification.

---

# 19. Multiplayer / Economic Interaction

The agent system should create competition without requiring direct combat.

Players compete through:

- Better market predictions
- Better agent placement
- Better contracts
- Faster logistics
- Better capital allocation
- Supply control
- Demand exploitation
- Economic timing

The strongest player should not simply be the player with the most agents.

A player with fewer, better-positioned agents should be capable of outperforming a player with many inefficient agents.

---

# 20. UI Principles

Preserve the existing UI style.

Do not create a generic dashboard-heavy SaaS interface.

The experience should feel like:

> **A living Old Delhi market that happens to contain a sophisticated economic simulation.**

Prioritize:

- Map
- Markets
- Goods
- Prices
- Agent activity
- Economic signals
- Player decisions

Avoid unnecessary:

- Modal overload
- Excessive graphs
- Huge stat panels
- RPG-style menus
- Decorative complexity

---

# 21. Notifications / Economic Feedback

Agents should provide useful feedback.

Examples:

```text
Your Trader bought 8 units of spices.
```

```text
Your Courier completed a delivery.
Net profit: ₹64
```

```text
Your Shopkeeper is running low on inventory.
```

```text
Your Trader's contract is no longer profitable.
```

```text
Demand for spices increased in Chandni Chowk.
```

Notifications should help the player make decisions rather than simply spam activity logs.

---

# 22. First Implementation Scope

For the first playable implementation, DO NOT build everything above.

Implement the smallest complete version:

### Phase 1

1. Agent entity/data model
2. Agent ownership
3. Agent deployment
4. 2–3 job types
5. Location assignment
6. Simple contracts
7. Operating costs
8. Earnings
9. Net profit calculation
10. Agent dashboard
11. Basic map markers
12. Integration with existing supply/demand economy

Recommended initial jobs:

```text
Trader
Courier
Shopkeeper
```

---

# 23. Phase 2

After Phase 1 works:

- Agent experience
- Efficiency progression
- More contract conditions
- More locations
- More economic interactions
- Better visualization
- Economic event integration
- More sophisticated routing
- Agent performance history

---

# 24. Phase 3 — Optional

Only build these if the core game remains fun:

- Agent hiring/marketplace
- Agent leasing
- Player-to-player agent contracts
- Specialized agents
- Advanced automation rules
- Deeper labor economy

These are NOT required for the first playable version.

---

# 25. Important Architectural Rule

Before implementing anything:

### Inspect the existing Chain Reaction codebase.

Identify:

```text
Existing economy system
Existing player system
Existing map/location system
Existing market system
Existing resource/goods system
Existing transaction system
Existing UI architecture
Existing game loop
Existing persistence/state system
```

Then extend those systems.

### Do NOT:

- Replace the economy
- Replace the map
- Rewrite the game loop
- Replace the existing UI framework
- Introduce a new backend architecture unnecessarily
- Add an unrelated AI framework
- Convert the game into turn-based gameplay
- Reintroduce the old bounty system
- Build an LLM-powered autonomous agent system unless explicitly requested later

The agents are **game entities**, not chatbot characters.

---

# 26. Recommended Technical Abstraction

Conceptually:

```text
Player
  |
  └── owns → Agent[]
                  |
                  ├── Job
                  ├── Location
                  ├── Contract
                  ├── Capital
                  └── Performance
```

The agent interacts with existing services:

```text
Agent
 ↓
Economy
 ↓
Market
 ↓
Inventory
 ↓
Transactions
 ↓
Supply / Demand
 ↓
Prices
```

The agent should use the existing economy APIs/services wherever possible.

---

# 27. Agent Decision Engine

Do NOT use an LLM for normal agent behavior.

Use deterministic game logic first.

Example:

```text
if current_price <= buy_threshold:
    buy()

if current_price >= sell_threshold:
    sell()

if expected_profit < minimum_profit:
    wait()

if operating_cost > expected_revenue:
    pause_or_notify()
```

This makes the game:

- Predictable enough to strategize around
- Cheap to run
- Easy to debug
- Reproducible
- Scalable

If intelligent/LLM behavior is explored later, it should be an optional layer on top of this deterministic system.

---

# 28. Economic Transparency

Players need enough information to understand WHY an agent made money or lost money.

For every completed task, make the result explainable.

Example:

```text
Trader Result

Bought:
10 × Spices @ ₹72
Cost: ₹720

Sold:
10 × Spices @ ₹108
Revenue: ₹1,080

Operating cost: ₹45
Transaction cost: ₹20

NET PROFIT: ₹295
```

This makes the economy learnable.

---

# 29. Success Criteria

The feature is successful if:

### A player can:

- Deploy an agent
- Give it a useful economic job
- Configure basic rules
- Place it in an existing Old Delhi location
- See it work
- Earn or lose money
- Understand its performance
- Change its strategy

### And importantly:

One player's agent activity should be capable of affecting the shared economy and creating opportunities/problems for other players.

That is the actual **Chain Reaction**.

---

# 30. Final Design Principle

Do not think of this as:

> "Add AI workers."

Think of it as:

> **"Give players an economic workforce that lets their decisions propagate through the Old Delhi market."**

The player is the strategist.

The agent is the executor.

The market is the battlefield.

Supply and demand are the rules.

And the resulting economic changes create the chain reaction.

---

## Antigravity Instruction

Implement this feature as an extension to the existing Chain Reaction project.

**Preserve the current baseline unless a modification is explicitly required.**

First inspect the existing architecture and identify the smallest integration points.

Then implement Phase 1 only.

Do not prematurely build Phase 2 or Phase 3 systems.

Do not replace existing systems merely to make implementation easier.

After implementation, verify that:

1. Existing gameplay still works.
2. Existing economy still works.
3. Agents can be deployed by players.
4. Agents can perform economic jobs.
5. Agents generate real costs and earnings.
6. Agent actions affect the existing economy.
7. Players can inspect and modify their agents.
8. The game remains real-time/economic rather than becoming turn-based.
9. The Old Delhi visual identity remains intact.
10. The agent feature feels like a natural part of Chain Reaction rather than a separate minigame.
