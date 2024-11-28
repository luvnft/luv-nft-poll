const data = {
  name: "AddressDriver",
  address: "",
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
      name: "collect",
      inputs: [
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
      name: "setSplits",
      inputs: [
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
      name: "calcAccountId",
      inputs: [
        {
          name: "addr",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "accountId",
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
  ],
} as const;

export default data;
