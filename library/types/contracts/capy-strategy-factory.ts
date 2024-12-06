const data = {
  name: "CapyTrustStrategyFactory",
  address: "0xbac4154f1B58e7D1e65B0993F3E86Cb54335691a",
  abi: [
    {
      type: "constructor",
      inputs: [
        { name: "_currentStrategy", type: "address", internalType: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createStrategy",
      inputs: [
        { name: "name", type: "string", internalType: "string" },
        { name: "avatar", type: "string", internalType: "string" },
        { name: "description", type: "string", internalType: "string" },
      ],
      outputs: [{ name: "strategy", type: "address", internalType: "address" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "currentStrategy",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getStrategyAt",
      inputs: [{ name: "_index", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getStrategyCount",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isStrategyFromFactory",
      inputs: [
        { name: "_strategyAddress", type: "address", internalType: "address" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "renounceOwnership",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "strategies",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract CapyTrustStrategy",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "transferOwnership",
      inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "updateStrategyAddress",
      inputs: [
        { name: "_currentStrategy", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          name: "previousOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "newOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "StrategyCreated",
      inputs: [
        {
          name: "owner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "strategyAddress",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "name",
          type: "string",
          indexed: false,
          internalType: "string",
        },
        {
          name: "avatar",
          type: "string",
          indexed: false,
          internalType: "string",
        },
        {
          name: "description",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
  ],
} as const;

export default data;
