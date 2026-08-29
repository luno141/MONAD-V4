# CHAIN REACTION — GAMEPLAY & MECHANICS BIBLE

> **Purpose:** This document is the single source of truth for the gameplay, economy, world behavior, and visual direction of Chain Reaction.
>
> **Important for Antigravity:** This document describes WHAT the game is. Do not invent new mechanics, redesign the core loop, add unrelated systems, or turn this into a generic city-builder. If something is not specified here, prefer the simplest implementation that supports the existing mechanics.

---

# 1. GAME IDENTITY

## Name
**Chain Reaction**

## Core fantasy
The player lives inside a persistent, shared, pixel-art/isometric-inspired version of **Old Delhi** and participates in a living player-driven economy.

Players own businesses, buy and sell goods, hire workers, move goods around the city, respond to changing prices, and make decisions that affect other players.

The defining idea is:

> **Every economic action causes another economic reaction.**

A player buying spices affects spice prices.
Spice prices affect restaurant costs.
Restaurant costs affect food prices.
Food prices affect demand.
Demand affects wages, production, transport, and business profitability.

The city should feel like a system rather than a collection of disconnected minigames.

---

# 2. VISUAL / UI DIRECTION

The provided visual reference is the target mood for the game world.

## Desired look
- Dense shared world.
- Isometric/pseudo-isometric perspective.
- Pixel-art aesthetic.
- Small colorful characters distributed throughout the world.
- Compact buildings with readable silhouettes.
- Dark tiled roads/paths.
- Green tiled ground.
- Warm building windows.
- Small environmental props.
- Speech bubbles / tiny snippets of player chatter above characters.
- Lots of simultaneous activity visible on screen.
- The world should feel busy even when the player is doing nothing.

## Important visual principle
**The world is the UI.**

Do not make the primary experience a spreadsheet with a map attached to it.
Players should be able to look at the city and understand that things are happening.

Menus should appear as overlays/panels on top of the world rather than replacing the world completely.

## Character behavior
Player characters should wander or move around the city when appropriate.
They may display short contextual speech bubbles such as:
- "prices are wild"
- "need spices"
- "good deal"
- "sold!"
- "looking for workers"

These are flavor only. Do not create an AI conversation system.

---

# 3. CAMERA AND WORLD

The game uses a large shared 2D/isometric-feeling city map.

The player can:
- Pan around.
- Zoom in/out within sensible limits.
- Click buildings, markets, roads, and player entities.
- Open contextual information panels.

The city is persistent for the duration of the game/session and should feel like one shared economic space.

## Initial city districts
Keep the first version small.

### 1. Khari Baoli
Economic identity:
- spices
- grains
- dry goods

### 2. Chandni Chowk
Economic identity:
- retail
- textiles
- general commerce

### 3. Food district / Jama Masjid area
Economic identity:
- food
- restaurants
- street vendors
- tourism-driven demand

These are inspired by the real-world identities of Old Delhi but are intentionally simplified for gameplay.

Do not attempt to reproduce the entire real Old Delhi economy.

---

# 4. CORE PLAYER LOOP

The core loop is:

```text
ENTER CITY
   ↓
GET / START A BUSINESS
   ↓
BUY INPUTS
   ↓
PRODUCE GOODS / SERVICES
   ↓
SELL TO MARKET OR OTHER PLAYERS
   ↓
EARN MON
   ↓
REINVEST
   ↓
UPGRADE / EXPAND
   ↓
CHANGE THE ECONOMY
   ↓
RESPOND TO OTHER PLAYERS
   ↓
REPEAT
```

The player should constantly make economic decisions rather than simply wait for passive income.

---

# 5. CURRENCY

## MON
Use **MON** as the game's primary currency.

Do NOT create a second game token for the MVP.

MON represents money/capital in the simulation.

Players use MON to:
- buy businesses/assets where applicable
- purchase goods
- pay workers
- pay transportation costs
- upgrade businesses
- trade with other players
- receive revenue

The blockchain layer should be meaningful, but gameplay should remain understandable to a person who has never used crypto.

---

# 6. BUSINESSES

Players participate in the economy through businesses.

Start with a very small number of business types.

## Business Type A: Spice Merchant

Produces/sells:
- spices
- chillies
- dry goods

Inputs:
- purchased wholesale goods / supply stock

Role:
- connects wholesale supply to retail/food businesses.

## Business Type B: Textile Shop

Produces/sells:
- cloth
- garments
- textile goods

Role:
- retail and trade.

## Business Type C: Food Stall / Restaurant

Consumes:
- spices
- grain/food ingredients
- fuel
- labor

Produces:
- prepared food

Role:
- converts multiple inputs into higher-value goods/services.

## Business Type D: Transporter

Moves:
- goods between districts/businesses/markets.

Consumes:
- fuel
- labor

Earns:
- transport fees.

---

# 7. BUSINESS STATE

Every player-owned business should have a small set of understandable properties.

Example:

```text
CHAI STALL

Owner: 0x...
Level: 1
Workers: 1 / 2
Production: 50 units/day
Input stock: 24
Cash: 3.4 MON
Reputation: optional UI-only value
```

For MVP, avoid complicated employee skill trees, business management screens, or dozens of stats.

A business should answer four questions immediately:

1. What does it consume?
2. What does it produce?
3. How much can it produce?
4. Is it profitable right now?

---

# 8. PRODUCTION

Businesses transform inputs into outputs.

Example:

```text
RESTAURANT

2 spice units
+ 3 grain units
+ 1 fuel unit
+ labor
        ↓
5 food units
```

Production should consume inventory.

If the business does not have enough required inputs, production stops or is reduced.

This creates real economic dependencies.

---

# 9. SUPPLY AND DEMAND

This is the most important economic mechanic.

Prices should respond to player activity.

Conceptually:

```text
Demand ↑ + Supply unchanged
        ↓
Price ↑

Supply ↑ + Demand unchanged
        ↓
Price ↓
```

Do not make prices completely random.

The player should be able to understand why a price moved.

Example UI:

```text
CHILLI

Price: 0.082 MON

Demand: HIGH ↑
Supply: LOW ↓

Why?
Food district demand increased 18%.
```

The exact pricing formula can be simplified for the MVP, but it must produce predictable cause-and-effect behavior.

---

# 10. MARKET

The market is where players can see and interact with the city's economy.

For the MVP, support:
- buy
- sell
- current price
- recent price movement
- available supply
- demand indicator

A market listing should be understandable immediately.

Example:

```text
SPICES
0.05 MON / unit
Supply: 184
Demand: HIGH ↑

[ BUY ] [ SELL ]
```

Avoid building a full professional exchange UI.

The game should feel like a city market, not Bloomberg Terminal: Delhi Edition.

---

# 11. ARBITRAGE

A major gameplay mechanic is price differences between districts.

Example:

```text
KHARI BAOLI
Spice price: 0.05 MON

      ↓ transport

CHANDNI CHOWK
Spice price: 0.09 MON
```

A player can:
1. Buy cheaply.
2. Transport the goods.
3. Sell where the price is higher.
4. Earn the difference minus transport costs.

As more players exploit the difference, prices should naturally move toward each other.

This creates player-discovered opportunities without scripted quests.

---

# 12. TRANSPORT

Distance should matter economically.

Moving goods between districts costs:
- MON
- time / capacity
- fuel where applicable

Transport should create another layer of the economy rather than simply teleporting inventory.

For MVP, transportation can be abstracted into a simple transaction/action rather than a physically simulated truck system.

The visual world can still show trucks, carts, or characters moving as flavor.

---

# 13. LABOR

Businesses require workers.

Workers are a simplified labor market.

A business can:
- hire workers
- pay wages
- increase production through sufficient staffing

If demand for workers increases across the city:

```text
Worker demand ↑
      ↓
Wages ↑
      ↓
Business costs ↑
      ↓
Product prices may ↑
```

This is another Chain Reaction.

Do not implement individual worker AI, resumes, careers, or complex job matching in the MVP.

Workers can be abstract economic units.

---

# 14. BUSINESS PROFIT

Every business should have a simple profit concept.

Conceptually:

```text
Revenue
- Input costs
- Labor costs
- Transport costs
- Operating costs
= Profit
```

The player should be able to see whether the business is:

🟢 Profitable
🟡 Marginal
🔴 Losing money

The exact accounting model can be simplified.

The important thing is that player decisions have economic consequences.

---

# 15. ECONOMIC CHAIN REACTIONS

This is the defining mechanic.

Example:

```text
Festival begins
      ↓
Tourists increase
      ↓
Food demand increases
      ↓
Restaurants buy more ingredients
      ↓
Spice demand increases
      ↓
Spice prices increase
      ↓
Restaurant costs increase
      ↓
Food prices increase
      ↓
Consumers buy less
      ↓
Food demand falls
```

The game should surface these relationships visually where possible.

For example:

```text
⚡ CHAIN REACTION

Food demand +24%
      ↓
Spice demand +17%
      ↓
Spice price +11%
      ↓
Restaurant costs +8%
```

This makes the name of the game mechanically meaningful.

---

# 16. EVENTS / SHOCKS

The economy can periodically receive events.

Events are not quests. They are economic shocks.

Start with only a few.

## Festival Season

Effects:
- tourism increases
- food demand increases
- textile demand increases
- transport demand increases

## Supply Shortage

Effects:
- one resource becomes harder to obtain
- resource price increases
- businesses depending on it become more expensive to operate

## Heavy Rain / Flooding

Effects:
- transport capacity decreases
- transportation costs increase
- affected goods become more expensive

Events should create opportunities for players who prepared correctly.

Do not create dozens of events for the MVP.

---

# 17. PLAYER INTERACTION

Players should interact economically rather than through combat.

Players can:
- buy/sell goods
- own businesses
- trade
- compete
- transport goods
- respond to market opportunities
- observe other players' businesses

Optional social flavor:
- character speech bubbles
- visible player names
- small activity indicators

Do not add combat, weapons, health bars, or PvP unless explicitly requested later.

---

# 18. OWNERSHIP

The important player-owned economic objects should be associated with wallets.

Conceptually:

```text
Wallet
  ↓
Business
  ↓
Inventory / production
  ↓
Revenue
```

Ownership should not be merely cosmetic.

The player should feel that the business belongs to them and has economic value.

Avoid creating an NFT system unless it is genuinely required by the existing project architecture.

---

# 19. BLOCKCHAIN ROLE

Blockchain should provide:
- persistent ownership where implemented
- transparent economic transactions
- verifiable settlement
- public history

Do not put every visual animation or every UI state on-chain.

The game can use off-chain state/indexing for fast rendering where appropriate, while economically important actions remain verifiable.

Do not fake transactions.

If a transaction is displayed as successful, it must actually have succeeded.

---

# 20. PLAYER PROGRESSION

Progression should be economic, not RPG-like.

The player's progression comes from:

```text
Small business
      ↓
More capital
      ↓
More inventory
      ↓
Higher production
      ↓
Larger business
      ↓
Multiple businesses / trade routes
```

Optional simple levels can exist for businesses.

Avoid:
- XP trees
- character classes
- combat stats
- skill trees
- equipment systems

---

# 21. INFORMATION THE PLAYER NEEDS

The player should always be able to answer:

### What should I buy?
Look at price, supply, and demand.

### What should I sell?
Look at profitable markets.

### What should I produce?
Look at demand and input costs.

### Where should I trade?
Compare district prices.

### What is changing?
Look at events and market movement.

### Why did my profits change?
Show the economic chain when possible.

This is more important than adding more features.

---

# 22. UI STRUCTURE

The world remains visible as much as possible.

Suggested UI:

```text
┌─────────────────────────────────────────────┐
│ MON BALANCE     MARKET     EVENTS     MENU │
├─────────────────────────────────────────────┤
│                                             │
│             SHARED OLD DELHI               │
│                                             │
│      🏢      🏪       🧍                   │
│   🧍     🏬       🛒       🧍               │
│       🏪          🏢                       │
│                                             │
│                  🧍                         │
│                                             │
├─────────────────────────────────────────────┤
│ SELECTED OBJECT / MARKET / BUSINESS PANEL │
└─────────────────────────────────────────────┘
```

The exact layout can adapt to the existing baseline implementation.

Do not replace the existing visual language with a completely different design system.

---

# 23. VISUAL FEEDBACK

Important economic actions should have immediate feedback.

Examples:

Purchase:
```text
-2.4 MON
+40 SPICE
```

Sale:
```text
+3.1 MON
-40 SPICE
```

Price change:
```text
SPICE +12% ↑
```

Economic event:
```text
⚡ FESTIVAL DEMAND SURGE
```

Chain reaction:
```text
🔥 CHAIN REACTION
Tourism → Food → Spices → Prices
```

Keep feedback readable and short.

---

# 24. MVP ECONOMY

For the first playable version, use approximately:

### Districts
3

### Resources
5–7

Suggested:
- spices
- grain
- textiles
- food
- fuel
- labor

### Businesses
4

- spice merchant
- textile shop
- restaurant/food stall
- transporter

### Economic mechanics
- supply
- demand
- dynamic prices
- production
- labor
- transport
- trade
- profit/loss
- events

That is enough.

Do not expand the economy until this loop feels alive.

---

# 25. EXAMPLE FULL CHAIN REACTION

A good gameplay story should look like this:

```text
A FESTIVAL STARTS
        ↓
Tourism rises
        ↓
Food demand rises
        ↓
Restaurants need more ingredients
        ↓
Spice demand rises
        ↓
Spice price rises
        ↓
Spice merchants make more money
        ↓
More merchants enter the spice market
        ↓
Spice supply rises
        ↓
Spice price falls
        ↓
Restaurant margins recover
        ↓
Food prices stabilize
```

The player should be able to intervene anywhere in this chain.

That is the game.

---

# 26. WHAT MAKES A GOOD PLAYER DECISION

A decision is good when it has a tradeoff.

Example:

> Buy cheap spices now and pay transport to sell them elsewhere?

Tradeoff:
- capital locked up
- transport cost
- price may change before arrival
- potential profit

Another:

> Raise restaurant production during the festival?

Tradeoff:
- need more ingredients
- need more workers
- potentially huge revenue
- risk of demand falling

Avoid decisions that are simply:

> Click button → receive free money.

---

# 27. NO SCRIPTED ECONOMIC SOLUTIONS

The game should not tell players the optimal strategy.

Players should discover:
- profitable routes
- shortages
- price differences
- good businesses
- bad investments
- timing opportunities

The simulation creates the opportunity.
The player decides what to do.

---

# 28. ANTI-SCOPE-CREEP RULES FOR ANTIGRAVITY

## DO NOT ADD

- AI agents
- bounty systems
- quests
- combat
- NFTs as a gimmick
- new tokens
- staking
- DAO/governance
- complex crafting trees
- character RPG progression
- weapons
- battle systems
- multiplayer chat systems
- elaborate NPC AI
- dozens of resources
- dozens of districts
- realistic macroeconomic models
- a second currency
- unrelated social features

## DO NOT CHANGE THE CORE IDEA

Chain Reaction is an **economic simulation in a shared Old Delhi world**.

It is NOT:
- a normal city builder
- a traditional tycoon game
- a DeFi dashboard
- a pixel-art social network
- a bounty platform
- an AI-agent game

---

# 29. ANTI-HALLUCINATION RULES

These rules are mandatory for AI coding agents.

### Rule 1
If a requirement is not in this document or the existing project baseline, do not invent it.

### Rule 2
Before changing a core mechanic, inspect the existing implementation and preserve working behavior.

### Rule 3
Do not rewrite working systems simply because a different architecture seems cleaner.

### Rule 4
Do not add dependencies unless they are necessary for an explicitly required feature.

### Rule 5
Do not create fake economic data that contradicts the game's defined mechanics.

### Rule 6
Do not hardcode fake blockchain transactions and present them as real.

### Rule 7
If the existing project already implements a mechanic differently, do not silently replace it. Record the difference and use the simplest compatible approach.

### Rule 8
If a mechanic is underspecified, choose the simplest deterministic implementation that preserves the stated gameplay goal.

### Rule 9
Do not create extra currencies, resources, buildings, districts, events, or progression systems without explicit approval.

### Rule 10
Every new mechanic must answer:

```text
What player decision does this create?
What economic reaction does it cause?
Why is it necessary?
```

If those questions cannot be answered, do not implement the mechanic.

---

# 30. IMPLEMENTATION PRIORITY

When deciding what to build first, use this exact order:

## PRIORITY 1 — WORLD
- Render shared Old Delhi-style world.
- Camera movement.
- Buildings.
- Characters.
- Basic interaction.

## PRIORITY 2 — ECONOMY
- MON balance.
- Resources.
- Market.
- Prices.
- Buy/sell.

## PRIORITY 3 — BUSINESSES
- Ownership.
- Inputs.
- Production.
- Workers.
- Revenue/costs.

## PRIORITY 4 — CHAIN REACTION
- Supply/demand propagation.
- Economic events.
- Visible explanations of why prices changed.

## PRIORITY 5 — POLISH
- Animations.
- Character movement.
- Speech bubbles.
- Market feedback.
- Visual effects.
- Better map density.

Do not implement Priority 5 before Priorities 1–4 work.

---

# 31. DEFINITION OF A SUCCESSFUL MVP

A player should be able to:

1. Enter the Old Delhi world.
2. Connect/use their wallet.
3. Own or start a small business.
4. Buy resources.
5. Produce something.
6. Sell it.
7. Earn MON.
8. Observe prices changing.
9. React to an economic opportunity.
10. See another player's activity affect their own business.
11. Understand WHY something became more/less profitable.

If this works, the game is already Chain Reaction.

Everything else is polish.

---

# 32. DESIGN NORTH STAR

Whenever there is uncertainty, return to this sentence:

> **Chain Reaction is a living Old Delhi economy where players are connected by supply, demand, money, and consequences.**

The city should feel alive.
The economy should feel understandable.
Player actions should have consequences.
Those consequences should create new opportunities for other players.

**One action should cause another.**

That is Chain Reaction.
