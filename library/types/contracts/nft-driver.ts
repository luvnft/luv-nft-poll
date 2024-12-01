const data = {
  name: "NFTDriver",
  address: "0xF8AB9D746443898666693F1a56d88272980A2E4c",
  abi: [
    {
      type: "function",
      name: "acceptAdmin",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "approve",
      inputs: [
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "burn",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "collect",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "erc20",
          type: "address",
          internalType: "contract IERC20",
        },
        {
          name: "transferTo",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "amt",
          type: "uint128",
          internalType: "uint128",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "emitAccountMetadata",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "accountMetadata",
          type: "tuple[]",
          internalType: "struct AccountMetadata[]",
          components: [
            {
              name: "key",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "value",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "give",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "receiver",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "erc20",
          type: "address",
          internalType: "contract IERC20",
        },
        {
          name: "amt",
          type: "uint128",
          internalType: "uint128",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "mint",
      inputs: [
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "accountMetadata",
          type: "tuple[]",
          internalType: "struct AccountMetadata[]",
          components: [
            {
              name: "key",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "value",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "mintWithSalt",
      inputs: [
        {
          name: "salt",
          type: "uint64",
          internalType: "uint64",
        },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "accountMetadata",
          type: "tuple[]",
          internalType: "struct AccountMetadata[]",
          components: [
            {
              name: "key",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "value",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "proposeNewAdmin",
      inputs: [
        {
          name: "newAdmin",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "renounceAdmin",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "safeMint",
      inputs: [
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "accountMetadata",
          type: "tuple[]",
          internalType: "struct AccountMetadata[]",
          components: [
            {
              name: "key",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "value",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "safeMintWithSalt",
      inputs: [
        {
          name: "salt",
          type: "uint64",
          internalType: "uint64",
        },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "accountMetadata",
          type: "tuple[]",
          internalType: "struct AccountMetadata[]",
          components: [
            {
              name: "key",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "value",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "safeTransferFrom",
      inputs: [
        {
          name: "from",
          type: "address",
          internalType: "address",
        },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "safeTransferFrom",
      inputs: [
        {
          name: "from",
          type: "address",
          internalType: "address",
        },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "data",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setApprovalForAll",
      inputs: [
        {
          name: "operator",
          type: "address",
          internalType: "address",
        },
        {
          name: "approved",
          type: "bool",
          internalType: "bool",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setSplits",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "receivers",
          type: "tuple[]",
          internalType: "struct SplitsReceiver[]",
          components: [
            {
              name: "accountId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "weight",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setStreams",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "erc20",
          type: "address",
          internalType: "contract IERC20",
        },
        {
          name: "currReceivers",
          type: "tuple[]",
          internalType: "struct StreamReceiver[]",
          components: [
            {
              name: "accountId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "config",
              type: "uint256",
              internalType: "StreamConfig",
            },
          ],
        },
        {
          name: "balanceDelta",
          type: "int128",
          internalType: "int128",
        },
        {
          name: "newReceivers",
          type: "tuple[]",
          internalType: "struct StreamReceiver[]",
          components: [
            {
              name: "accountId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "config",
              type: "uint256",
              internalType: "StreamConfig",
            },
          ],
        },
        {
          name: "maxEndHints",
          type: "uint256",
          internalType: "MaxEndHints",
        },
        {
          name: "transferTo",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "realBalanceDelta",
          type: "int128",
          internalType: "int128",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "transferFrom",
      inputs: [
        {
          name: "from",
          type: "address",
          internalType: "address",
        },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "constructor",
      inputs: [
        {
          name: "drips_",
          type: "address",
          internalType: "contract Drips",
        },
        {
          name: "forwarder",
          type: "address",
          internalType: "address",
        },
        {
          name: "driverId_",
          type: "uint32",
          internalType: "uint32",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "upgradeTo",
      inputs: [
        {
          name: "newImplementation",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "upgradeToAndCall",
      inputs: [
        {
          name: "newImplementation",
          type: "address",
          internalType: "address",
        },
        {
          name: "data",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "event",
      name: "AdminChanged",
      inputs: [
        {
          name: "previousAdmin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "newAdmin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Approval",
      inputs: [
        {
          name: "owner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "approved",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ApprovalForAll",
      inputs: [
        {
          name: "owner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "operator",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "approved",
          type: "bool",
          indexed: false,
          internalType: "bool",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "BeaconUpgraded",
      inputs: [
        {
          name: "beacon",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "NewAdminProposed",
      inputs: [
        {
          name: "currentAdmin",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "newAdmin",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Transfer",
      inputs: [
        {
          name: "from",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "to",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Upgraded",
      inputs: [
        {
          name: "implementation",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "function",
      name: "admin",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "balanceOf",
      inputs: [
        {
          name: "owner",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "calcTokenIdWithSalt",
      inputs: [
        {
          name: "minter",
          type: "address",
          internalType: "address",
        },
        {
          name: "salt",
          type: "uint64",
          internalType: "uint64",
        },
      ],
      outputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "drips",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract Drips",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "driverId",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint32",
          internalType: "uint32",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getApproved",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "implementation",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isApprovedForAll",
      inputs: [
        {
          name: "owner",
          type: "address",
          internalType: "address",
        },
        {
          name: "operator",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isSaltUsed",
      inputs: [
        {
          name: "minter",
          type: "address",
          internalType: "address",
        },
        {
          name: "salt",
          type: "uint64",
          internalType: "uint64",
        },
      ],
      outputs: [
        {
          name: "isUsed",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isTrustedForwarder",
      inputs: [
        {
          name: "forwarder",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "name",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "nextTokenId",
      inputs: [],
      outputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "ownerOf",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proposedAdmin",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proxiableUUID",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [
        {
          name: "interfaceId",
          type: "bytes4",
          internalType: "bytes4",
        },
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "symbol",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "tokenURI",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string",
        },
      ],
      stateMutability: "view",
    },
  ],
} as const;

export default data;
