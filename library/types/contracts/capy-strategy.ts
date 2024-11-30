const data = {
  name: "CapyTrustStrategy",
  address: "",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_allo",
          type: "address",
        },
        {
          internalType: "address",
          name: "_sndrCore",
          type: "address",
        },
        {
          internalType: "address",
          name: "_token",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ALLOCATION_ACTIVE",
      type: "error",
    },
    {
      inputs: [],
      name: "ALLOCATION_NOT_ACTIVE",
      type: "error",
    },
    {
      inputs: [],
      name: "ALLOCATION_NOT_ENDED",
      type: "error",
    },
    {
      inputs: [],
      name: "ALREADY_INITIALIZED",
      type: "error",
    },
    {
      inputs: [],
      name: "AMOUNT_MISMATCH",
      type: "error",
    },
    {
      inputs: [],
      name: "ANCHOR_ERROR",
      type: "error",
    },
    {
      inputs: [],
      name: "ARRAY_MISMATCH",
      type: "error",
    },
    {
      inputs: [],
      name: "INVALID",
      type: "error",
    },
    {
      inputs: [],
      name: "INVALID_ADDRESS",
      type: "error",
    },
    {
      inputs: [],
      name: "INVALID_FEE",
      type: "error",
    },
    {
      inputs: [],
      name: "INVALID_METADATA",
      type: "error",
    },
    {
      inputs: [],
      name: "INVALID_REGISTRATION",
      type: "error",
    },
    {
      inputs: [],
      name: "IS_APPROVED_STRATEGY",
      type: "error",
    },
    {
      inputs: [],
      name: "MISMATCH",
      type: "error",
    },
    {
      inputs: [],
      name: "NONCE_NOT_AVAILABLE",
      type: "error",
    },
    {
      inputs: [],
      name: "NON_ZERO_VALUE",
      type: "error",
    },
    {
      inputs: [],
      name: "NOT_APPROVED_STRATEGY",
      type: "error",
    },
    {
      inputs: [],
      name: "NOT_ENOUGH_FUNDS",
      type: "error",
    },
    {
      inputs: [],
      name: "NOT_IMPLEMENTED",
      type: "error",
    },
    {
      inputs: [],
      name: "NOT_INITIALIZED",
      type: "error",
    },
    {
      inputs: [],
      name: "NOT_PENDING_OWNER",
      type: "error",
    },
    {
      inputs: [],
      name: "POOL_ACTIVE",
      type: "error",
    },
    {
      inputs: [],
      name: "POOL_INACTIVE",
      type: "error",
    },
    {
      inputs: [],
      name: "RECIPIENT_ALREADY_ACCEPTED",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipientId",
          type: "address",
        },
      ],
      name: "RECIPIENT_ERROR",
      type: "error",
    },
    {
      inputs: [],
      name: "RECIPIENT_NOT_ACCEPTED",
      type: "error",
    },
    {
      inputs: [],
      name: "REGISTRATION_ACTIVE",
      type: "error",
    },
    {
      inputs: [],
      name: "REGISTRATION_NOT_ACTIVE",
      type: "error",
    },
    {
      inputs: [],
      name: "UNAUTHORIZED",
      type: "error",
    },
    {
      inputs: [],
      name: "ZERO_ADDRESS",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipientId",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "Allocated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipientAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newAllocation",
          type: "uint256",
        },
      ],
      name: "AllocationUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "allocationsCount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalAllocated",
          type: "uint256",
        },
      ],
      name: "BatchAllocationCompleted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipientId",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "recipientAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "Distributed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "recipientIds",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalAllocation",
          type: "uint256",
        },
      ],
      name: "DistributionExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "poolId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "active",
          type: "bool",
        },
      ],
      name: "PoolActive",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipientAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "initialAllocation",
          type: "uint256",
        },
      ],
      name: "RecipientRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipientAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "enum IStrategy.Status",
          name: "status",
          type: "uint8",
        },
      ],
      name: "RecipientStatusUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipientId",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "Registered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "registrationStartTime",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "registrationEndTime",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "allocationStartTime",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "allocationEndTime",
          type: "uint64",
        },
      ],
      name: "TimestampsUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "newWhitelistedCollectors",
          type: "address[]",
        },
      ],
      name: "WhitelistedCollectorsUpdated",
      type: "event",
    },
    {
      inputs: [],
      name: "NATIVE",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "_sender",
          type: "address",
        },
      ],
      name: "allocate",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "allocationEndTime",
      outputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "allocationStartTime",
      outputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_recipientIds",
          type: "address[]",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "_sender",
          type: "address",
        },
      ],
      name: "distribute",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllo",
      outputs: [
        {
          internalType: "contract IAllo",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_recipientIds",
          type: "address[]",
        },
        {
          internalType: "bytes[]",
          name: "_data",
          type: "bytes[]",
        },
      ],
      name: "getPayouts",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "recipientAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          internalType: "struct IStrategy.PayoutSummary[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPoolAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPoolId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_recipientAddress",
          type: "address",
        },
      ],
      name: "getRecipientDetails",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "recipientAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "totalAllocation",
              type: "uint256",
            },
            {
              internalType: "enum IStrategy.Status",
              name: "status",
              type: "uint8",
            },
          ],
          internalType: "struct SNDRStrategy.Recipient",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_recipientId",
          type: "address",
        },
      ],
      name: "getRecipientStatus",
      outputs: [
        {
          internalType: "enum IStrategy.Status",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getStrategyId",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTotalRecipients",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "increasePoolAmount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_poolId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "isPoolActive",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_allocator",
          type: "address",
        },
      ],
      name: "isValidAllocator",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "recipientList",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "recipients",
      outputs: [
        {
          internalType: "address",
          name: "recipientAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "totalAllocation",
          type: "uint256",
        },
        {
          internalType: "enum IStrategy.Status",
          name: "status",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "_sender",
          type: "address",
        },
      ],
      name: "registerRecipient",
      outputs: [
        {
          internalType: "address",
          name: "recipientId",
          type: "address",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "registrationEndTime",
      outputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "registrationStartTime",
      outputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "sndrCore",
      outputs: [
        {
          internalType: "contract ISNDRCore",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint64",
          name: "_registrationStartTime",
          type: "uint64",
        },
        {
          internalType: "uint64",
          name: "_registrationEndTime",
          type: "uint64",
        },
        {
          internalType: "uint64",
          name: "_allocationStartTime",
          type: "uint64",
        },
        {
          internalType: "uint64",
          name: "_allocationEndTime",
          type: "uint64",
        },
      ],
      name: "updatePoolTimestamps",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_recipientAddress",
          type: "address",
        },
        {
          internalType: "enum IStrategy.Status",
          name: "_newStatus",
          type: "uint8",
        },
      ],
      name: "updateRecipientStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_newWhitelistedCollectors",
          type: "address[]",
        },
      ],
      name: "updateWhitelistedCollectors",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "whitelistedCollectors",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawRemainingTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const;

export default data;
