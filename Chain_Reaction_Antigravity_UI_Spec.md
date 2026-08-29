# Chain Reaction — Antigravity UI Implementation Brief
## Build an Interactive Isometric Old Delhi World Inspired by the Provided tiny.place Reference

---

## IMPORTANT

This document is an implementation brief for **Antigravity**.

The attached/reference image shows the visual and interaction direction I want.

### DO NOT make a generic dashboard.

### DO NOT make a normal website with a map inside it.

### DO NOT copy tiny.place directly.

Instead, create an **original Chain Reaction world** that uses the same broad visual language:

- Dense isometric city
- Pixel-art / low-resolution game aesthetic
- Small animated characters
- Buildings arranged across a large world
- Map-first interaction
- Dark minimal UI chrome
- Contextual floating panels
- Living world with continuously moving entities

The setting must be **Old Delhi**, and the purpose of the world is the Chain Reaction economic simulation.

---

# 1. THE CORE IDEA

The primary screen of Chain Reaction should feel like the player is looking at a **miniature living city**.

The player should be able to look at the map and immediately see:

- Markets
- Shops
- Warehouses
- Streets
- Buildings
- Landmarks
- Vehicles
- Goods movement
- Other players' activity where appropriate
- Their own deployed agents
- Agents moving between economic locations

The world itself is the main interface.

Think:

```text
                 CHAIN REACTION

 ┌─────────┐ ┌──────────────────────────────────────────┐
 │         │ │                                          │
 │ Sidebar │ │          ISOMETRIC OLD DELHI             │
 │         │ │                                          │
 │ World   │ │    🏪     🏠       🧑      🛺            │
 │ Markets │ │       🧑       🏪                         │
 │ Agents  │ │  🕌       🧑‍💼        🏬                  │
 │ Goods   │ │       🛺        🏪                         │
 │ etc.    │ │                                          │
 │         │ │                   ┌──────────────┐       │
 │         │ │                   │ Context Card │       │
 └─────────┘ └───────────────────┴──────────────┴───────┘
```

---

# 2. VISUAL REFERENCE

Use the provided tiny.place screenshot as the **visual direction reference**.

Match the broad characteristics:

### World

- Large isometric map
- Diamond/isometric ground grid
- Dense arrangement of buildings
- Buildings with clear silhouettes
- Small colorful characters
- Characters distributed throughout the world
- Roads and pathways
- Small environmental objects
- Strong sense of depth
- Camera looking down at the city
- World extending beyond the initial viewport

### UI

- Dark sidebar
- Minimal top navigation
- Floating contextual cards
- Rounded but restrained panels
- Small labels
- UI that does not obscure the world
- Strong contrast between UI and world
- Map remains visible behind panels

### IMPORTANT

Do NOT copy:

- tiny.place logo
- tiny.place name
- tiny.place characters
- tiny.place text
- exact building sprites
- exact icons
- exact sidebar labels
- exact room names
- exact layout pixel-for-pixel
- copyrighted assets

Create original Chain Reaction visuals.

---

# 3. OLD DELHI VISUAL IDENTITY

The world must look like **Old Delhi**, not a generic cyberpunk or modern city.

Use an original stylized pixel-art interpretation of:

- Chandni Chowk-style streets
- Khari Baoli spice markets
- Sadar Bazaar-style commerce
- Dariba Kalan-style shops
- Jama Masjid surroundings
- Narrow lanes
- Dense shopfronts
- Market stalls
- Rickshaws
- Hand carts
- Warehouses
- Traditional façades
- Signboards
- Awning-covered shops
- Crowded commercial streets
- Heritage architecture

The city should feel dense, slightly chaotic, colorful, and alive.

Avoid making every street perfectly clean and symmetrical.

---

# 4. WORLD-FIRST UI

The world should occupy most of the screen.

Do NOT place a huge dashboard in front of it.

The approximate visual hierarchy should be:

```text
WORLD / MAP          80–90%
UI                    10–20%
```

This is a guideline, not a strict percentage.

The player should always feel connected to the city.

---

# 5. SCREEN STRUCTURE

Use four primary UI regions.

## A. Left Sidebar

A narrow dark sidebar.

Suggested navigation:

```text
CHAIN
REACTION

⌂ Home

🌆 World

📈 Markets

🤖 Agents

📦 Inventory

🏪 Businesses

💰 Economy

📜 Activity

⚙ Settings
```

Do not make the sidebar oversized.

The sidebar should feel like navigation attached to a game world, not a business application.

---

## B. Top Bar

Keep the top bar minimal.

Example:

```text
CHAIN REACTION                         ₹12,450   ● LIVE
```

Potential information:

- Player balance
- Current economic state
- Live indicator
- Notifications
- Profile/settings

Do not overload it with statistics.

---

## C. World View

This is the main area.

The isometric world should be rendered as a real interactive game scene.

It should support:

- Camera pan
- Camera zoom
- Object selection
- Agent selection
- Building selection
- Market selection
- Location selection
- Entity movement
- Animated entities
- World updates

---

## D. Contextual UI

Information appears when the player interacts with the world.

Examples:

```text
Click Market
       ↓
Small market card
```

```text
Click Agent
       ↓
Small agent card
```

```text
Click Shop
       ↓
Small business card
```

Do not navigate away from the world unless a full-screen view is genuinely necessary.

---

# 6. ISOMETRIC WORLD IMPLEMENTATION

If compatible with the existing codebase, use a game renderer such as:

**Phaser 3**

Suggested separation:

```text
React / existing frontend
        │
        ├── Navigation
        ├── Context panels
        ├── Agent controls
        ├── Market information
        └── Notifications
                 │
                 ▼
        Isometric Game World
                 │
                 ├── Tiles
                 ├── Buildings
                 ├── Objects
                 ├── Agents
                 └── Animations
```

If the existing project already contains an appropriate rendering solution, **reuse it instead of replacing the architecture**.

Do not rewrite the entire project just to introduce Phaser.

---

# 7. ISOMETRIC TILE SYSTEM

Build the world from reusable tiles/assets rather than one giant static image.

Conceptually:

```text
GROUND
├── road
├── pavement
├── market floor
├── courtyard
└── alley

BUILDINGS
├── small shop
├── market
├── warehouse
├── house
├── business
└── landmark

OBJECTS
├── stall
├── cart
├── rickshaw
├── tree
├── sign
└── street object

ENTITIES
├── trader
├── courier
├── shopkeeper
└── other player-owned agents
```

This allows the city to become dynamic.

---

# 8. WORLD SHOULD BE DATA-DRIVEN

Do not hard-code every building directly into UI components.

Use world data.

Example concept:

```ts
type Location = {
  id: string;
  name: string;
  type: "market" | "shop" | "warehouse" | "landmark";
  x: number;
  y: number;
};

type Building = {
  id: string;
  locationId: string;
  type: string;
  ownerId?: string;
};

type Agent = {
  id: string;
  ownerId: string;
  jobType: string;
  locationId: string;
  status: string;
};
```

Use the project's existing data model if one already exists.

---

# 9. BUILDINGS SHOULD BE INTERACTIVE

Buildings are not just decoration.

Clicking a building should provide information relevant to the economy.

Example:

```text
┌─────────────────────────┐
│ KHARI BAOLI SPICE SHOP  │
├─────────────────────────┤
│ Spice                    │
│ Price             ₹72    │
│ Demand            HIGH   │
│ Stock              42    │
│                          │
│ [Inspect Market]         │
└─────────────────────────┘
```

Keep cards compact.

The world should remain visible.

---

# 10. MARKETS

Markets should visibly exist in the world.

Examples:

```text
Khari Baoli
Chandni Chowk
Sadar Bazaar
Dariba Kalan
```

Use existing Chain Reaction locations if they already exist.

Do not add unnecessary locations simply for visual variety.

Clicking a market can show:

```text
MARKET
Khari Baoli

Spices       ₹72   ↓
Grain        ₹41   ↑
Tea          ₹83   →
Textiles    ₹120   ↑

Demand: HIGH
```

---

# 11. PLAYER-OWNED AGENTS

Agents are a major gameplay feature.

Players can deploy their own agents into the city to perform economic work.

The agents must physically exist inside the world.

They should:

- Appear as small characters
- Move around the city
- Travel between locations
- Perform jobs
- Carry out contracts
- Generate revenue
- Consume operating costs
- React to economic conditions

The player should be able to see their agents working.

---

# 12. AGENT VISUAL STYLE

Agents should be tiny compared with buildings.

They should feel like miniature citizens moving around a miniature city.

Each agent should have:

- Distinct sprite
- Small ownership indicator
- Optional name label
- Job indicator when selected
- Idle animation
- Walking animation
- Working animation

Do not make agents huge.

Do not make them floating 3D models.

Keep them visually integrated with the pixel-art world.

---

# 13. AGENT MOVEMENT

Agents should actually travel.

Example:

```text
Rafi
Trader
Khari Baoli
      ↓
buys spices
      ↓
picks up goods
      ↓
walks through streets
      ↓
travels to Chandni Chowk
      ↓
sells goods
      ↓
earns profit
```

The movement should be visible on the map.

Where possible, use pathfinding rather than teleporting agents between locations.

---

# 14. AGENT JOBS

Initial implementation should support:

### Trader

Buys and sells goods based on player-defined rules.

### Courier

Moves goods between locations.

### Shopkeeper

Operates a player-owned business/shop.

Do not build a huge number of job types initially.

---

# 15. AGENT CONTRACTS

Players should configure what their agents are allowed to do.

Example:

```text
TRADER

Location:
Khari Baoli

Commodity:
Spices

Buy below:
₹80

Sell above:
₹110

Maximum capital:
₹1,000

Minimum profit:
₹20
```

The agent then follows these rules using deterministic game logic.

---

# 16. AGENT SELECTION UI

When a player clicks an agent:

```text
┌──────────────────────────┐
│ Rafi                     │
│ Trader                   │
│ Khari Baoli              │
├──────────────────────────┤
│ Status        Working    │
│ Task          Spice Trade│
│                          │
│ Revenue          ₹240    │
│ Costs             ₹70    │
│ Net Profit       +₹170   │
│ Efficiency         82%   │
├──────────────────────────┤
│ [Manage] [Contract]      │
└──────────────────────────┘
```

The card should float over/near the selected agent.

Do not permanently occupy a large section of the screen.

---

# 17. AGENT MANAGEMENT

Clicking "Manage" can open a larger panel.

It should allow:

- View status
- Change contract
- Change supported job settings
- Move agent where supported
- Allocate capital
- Pause
- Resume
- Inspect earnings

The map should remain visible behind the panel.

---

# 18. ECONOMIC VISUALIZATION

The economy should be visible in the world.

Examples:

- Small price indicators near markets
- Goods moving between markets
- Agents carrying goods
- Shops showing stock/activity
- Market demand indicators
- Subtle activity animations

Do not cover the world with graphs.

Use the world itself to communicate economic activity.

---

# 19. CHAIN REACTION

The UI should make economic cause-and-effect visible.

Example:

```text
Agent buys spices
        ↓
Spice supply decreases
        ↓
Price increases
        ↓
Another player notices
        ↓
Their agent enters the market
        ↓
Goods move from another district
        ↓
Price changes again
```

This should be the visual and gameplay identity of Chain Reaction.

---

# 20. ANIMATIONS

The city should never feel completely static.

Use subtle animations:

- Agents walking
- Rickshaws moving
- Market activity
- Shop activity
- Goods movement
- Small ambient effects
- Selection indicators
- Price changes
- Agent task transitions

Avoid excessive animations that make the map difficult to read.

---

# 21. DEPTH AND LAYERING

Use clear rendering layers:

```text
1. Ground
2. Roads / paths
3. Buildings
4. Environmental objects
5. Agents
6. Goods / vehicles
7. Selection indicators
8. UI overlays
```

Ensure entities correctly appear behind/in front of buildings based on their world position.

---

# 22. CAMERA EXPERIENCE

The camera should make the world feel explorable.

Support:

- Drag/pan
- Mouse wheel zoom
- Touch/pinch zoom if applicable
- Smooth camera movement
- Focus camera on selected agent
- Focus camera on selected market
- Reasonable zoom limits

Do not let the player accidentally lose the entire city by zooming infinitely far out.

---

# 23. RESPONSIVENESS

Desktop should be the primary experience if the existing project is desktop-oriented.

Still ensure the UI behaves sensibly on smaller screens.

On small screens:

- Collapse sidebar
- Reduce contextual card size
- Preserve world visibility
- Prioritize map interaction
- Avoid putting giant menus over the map

---

# 24. PERFORMANCE

The world may contain many buildings and agents.

Design for performance.

Use:

- Sprite reuse
- Asset caching
- Efficient rendering
- Viewport/camera culling where useful
- Avoid unnecessary React re-renders
- Keep high-frequency world updates inside the game/rendering layer where appropriate

Do not create thousands of independent DOM elements for world entities.

---

# 25. IMPORTANT: DO NOT BUILD THE WORLD AS HTML DIVS

The isometric city should be rendered as a game world.

Avoid:

```html
<div class="building">...</div>
<div class="building">...</div>
<div class="agent">...</div>
```

for hundreds/thousands of world objects.

Prefer:

```text
Game renderer
   ↓
Tilemap / sprites
   ↓
Interactive world
```

React/HTML should handle the surrounding interface.

---

# 26. COLOR / STYLE

Use a dark interface surrounding a colorful world.

### UI

- Very dark charcoal/black surfaces
- Subtle borders
- Muted text
- Small bright accent color for selected/current states
- Minimal shadows
- Compact typography

### World

- Warm Old Delhi-inspired colors
- Earthy building tones
- Greens for vegetation
- Muted stone/road colors
- Colorful market activity
- Strong but controlled contrast

Do not use an excessive neon cyberpunk palette.

---

# 27. TYPOGRAPHY

Use a clean, highly readable UI font.

The world itself can use pixel-art styling.

Do not use an overly futuristic font.

UI text should remain readable at normal desktop resolution.

---

# 28. CONTEXTUAL INFORMATION

The interface should reveal information progressively.

Default:

```text
CITY
```

Click:

```text
MARKET
```

Then:

```text
MARKET + PRICES
```

Click:

```text
AGENT
```

Then:

```text
AGENT + TASK + PROFIT
```

This keeps the map uncluttered.

---

# 29. SIDEBAR BEHAVIOR

The sidebar should provide access to:

```text
World
Markets
Agents
Inventory
Businesses
Economy
Activity
Settings
```

However, these should preferably behave as overlays, drawers, or contextual views when possible.

Avoid constantly replacing the world with unrelated full-screen pages.

---

# 30. WHAT NOT TO DO

### Do NOT:

- Build a conventional admin dashboard
- Make the map a static background image
- Use a giant 3D realistic city
- Make agents giant characters
- Make every interaction a modal
- Put huge graphs over the map
- Make the world look like a spreadsheet
- Make the game turn-based
- Replace the existing economy
- Replace the existing project architecture unnecessarily
- Add an LLM to control every agent
- Copy tiny.place assets
- Copy tiny.place branding
- Copy tiny.place characters
- Recreate tiny.place pixel-for-pixel

---

# 31. DO NOT CHANGE THE EXISTING GAME UNNECESSARILY

Before implementation:

1. Inspect the existing Chain Reaction codebase.
2. Identify the existing frontend architecture.
3. Identify the existing economy system.
4. Identify the existing map/world system.
5. Identify the existing player system.
6. Identify existing market/goods systems.
7. Identify the existing game loop.
8. Identify existing persistence/realtime systems.

Then integrate the new world UI into the existing project.

### Preserve existing functionality.

If an existing system already solves something, reuse it.

---

# 32. IMPLEMENTATION PRIORITY

Build in this order:

## Phase 1 — World

- Isometric map
- Ground tiles
- Roads
- Buildings
- Old Delhi visual identity
- Camera
- Zoom/pan

## Phase 2 — Interactivity

- Click buildings
- Click markets
- Contextual cards
- Selection states

## Phase 3 — Agents

- Agent sprites
- Agent spawning/deployment
- Agent ownership
- Agent movement
- Agent jobs
- Agent selection
- Agent management

## Phase 4 — Economy

- Connect agents to existing economy
- Goods movement
- Prices
- Supply/demand
- Earnings
- Operating costs

## Phase 5 — Polish

- Animations
- Ambient activity
- Better sprites
- Transitions
- Notifications
- Performance optimization

---

# 33. MVP DEFINITION

The first successful version should allow the player to:

```text
Open Chain Reaction
        ↓
See a large living Old Delhi isometric world
        ↓
Pan and zoom around it
        ↓
See buildings and markets
        ↓
Click a market
        ↓
See its economic information
        ↓
Deploy an agent
        ↓
Give it a job
        ↓
Set basic contract rules
        ↓
Watch the agent move through the city
        ↓
Watch it perform work
        ↓
See revenue/cost/profit
        ↓
See its actions affect the economy
```

If this works and feels good, the UI direction is correct.

---

# 34. QUALITY BAR

The final result should make someone immediately understand:

> "This is a living miniature Old Delhi economy."

Not:

> "This is a dashboard with an isometric illustration."

The player should want to zoom into the city and watch what is happening.

The city should feel like a place.

Agents should feel like economic workers.

Markets should feel alive.

And economic decisions should visibly propagate through the world.

---

# 35. FINAL ANTIGRAVITY COMMAND

**Build Chain Reaction as an interactive isometric Old Delhi economic world using the provided tiny.place screenshot as the high-level visual reference.**

Use an original pixel-art/isometric art direction.

The map is the primary interface.

Keep the UI minimal and contextual.

Populate the city with buildings, markets, roads, vehicles, environmental details, and small animated agents.

Allow players to deploy and manage their own economic agents.

Agents must physically move through the world and interact with the existing Chain Reaction economy.

Preserve the existing project architecture and gameplay wherever possible.

Do not redesign unrelated features.

Do not create a generic dashboard.

Do not copy tiny.place.

Build an original Chain Reaction world that captures the same **dense, living, miniature-city feeling** while making Old Delhi and the economic simulation the identity of the game.
