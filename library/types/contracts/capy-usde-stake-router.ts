const data = {
  name: "CapyUSDeStakeRouter",
  address: "0x61D102857571130e6C4b524b93Dc3f33f199bcf9",
  abi: [
    {
      type: "constructor",
      inputs: [
        { name: "_usde", type: "address", internalType: "address" },
        { name: "_sUsde", type: "address", internalType: "address" },
        { name: "_alloContract", type: "address", internalType: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "alloContract",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "fundAlloPool",
      inputs: [
        { name: "_poolId", type: "uint256", internalType: "uint256" },
        { name: "_amount", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "sUsde",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "usde",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
      stateMutability: "view",
    },
    { type: "error", name: "DEPOSIT_FAILED", inputs: [] },
    { type: "error", name: "FUND_POOL_FAILED", inputs: [] },
    { type: "error", name: "NOT_ENOUGH_FUNDS", inputs: [] },
  ],
} as const;

export default data;
