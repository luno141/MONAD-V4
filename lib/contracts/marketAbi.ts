export const MARKET_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

export const MARKET_ABI = [
  {
    type: 'function',
    name: 'getMarketState',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'energyPrice', type: 'uint256' },
      { name: 'steelPrice', type: 'uint256' },
      { name: 'foodPrice', type: 'uint256' },
      { name: 'energySupply', type: 'uint256' },
      { name: 'steelSupply', type: 'uint256' },
      { name: 'foodSupply', type: 'uint256' },
      { name: 'isChakkaJamActive', type: 'bool' }
    ]
  },
  {
    type: 'function',
    name: 'buyResource',
    stateMutability: 'payable',
    inputs: [
      { name: 'resourceType', type: 'uint8' }, // 0: Energy (Katiya), 1: Steel (Files), 2: Food (Chole Bhature)
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'sellResource',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'resourceType', type: 'uint8' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'buildTheka',
    stateMutability: 'payable',
    inputs: [],
    outputs: []
  },
  {
    type: 'function',
    name: 'triggerChakkaJam',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    type: 'function',
    name: 'investInCompany',
    stateMutability: 'payable',
    inputs: [
      { name: 'companyId', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'event',
    name: 'ResourceTraded',
    inputs: [
      { name: 'trader', type: 'address', indexed: true },
      { name: 'resourceType', type: 'uint8', indexed: false },
      { name: 'isBuy', type: 'bool', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'newPrice', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'ChakkaJamTriggered',
    inputs: [
      { name: 'initiator', type: 'address', indexed: true },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'CompanyInvested',
    inputs: [
      { name: 'investor', type: 'address', indexed: true },
      { name: 'companyId', type: 'uint256', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  }
] as const;
