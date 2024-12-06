const data = {
  name: "CapyUSDeStakeRouter",
  address: "0x8107cFe5eCa96972eFf1DF00A4d43e45559F226c",
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
