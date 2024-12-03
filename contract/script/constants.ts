import { Address, encodeAbiParameters, parseAbiParameters } from "viem";

type Metadata = {
  protocol: bigint;
  pointer: string;
};

type FunctionParams = {
  createProfile: {
    profileData: {
      nonce: bigint;
      name: string;
      metadata: Metadata;
      owner: Address;
      members: Address[];
    };
  };
  mintToken: {
    amount: bigint;
  };
  approveAllo: {
    amount: bigint;
  };
  transferNFTOwnership: {
    newOwner: Address;
  };
  createPoolWithCustomStrategy: {
    params: {
      profileId: `0x${string}`;
      strategy: Address;
      initStrategyData: `0x${string}`;
      token: Address;
      amount: bigint;
      metadata: Metadata;
      managers: Address[];
    };
  };
  registerRecipient: {
    poolId: bigint;
    data: `0x${string}`;
  };
  updateRecipientStatus: {
    recipientId: Address;
    status: number;
  };
  allocate: {
    poolId: bigint;
    data: `0x${string}`;
  };
  distributeFunds: {
    poolId: bigint;
    recipientIds: Address[];
    data: `0x${string}`;
  };
  capyCoreTest: {
    poolId: bigint;
    token: Address;
    recipients: Address[];
    allocations: bigint[];
    duration: number;
    whitelistedCollectors: Address[];
  };
};

export const RPC_URL = "http://127.0.0.1:8545";

export const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
export const RECIPIENT_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

export const CONTRACTS = {
  REGISTRY: {
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" as Address,
    abi: [
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
        ],
        name: "acceptProfileOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address[]",
            name: "_members",
            type: "address[]",
          },
        ],
        name: "addMembers",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
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
        inputs: [
          {
            internalType: "uint256",
            name: "_nonce",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "_members",
            type: "address[]",
          },
        ],
        name: "createProfile",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
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
            indexed: false,
            internalType: "uint8",
            name: "version",
            type: "uint8",
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
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        name: "ProfileCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
        ],
        name: "ProfileMetadataUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: false,
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        name: "ProfileNameUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ProfileOwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "ProfilePendingOwnerUpdated",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_token",
            type: "address",
          },
          {
            internalType: "address",
            name: "_recipient",
            type: "address",
          },
        ],
        name: "recoverFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address[]",
            name: "_members",
            type: "address[]",
          },
        ],
        name: "removeMembers",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
          },
        ],
        name: "RoleAdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleRevoked",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
        ],
        name: "updateProfileMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
        ],
        name: "updateProfileName",
        outputs: [
          {
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_pendingOwner",
            type: "address",
          },
        ],
        name: "updateProfilePendingOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "ALLO_OWNER",
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
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "anchorToProfileId",
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
        name: "DEFAULT_ADMIN_ROLE",
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
        inputs: [
          {
            internalType: "address",
            name: "_anchor",
            type: "address",
          },
        ],
        name: "getProfileByAnchor",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "protocol",
                    type: "uint256",
                  },
                  {
                    internalType: "string",
                    name: "pointer",
                    type: "string",
                  },
                ],
                internalType: "struct Metadata",
                name: "metadata",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "anchor",
                type: "address",
              },
            ],
            internalType: "struct IRegistry.Profile",
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
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
        ],
        name: "getProfileById",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "protocol",
                    type: "uint256",
                  },
                  {
                    internalType: "string",
                    name: "pointer",
                    type: "string",
                  },
                ],
                internalType: "struct Metadata",
                name: "metadata",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "anchor",
                type: "address",
              },
            ],
            internalType: "struct IRegistry.Profile",
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
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleAdmin",
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
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
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
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_member",
            type: "address",
          },
        ],
        name: "isMemberOfProfile",
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
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
        ],
        name: "isOwnerOfProfile",
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
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_account",
            type: "address",
          },
        ],
        name: "isOwnerOrMemberOfProfile",
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
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "profileIdToPendingOwner",
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
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "profilesById",
        outputs: [
          {
            internalType: "bytes32",
            name: "id",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
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
    ] as const,
  },
  ALLO: {
    address: "0x0165878A594ca255338adfa4d48449f69242Eb8F" as Address,
    abi: [
      {
        type: "function",
        name: "DEFAULT_ADMIN_ROLE",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "NATIVE",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "addPoolManager",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_manager", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "addToCloneableStrategies",
        inputs: [
          { name: "_strategy", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "allocate",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_data", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "batchAllocate",
        inputs: [
          { name: "_poolIds", type: "uint256[]", internalType: "uint256[]" },
          { name: "_datas", type: "bytes[]", internalType: "bytes[]" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "batchRegisterRecipient",
        inputs: [
          { name: "_poolIds", type: "uint256[]", internalType: "uint256[]" },
          { name: "_data", type: "bytes[]", internalType: "bytes[]" },
        ],
        outputs: [
          {
            name: "recipientIds",
            type: "address[]",
            internalType: "address[]",
          },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "cancelOwnershipHandover",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "completeOwnershipHandover",
        inputs: [
          { name: "pendingOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "createPool",
        inputs: [
          { name: "_profileId", type: "bytes32", internalType: "bytes32" },
          { name: "_strategy", type: "address", internalType: "address" },
          { name: "_initStrategyData", type: "bytes", internalType: "bytes" },
          { name: "_token", type: "address", internalType: "address" },
          { name: "_amount", type: "uint256", internalType: "uint256" },
          {
            name: "_metadata",
            type: "tuple",
            internalType: "struct Metadata",
            components: [
              { name: "protocol", type: "uint256", internalType: "uint256" },
              { name: "pointer", type: "string", internalType: "string" },
            ],
          },
          { name: "_managers", type: "address[]", internalType: "address[]" },
        ],
        outputs: [{ name: "poolId", type: "uint256", internalType: "uint256" }],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "createPoolWithCustomStrategy",
        inputs: [
          { name: "_profileId", type: "bytes32", internalType: "bytes32" },
          { name: "_strategy", type: "address", internalType: "address" },
          { name: "_initStrategyData", type: "bytes", internalType: "bytes" },
          { name: "_token", type: "address", internalType: "address" },
          { name: "_amount", type: "uint256", internalType: "uint256" },
          {
            name: "_metadata",
            type: "tuple",
            internalType: "struct Metadata",
            components: [
              { name: "protocol", type: "uint256", internalType: "uint256" },
              { name: "pointer", type: "string", internalType: "string" },
            ],
          },
          { name: "_managers", type: "address[]", internalType: "address[]" },
        ],
        outputs: [{ name: "poolId", type: "uint256", internalType: "uint256" }],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "distribute",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          {
            name: "_recipientIds",
            type: "address[]",
            internalType: "address[]",
          },
          { name: "_data", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "fundPool",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_amount", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "getBaseFee",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getFeeDenominator",
        inputs: [],
        outputs: [
          { name: "FEE_DENOMINATOR", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "pure",
      },
      {
        type: "function",
        name: "getPercentFee",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getPool",
        inputs: [{ name: "_poolId", type: "uint256", internalType: "uint256" }],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct IAllo.Pool",
            components: [
              { name: "profileId", type: "bytes32", internalType: "bytes32" },
              {
                name: "strategy",
                type: "address",
                internalType: "contract IStrategy",
              },
              { name: "token", type: "address", internalType: "address" },
              {
                name: "metadata",
                type: "tuple",
                internalType: "struct Metadata",
                components: [
                  {
                    name: "protocol",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  { name: "pointer", type: "string", internalType: "string" },
                ],
              },
              { name: "managerRole", type: "bytes32", internalType: "bytes32" },
              { name: "adminRole", type: "bytes32", internalType: "bytes32" },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getRegistry",
        inputs: [],
        outputs: [
          { name: "", type: "address", internalType: "contract IRegistry" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getRoleAdmin",
        inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getStrategy",
        inputs: [{ name: "_poolId", type: "uint256", internalType: "uint256" }],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getTreasury",
        inputs: [],
        outputs: [
          { name: "", type: "address", internalType: "address payable" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "grantRole",
        inputs: [
          { name: "role", type: "bytes32", internalType: "bytes32" },
          { name: "account", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "hasRole",
        inputs: [
          { name: "role", type: "bytes32", internalType: "bytes32" },
          { name: "account", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "initialize",
        inputs: [
          { name: "_owner", type: "address", internalType: "address" },
          { name: "_registry", type: "address", internalType: "address" },
          {
            name: "_treasury",
            type: "address",
            internalType: "address payable",
          },
          { name: "_percentFee", type: "uint256", internalType: "uint256" },
          { name: "_baseFee", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "isCloneableStrategy",
        inputs: [
          { name: "_strategy", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "isPoolAdmin",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_address", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "isPoolManager",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_address", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [{ name: "result", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "ownershipHandoverExpiresAt",
        inputs: [
          { name: "pendingOwner", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "result", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "recoverFunds",
        inputs: [
          { name: "_token", type: "address", internalType: "address" },
          { name: "_recipient", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "registerRecipient",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_data", type: "bytes", internalType: "bytes" },
        ],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "removeFromCloneableStrategies",
        inputs: [
          { name: "_strategy", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "removePoolManager",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          { name: "_manager", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "renounceRole",
        inputs: [
          { name: "role", type: "bytes32", internalType: "bytes32" },
          { name: "account", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "requestOwnershipHandover",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "revokeRole",
        inputs: [
          { name: "role", type: "bytes32", internalType: "bytes32" },
          { name: "account", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "supportsInterface",
        inputs: [
          { name: "interfaceId", type: "bytes4", internalType: "bytes4" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          { name: "newOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "updateBaseFee",
        inputs: [
          { name: "_baseFee", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "updatePercentFee",
        inputs: [
          { name: "_percentFee", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "updatePoolMetadata",
        inputs: [
          { name: "_poolId", type: "uint256", internalType: "uint256" },
          {
            name: "_metadata",
            type: "tuple",
            internalType: "struct Metadata",
            components: [
              { name: "protocol", type: "uint256", internalType: "uint256" },
              { name: "pointer", type: "string", internalType: "string" },
            ],
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "updateRegistry",
        inputs: [
          { name: "_registry", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "updateTreasury",
        inputs: [
          {
            name: "_treasury",
            type: "address",
            internalType: "address payable",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "BaseFeePaid",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "BaseFeeUpdated",
        inputs: [
          {
            name: "baseFee",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "Initialized",
        inputs: [
          {
            name: "version",
            type: "uint8",
            indexed: false,
            internalType: "uint8",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "OwnershipHandoverCanceled",
        inputs: [
          {
            name: "pendingOwner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "OwnershipHandoverRequested",
        inputs: [
          {
            name: "pendingOwner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "OwnershipTransferred",
        inputs: [
          {
            name: "oldOwner",
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
        name: "PercentFeeUpdated",
        inputs: [
          {
            name: "percentFee",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "PoolCreated",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "profileId",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "strategy",
            type: "address",
            indexed: false,
            internalType: "contract IStrategy",
          },
          {
            name: "token",
            type: "address",
            indexed: false,
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "metadata",
            type: "tuple",
            indexed: false,
            internalType: "struct Metadata",
            components: [
              { name: "protocol", type: "uint256", internalType: "uint256" },
              { name: "pointer", type: "string", internalType: "string" },
            ],
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "PoolFunded",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "fee",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "PoolMetadataUpdated",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "metadata",
            type: "tuple",
            indexed: false,
            internalType: "struct Metadata",
            components: [
              { name: "protocol", type: "uint256", internalType: "uint256" },
              { name: "pointer", type: "string", internalType: "string" },
            ],
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RegistryUpdated",
        inputs: [
          {
            name: "registry",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleAdminChanged",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "previousAdminRole",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "newAdminRole",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleGranted",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "sender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleRevoked",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "sender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "StrategyApproved",
        inputs: [
          {
            name: "strategy",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "StrategyRemoved",
        inputs: [
          {
            name: "strategy",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "TreasuryUpdated",
        inputs: [
          {
            name: "treasury",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      { type: "error", name: "ALLOCATION_ACTIVE", inputs: [] },
      { type: "error", name: "ALLOCATION_NOT_ACTIVE", inputs: [] },
      { type: "error", name: "ALLOCATION_NOT_ENDED", inputs: [] },
      { type: "error", name: "ALREADY_INITIALIZED", inputs: [] },
      { type: "error", name: "AMOUNT_MISMATCH", inputs: [] },
      { type: "error", name: "ANCHOR_ERROR", inputs: [] },
      { type: "error", name: "ARRAY_MISMATCH", inputs: [] },
      { type: "error", name: "INVALID", inputs: [] },
      { type: "error", name: "INVALID_ADDRESS", inputs: [] },
      { type: "error", name: "INVALID_FEE", inputs: [] },
      { type: "error", name: "INVALID_METADATA", inputs: [] },
      { type: "error", name: "INVALID_REGISTRATION", inputs: [] },
      { type: "error", name: "IS_APPROVED_STRATEGY", inputs: [] },
      { type: "error", name: "MISMATCH", inputs: [] },
      { type: "error", name: "NONCE_NOT_AVAILABLE", inputs: [] },
      { type: "error", name: "NON_ZERO_VALUE", inputs: [] },
      { type: "error", name: "NOT_APPROVED_STRATEGY", inputs: [] },
      { type: "error", name: "NOT_ENOUGH_FUNDS", inputs: [] },
      { type: "error", name: "NOT_IMPLEMENTED", inputs: [] },
      { type: "error", name: "NOT_INITIALIZED", inputs: [] },
      { type: "error", name: "NOT_PENDING_OWNER", inputs: [] },
      { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
      { type: "error", name: "NoHandoverRequest", inputs: [] },
      { type: "error", name: "POOL_ACTIVE", inputs: [] },
      { type: "error", name: "POOL_INACTIVE", inputs: [] },
      { type: "error", name: "RECIPIENT_ALREADY_ACCEPTED", inputs: [] },
      {
        type: "error",
        name: "RECIPIENT_ERROR",
        inputs: [
          { name: "recipientId", type: "address", internalType: "address" },
        ],
      },
      { type: "error", name: "RECIPIENT_NOT_ACCEPTED", inputs: [] },
      { type: "error", name: "REGISTRATION_ACTIVE", inputs: [] },
      { type: "error", name: "REGISTRATION_NOT_ACTIVE", inputs: [] },
      { type: "error", name: "UNAUTHORIZED", inputs: [] },
      { type: "error", name: "Unauthorized", inputs: [] },
      { type: "error", name: "ZERO_ADDRESS", inputs: [] },
    ] as const,
  },
  TEST_TOKEN: {
    address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1" as Address,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "CheckpointUnorderedInsertion",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "delegatee",
            type: "address",
          },
        ],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "delegatee",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
        ],
        name: "delegateBySig",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "ECDSAInvalidSignature",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "length",
            type: "uint256",
          },
        ],
        name: "ECDSAInvalidSignatureLength",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
        ],
        name: "ECDSAInvalidSignatureS",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "increasedSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cap",
            type: "uint256",
          },
        ],
        name: "ERC20ExceededSafeSupply",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
        ],
        name: "ERC20InsufficientAllowance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
        ],
        name: "ERC20InsufficientBalance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ERC20InvalidApprover",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "ERC20InvalidReceiver",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSpender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        name: "ERC2612ExpiredSignature",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ERC2612InvalidSigner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "timepoint",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "clock",
            type: "uint48",
          },
        ],
        name: "ERC5805FutureLookup",
        type: "error",
      },
      {
        inputs: [],
        name: "ERC6372InconsistentClock",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currentNonce",
            type: "uint256",
          },
        ],
        name: "InvalidAccountNonce",
        type: "error",
      },
      {
        inputs: [],
        name: "InvalidShortString",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint8",
            name: "bits",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "SafeCastOverflowedUintDowncast",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "str",
            type: "string",
          },
        ],
        name: "StringTooLong",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
        ],
        name: "VotesExpiredSignature",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "delegator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "fromDelegate",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "toDelegate",
            type: "address",
          },
        ],
        name: "DelegateChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "delegate",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "previousVotes",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newVotes",
            type: "uint256",
          },
        ],
        name: "DelegateVotesChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [],
        name: "EIP712DomainChanged",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
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
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
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
            name: "account",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "pos",
            type: "uint32",
          },
        ],
        name: "checkpoints",
        outputs: [
          {
            components: [
              {
                internalType: "uint48",
                name: "_key",
                type: "uint48",
              },
              {
                internalType: "uint208",
                name: "_value",
                type: "uint208",
              },
            ],
            internalType: "struct Checkpoints.Checkpoint208",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "clock",
        outputs: [
          {
            internalType: "uint48",
            name: "",
            type: "uint48",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "CLOCK_MODE",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "delegates",
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
        name: "DOMAIN_SEPARATOR",
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
        name: "eip712Domain",
        outputs: [
          {
            internalType: "bytes1",
            name: "fields",
            type: "bytes1",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "version",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "verifyingContract",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "salt",
            type: "bytes32",
          },
          {
            internalType: "uint256[]",
            name: "extensions",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "timepoint",
            type: "uint256",
          },
        ],
        name: "getPastTotalSupply",
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
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timepoint",
            type: "uint256",
          },
        ],
        name: "getPastVotes",
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
            name: "account",
            type: "address",
          },
        ],
        name: "getVotes",
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
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "nonces",
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
            name: "account",
            type: "address",
          },
        ],
        name: "numCheckpoints",
        outputs: [
          {
            internalType: "uint32",
            name: "",
            type: "uint32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
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
    ] as const,
  },
  CAPY_NFT: {
    address: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE" as Address,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "initialOwner",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ERC721IncorrectOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ERC721InsufficientApproval",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ERC721InvalidApprover",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "ERC721InvalidOperator",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ERC721InvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "ERC721InvalidReceiver",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC721InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ERC721NonexistentToken",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "_fromTokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_toTokenId",
            type: "uint256",
          },
        ],
        name: "BatchMetadataUpdate",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "MetadataUpdate",
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
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
        ],
        name: "safeMint",
        outputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
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
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
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
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getApproved",
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
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
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
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
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
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
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
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
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
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
  },
  CAPY_CORE: {
    address: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed" as Address,
    abi: [
      {
        type: "constructor",
        inputs: [
          {
            name: "_nftDriverAddress",
            type: "address",
            internalType: "address",
          },
          { name: "_dripsContract", type: "address", internalType: "address" },
          { name: "_capyNFTAddress", type: "address", internalType: "address" },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "capyNFT",
        inputs: [],
        outputs: [
          { name: "", type: "address", internalType: "contract ICapyNFT" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "capyNftToDripsAccount",
        inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "dripsContract",
        inputs: [],
        outputs: [
          { name: "", type: "address", internalType: "contract IDrips" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getAvailableBalance",
        inputs: [
          { name: "capyNftId", type: "uint256", internalType: "uint256" },
          { name: "token", type: "address", internalType: "contract IERC20" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getStreamConfig",
        inputs: [
          { name: "poolId", type: "uint256", internalType: "uint256" },
          { name: "token", type: "address", internalType: "contract IERC20" },
          { name: "recipient", type: "address", internalType: "address" },
        ],
        outputs: [
          { name: "startTime", type: "uint256", internalType: "uint256" },
          { name: "stopTime", type: "uint256", internalType: "uint256" },
          { name: "amountPerSecond", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "handleDistribution",
        inputs: [
          { name: "poolId", type: "uint256", internalType: "uint256" },
          { name: "token", type: "address", internalType: "contract IERC20" },
          { name: "recipients", type: "address[]", internalType: "address[]" },
          { name: "allocations", type: "uint256[]", internalType: "uint256[]" },
          { name: "duration", type: "uint32", internalType: "uint32" },
          {
            name: "whitelistedCollectors",
            type: "address[]",
            internalType: "address[]",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "nftDriver",
        inputs: [],
        outputs: [
          { name: "", type: "address", internalType: "contract INFTDriver" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "poolIdToCapyNFTs",
        inputs: [
          { name: "", type: "uint256", internalType: "uint256" },
          { name: "", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "poolIdToDripsAccount",
        inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "poolIdToWhitelistedCollectors",
        inputs: [
          { name: "", type: "uint256", internalType: "uint256" },
          { name: "", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "squeezeStreams",
        inputs: [
          { name: "capyNftId", type: "uint256", internalType: "uint256" },
          { name: "token", type: "address", internalType: "contract IERC20" },
          { name: "senderId", type: "uint256", internalType: "uint256" },
          { name: "historyHash", type: "bytes32", internalType: "bytes32" },
          {
            name: "streamsHistory",
            type: "tuple[]",
            internalType: "struct IDrips.StreamsHistory[]",
            components: [
              { name: "streamsHash", type: "bytes32", internalType: "bytes32" },
              {
                name: "receivers",
                type: "tuple[]",
                internalType: "struct IDrips.StreamReceiver[]",
                components: [
                  {
                    name: "accountId",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "config",
                    type: "uint256",
                    internalType: "IDrips.StreamConfig",
                  },
                ],
              },
              { name: "updateTime", type: "uint32", internalType: "uint32" },
              { name: "maxEnd", type: "uint32", internalType: "uint32" },
            ],
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          { name: "poolId", type: "uint256", internalType: "uint256" },
          { name: "capyNftId", type: "uint256", internalType: "uint256" },
          { name: "recipient", type: "address", internalType: "address" },
          { name: "maxCycles", type: "uint32", internalType: "uint32" },
          { name: "token", type: "address", internalType: "contract IERC20" },
        ],
        outputs: [
          { name: "collected", type: "uint128", internalType: "uint128" },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "whitelistedCollectorsCount",
        inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "event",
        name: "DistributionHandled",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "token",
            type: "address",
            indexed: true,
            internalType: "contract IERC20",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "FundsTransferred",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "capyNftId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "recipient",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "collected",
            type: "uint128",
            indexed: false,
            internalType: "uint128",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "StreamSetup",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "token",
            type: "address",
            indexed: false,
            internalType: "contract IERC20",
          },
          {
            name: "recipient",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "recipientDriverAccountId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "capyNftId",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "amountPerSecond",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "duration",
            type: "uint32",
            indexed: false,
            internalType: "uint32",
          },
          {
            name: "totalAllocation",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "WhitelistedCollectorUpdated",
        inputs: [
          {
            name: "poolId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "collector",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "isWhitelisted",
            type: "bool",
            indexed: false,
            internalType: "bool",
          },
        ],
        anonymous: false,
      },
    ] as const,
  },
  CAPY_STRATEGY: {
    address: "0x8aFFEEE6851396e1d499A317fc9946aFfD90eA6E" as Address,
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
    ] as const,
  },
  CAPY_STRATEGY_FACTORY: {
    address: "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1" as Address,
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
        outputs: [
          { name: "strategy", type: "address", internalType: "address" },
        ],
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
        inputs: [
          { name: "newOwner", type: "address", internalType: "address" },
        ],
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
    ] as const,
  },
};

export const FUNCTION_PARAMS: FunctionParams = {
  createProfile: {
    profileData: {
      nonce: 1n,
      name: "Ethena Profile",
      metadata: {
        protocol: 1n,
        pointer: "ipfs://example",
      },
      owner: ADMIN_ADDRESS,
      members: [],
    },
  },

  mintToken: {
    amount: 1000_000_000_000_000_000_000n, // 1 token in wei
  },

  approveAllo: {
    amount: 1000_000_000_000_000_000_000n, // 1 token in wei
  },

  transferNFTOwnership: {
    newOwner: CONTRACTS.CAPY_CORE.address,
  },

  createPoolWithCustomStrategy: {
    params: {
      profileId:
        "0xd4622f6f38d5db892468d96e7ecc6dd68b88b324f5671f6e27af6352377977e9",
      strategy: CONTRACTS.CAPY_STRATEGY.address,
      // initialize: encode(uint64 registrationStartTime, uint64 registrationEndTime, uint64 allocationStartTime, uint64 allocationEndTime)
      initStrategyData: encodeAbiParameters(
        parseAbiParameters("uint64, uint64, uint64, uint64"),
        [
          BigInt(Math.floor(Date.now() / 1000)), // registrationStartTime (current timestamp)
          BigInt(Math.floor(Date.now() / 1000) + 120), // registrationEndTime (2 mins from now)
          BigInt(Math.floor(Date.now() / 1000) + 120), // allocationStartTime (2 mins from now)
          BigInt(Math.floor(Date.now() / 1000) + 240), // allocationEndTime (4 mins from now)
        ]
      ),
      token: CONTRACTS.TEST_TOKEN.address,
      amount: 100_000_000_000_000_000_000n,
      metadata: {
        protocol: 0n,
        pointer: "",
      },
      managers: [],
    },
  },

  registerRecipient: {
    poolId: 3n,
    // registerRecipient: encode(address recipientAddress, string name, string avatar, string bio)
    data: encodeAbiParameters(
      parseAbiParameters("address, string, string, string"),
      [
        RECIPIENT_ADDRESS,
        "Recipient Name", // Add a name
        "ipfs://avatar-url", // Add an avatar URL
        "Recipient bio description", // Add a bio
      ]
    ),
  },

  updateRecipientStatus: {
    recipientId: RECIPIENT_ADDRESS,
    status: 2,
  },

  allocate: {
    poolId: 3n,
    // allocate: encode(address[] recipientAddresses, uint256[] amounts)
    data: encodeAbiParameters(parseAbiParameters("address[], uint256[]"), [
      [RECIPIENT_ADDRESS],
      [1000000000000000000n],
    ]),
  },

  distributeFunds: {
    poolId: 3n,
    recipientIds: [RECIPIENT_ADDRESS],
    // distributeFunds: encode(uint32 duration)
    data: encodeAbiParameters(
      parseAbiParameters("uint32"),
      [180] // 3 minutes in seconds
    ),
  },

  capyCoreTest: {
    poolId: 3n,
    token: CONTRACTS.TEST_TOKEN.address,
    recipients: [RECIPIENT_ADDRESS],
    allocations: [1000000000000000000n],
    duration: 86400,
    whitelistedCollectors: [],
  },
};
