const data = {
  name: "CapyTrustStrategyFactory",
  address: "",
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_currentStrategy",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createStrategy",
      inputs: [],
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
        {
          name: "_strategyAddress",
          type: "address",
          internalType: "address",
        },
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
          internalType: "contract ICapyTrustStrategy",
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
        {
          name: "_currentStrategy",
          type: "address",
          internalType: "address",
        },
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
          name: "strategyAddress",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
  ],
} as const;

export default data;
