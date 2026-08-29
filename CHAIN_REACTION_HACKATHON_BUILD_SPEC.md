# CHAIN REACTION — Hackathon Build Specification

## 0. Purpose

Build a small, working Web3 game/demo called **CHAIN REACTION** for a Monad hackathon.

Core pitch:

> An autonomous onchain economy where one player action can trigger a cascade of economic changes.

This is a **24-hour hackathon MVP**, not a full MMO.

The goal is a polished 3-minute demo with real Monad transactions.

---

# 1. NON-NEGOTIABLE SCOPE

## Must exist

1. Wallet connection
2. Monad testnet connection
3. Three resources:
   - Energy
   - Steel
   - Food
4. Onchain resource state
5. Player actions:
   - Buy resource
   - Sell resource
   - Build factory
   - Activate Blackout
6. Blackout must modify multiple economic values
7. UI must visualize the cascade
8. Onchain event log
9. One autonomous simulated corporation called **MONA Corp**
10. At least one MONA Corp action must be an actual blockchain transaction
11. Transaction hashes/links must be visible in the UI
12. A polished dark futuristic dashboard

## Explicitly NOT building

- NFT system
- ERC-20 tokens
- DAO
- governance
- staking
- lending
- bridges
- marketplace
- PvP combat
- authentication system
- account database
- multiplayer backend
- complex AI agent
- real-money economy
- production tokenomics
- mobile app
- social login
- unnecessary third-party APIs

If a feature is not required above, DO NOT add it.

---

# 2. NETWORK FACTS

Use official Monad documentation as the source of truth.

Current Monad testnet configuration:

- Network: Monad Testnet
- Chain ID: 10143
- Native currency: MON
- RPC: https://testnet-rpc.monad.xyz
- Explorer: https://testnet.monadvision.com

Monad is EVM-compatible, so standard Solidity/EVM tooling is appropriate.

IMPORTANT:
Never invent a Monad RPC, chain ID, explorer URL, SDK, API or package.
If a current network detail is uncertain, check the official Monad documentation before changing code.

Official docs:
https://docs.monad.xyz/

---

# 3. FIXED TECH STACK

Use:

- Next.js
- TypeScript
- Tailwind CSS
- Solidity
- Foundry OR Hardhat, but choose ONE and keep it
- viem
- wagmi

Do not switch frameworks after implementation begins.

Preferred structure:

```text
chain-reaction/
├── app/
├── components/
├── lib/
│   ├── config/
│   ├── contracts/
│   └── blockchain/
├── contracts/
├── script/
├── test/
├── public/
├── .env.local
└── README.md
```

Do not create a second frontend framework.
Do not create a separate backend unless it is required for MONA Corp automation.

---

# 4. GAME STATE

The economy starts with these EXACT values.

| Resource | Price | Supply | Demand |
|---|---:|---:|---:|
| Energy | 10 | 1000 | 500 |
| Steel | 15 | 800 | 400 |
| Food | 8 | 1200 | 600 |

Use integer/fixed-point arithmetic onchain.

Do not use floating point.

Prices can be displayed with decimals in the frontend if desired, but contract storage must remain deterministic.

---

# 5. PLAYER STATE

Each wallet has:

```text
credits
factories
miners
energy
steel
food
```

Initial demo values:

```text
credits = 1000
factories = 1
miners = 1
energy = 20
steel = 20
food = 20
```

Do not introduce additional player attributes unless absolutely necessary.

---

# 6. ECONOMIC RULES

Keep the rules deterministic.

## Buy

Buying resource X:

```text
cost = currentPrice × quantity
```

Then:

```text
player credits -= cost
player resource += quantity
resource supply -= quantity
resource demand += quantity / 2
```

## Sell

Selling resource X:

```text
revenue = currentPrice × quantity
```

Then:

```text
player credits += revenue
player resource -= quantity
resource supply += quantity
resource demand -= quantity / 2
```

Prevent negative balances.

Transactions must revert when the player lacks sufficient resources/credits.

---

# 7. BUILD FACTORY

Cost:

```text
200 credits
20 steel
10 energy
```

On success:

```text
credits -= 200
steel -= 20
energy -= 10
factories += 1
```

Factory effect:

```text
steel demand += 10
energy demand += 15
```

Emit:

```solidity
FactoryBuilt(address player)
```

---

# 8. BLACKOUT EVENT

This is the primary demo feature.

Only allow one active blackout at a time.

When activated:

```text
energy supply = energy supply × 20%
energy price = energy price × 160%
steel price = steel price × 130%
factory efficiency = factory efficiency × 70%
```

For simplicity, store factory efficiency as an integer percentage.

Initial:

```text
factoryEfficiency = 100
```

After blackout:

```text
factoryEfficiency = 70
```

Also increase energy demand:

```text
energy demand += 200
```

And steel demand:

```text
steel demand += 100
```

Emit:

```solidity
WorldEvent(
    "BLACKOUT",
    msg.sender
)
```

The frontend should detect this event and animate the cascade.

---

# 9. BLACKOUT COOLDOWN

Cooldown:

```text
60 seconds
```

Do not create a complex event scheduler.

Contract should simply record:

```text
lastBlackoutTimestamp
```

and reject another blackout until:

```text
block.timestamp >= lastBlackoutTimestamp + 60
```

---

# 10. RESET ECONOMY

For hackathon demos, include:

```text
Reset Economy
```

This should be owner-only or testnet-only.

Reset values to the exact initial state:

```text
Energy: price 10, supply 1000, demand 500
Steel:  price 15, supply 800, demand 400
Food:   price 8,  supply 1200, demand 600

factoryEfficiency = 100
```

This exists purely so the demo can be repeated reliably.

Do not expose unsafe reset functionality on a production deployment.

---

# 11. CONTRACT ARCHITECTURE

Use as few contracts as possible.

Preferred:

```text
Economy.sol
```

One contract is enough for the MVP.

It should contain:

```text
Resource state
Player state
buyResource()
sellResource()
buildFactory()
activateBlackout()
resetEconomy()
view functions
events
```

Do NOT split this into many contracts unless a technical blocker requires it.

---

# 12. REQUIRED EVENTS

The contract must emit:

```solidity
event ResourceBought(
    address indexed player,
    uint8 resource,
    uint256 quantity,
    uint256 cost
);

event ResourceSold(
    address indexed player,
    uint8 resource,
    uint256 quantity,
    uint256 revenue
);

event FactoryBuilt(
    address indexed player
);

event WorldEvent(
    string eventName,
    address indexed activator
);
```

Do not rename these events once the frontend is connected.

---

# 13. RESOURCE ENUM

Use exactly:

```solidity
enum Resource {
    ENERGY,
    STEEL,
    FOOD
}
```

Do not add resources.

---

# 14. FRONTEND PAGES

Only one main page is required.

Dashboard sections:

```text
HEADER
  CHAIN REACTION
  Wallet
  Network status

ECONOMY
  Energy
  Steel
  Food

PLAYER
  Credits
  Factories
  Miners
  Inventory

ACTIONS
  Buy
  Sell
  Build Factory

WORLD EVENT
  Blackout button

CASCADE VISUALIZATION
  Event
  Energy change
  Factory change
  Steel change

MONA CORP
  Current strategy
  Current action
  Transaction

ACTIVITY
  Recent blockchain events
```

---

# 15. UI DESIGN

Visual direction:

- dark background
- black/near-black panels
- futuristic financial terminal
- restrained neon accents
- large numbers
- charts
- transaction status indicators
- animated cascade
- monospace elements for blockchain data

Do not turn this into a cartoon game.

It should look like:

```text
Bloomberg terminal
+
cyberpunk command center
+
onchain game
```

---

# 16. CASCADE ANIMATION

When Blackout confirms:

Show this sequence:

```text
BLACKOUT ACTIVATED
        ↓
ENERGY SUPPLY -80%
        ↓
ENERGY PRICE +60%
        ↓
FACTORY EFFICIENCY -30%
        ↓
STEEL PRICE +30%
        ↓
MARKET STATE UPDATED
```

Animation duration:

Approximately 2–4 seconds.

The animation is UI only.

The actual economic values must come from the blockchain.

Never fake blockchain values in the UI after transaction confirmation.

---

# 17. MONA CORP

MONA Corp is a simple autonomous corporation.

It is NOT a sophisticated AI agent.

Use deterministic rules.

## Strategy

```text
IF steel price >= 20:
    sell steel

IF energy price >= 15:
    sell energy

IF steel price <= 15 AND credits >= 200:
    build factory

IF blackout occurs:
    attempt to buy steel
```

The first working implementation can use a simple script/worker.

Do not introduce an LLM into the economic decision loop.

Do not make MONA Corp depend on an external AI API.

---

# 18. MONA CORP TRANSACTION

The hackathon demo must show at least one real MONA Corp transaction.

The flow:

```text
Read blockchain state
        ↓
Evaluate deterministic rule
        ↓
Select action
        ↓
Submit transaction
        ↓
Wait for confirmation
        ↓
Show transaction hash
        ↓
Update dashboard
```

If automation becomes a blocker, implement a visible:

```text
RUN MONA CORP
```

button that performs the same deterministic decision.

This is acceptable for the MVP.

Do not spend hours building infrastructure for autonomous agents.

---

# 19. DATA SOURCE RULE

There are only two sources of truth.

## Blockchain

Source of truth for:

- prices
- supply
- demand
- player state
- factories
- blackout state
- transaction results
- events

## Local constants

Source of truth for:

- labels
- resource names
- UI descriptions
- initial values
- game rules

Never create a second copy of economic state in a backend database.

---

# 20. ANTI-HALLUCINATION RULES FOR ANTIGRAVITY

These rules are mandatory.

### Rule 1

Do not invent APIs.

### Rule 2

Do not invent Monad configuration.

### Rule 3

Do not replace working code unless the current task requires it.

### Rule 4

Do not refactor unrelated files.

### Rule 5

Do not add dependencies without explicit approval.

### Rule 6

Do not change contract function names after frontend integration.

### Rule 7

Do not change economic constants.

### Rule 8

Do not add game mechanics.

### Rule 9

Do not redesign the architecture mid-project.

### Rule 10

After every milestone, run tests before continuing.

### Rule 11

If something is unclear, STOP and report the ambiguity instead of guessing.

### Rule 12

Never silently change an existing behavior to make a new feature work.

---

# 21. CHANGE CONTROL

Before modifying any existing file:

1. Identify why the modification is necessary.
2. State which requirement it satisfies.
3. Modify only the minimum required code.
4. Do not modify unrelated files.
5. Run the existing tests.
6. Report exactly what changed.

Every response from the coding agent should end with:

```text
FILES CHANGED:
- ...

FILES ADDED:
- ...

FILES DELETED:
- ...

TESTS:
- ...

NEW DEPENDENCIES:
- ...

BLOCKERS:
- ...
```

If no files were changed, say:

```text
FILES CHANGED: none
```

---

# 22. MILESTONE SYSTEM

Do NOT ask the agent to build everything at once.

Build in these milestones.

## M0 — Project skeleton

Deliver:

- Next.js app
- Tailwind
- TypeScript
- basic dashboard
- no blockchain

Acceptance:

```text
npm run build
```

passes.

---

## M1 — Wallet

Deliver:

- wagmi
- viem
- Monad testnet configuration
- wallet connection
- network detection

Acceptance:

- wallet connects
- wrong network is detected
- Monad testnet is displayed

---

## M2 — Contract

Deliver:

- Economy.sol
- tests
- deployment script

Acceptance:

- contract compiles
- tests pass
- deployment succeeds on Monad testnet

---

## M3 — Read blockchain

Deliver:

- prices
- supply
- demand
- player state

Acceptance:

Dashboard values come from contract reads.

No economic values should be hardcoded into the rendered UI.

---

## M4 — Player actions

Deliver:

- buy
- sell
- factory

Acceptance:

Every action creates a real Monad transaction.

---

## M5 — Blackout

Deliver:

- activateBlackout()
- cooldown
- WorldEvent
- cascade animation

Acceptance:

A real transaction changes multiple onchain values.

---

## M6 — MONA Corp

Deliver:

- deterministic strategy
- one real transaction
- activity display

Acceptance:

MONA Corp can react to market state.

---

## M7 — Polish

Deliver:

- animations
- charts
- transaction links
- loading states
- errors
- responsive layout

Do not add features.

---

# 23. ACCEPTANCE TEST

The project is finished when this exact sequence works.

### Test 1

Connect wallet.

### Test 2

Confirm Monad Testnet.

### Test 3

Dashboard loads:

```text
Energy $10
Steel $15
Food $8
```

### Test 4

Buy 10 steel.

Transaction confirms.

Dashboard updates.

### Test 5

Build a factory.

Transaction confirms.

Factory count increases.

### Test 6

Activate Blackout.

Transaction confirms.

Values change:

```text
Energy price: 10 → 16
Steel price: 15 → 19
Factory efficiency: 100 → 70
```

### Test 7

Cascade animation plays.

### Test 8

MONA Corp reacts.

### Test 9

MONA Corp transaction confirms.

### Test 10

Transaction hashes are visible.

### Test 11

Reset Economy.

### Test 12

Repeat the demo from a clean state.

---

# 24. DEMO SCRIPT

Target duration: 3 minutes.

## Opening

> CHAIN REACTION is an autonomous onchain economy.

Show dashboard.

## Explain

> Every economic state you see comes from Monad.

Show transaction/state data.

## Action

Build a factory.

Explain:

> A factory consumes energy and steel, changing demand across the economy.

## Main moment

Activate:

```text
BLACKOUT
```

Wait for transaction.

Show:

```text
ENERGY +60%
STEEL +30%
FACTORY EFFICIENCY -30%
```

Then show cascade animation.

## Autonomous agent

Run MONA Corp.

Show:

```text
MONA CORP
BLACKOUT DETECTED
BUYING STEEL
```

Show transaction.

## Closing

> One event caused multiple economic reactions, and both human players and autonomous agents can participate in the same onchain economy.

Stop.

---

# 25. WHAT TO CUT IF BEHIND SCHEDULE

Cut in this order:

1. Advanced charts
2. Automated MONA Corp worker
3. Fancy animations
4. Multiple event types
5. Sell UI

Never cut:

- Monad deployment
- wallet
- contract
- Blackout
- onchain state
- real transaction
- cascade visualization

---

# 26. FINAL RULE

The project is successful if:

```text
REAL WALLET
    ↓
REAL MONAD TRANSACTION
    ↓
REAL CONTRACT STATE CHANGE
    ↓
VISIBLE ECONOMIC CASCADE
    ↓
VISIBLE AUTONOMOUS RESPONSE
```

Everything else is decoration.

DO NOT optimize for feature count.

Optimize for one unforgettable working demo.

---

# 27. ANTIGRAVITY WORKFLOW

Give the coding agent ONE milestone prompt at a time.

After each milestone:

1. inspect changes
2. run tests
3. run build
4. manually verify
5. only then continue

Never send all milestone prompts simultaneously.

If the agent proposes an unrelated improvement, reject it.

Use:

> "Not in scope. Do not implement. Continue with the current milestone only."

If the agent wants to change architecture:

> "Do not change architecture. Use the existing architecture and make the minimum modification required."

If the agent is unsure:

> "Do not guess. Stop and report the exact missing information."

---

# 28. SOURCE OF TRUTH

For Monad network information, use the official documentation:

https://docs.monad.xyz/

Verified testnet values for this specification:

```text
Chain ID: 10143
RPC: https://testnet-rpc.monad.xyz
Currency: MON
Explorer: https://testnet.monadvision.com
```

These network values were checked against the official Monad documentation on August 27, 2026.

