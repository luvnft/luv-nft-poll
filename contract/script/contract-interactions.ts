import { getContract } from "viem";
import { ADMIN_ADDRESS, CONTRACTS, FUNCTION_PARAMS } from "./constants.js";
import { account, publicClient, walletClient } from "./viem-utils.js";

const registryContract = getContract({
  address: CONTRACTS.REGISTRY.address,
  abi: CONTRACTS.REGISTRY.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const capyTokenContract = getContract({
  address: CONTRACTS.TEST_TOKEN.address,
  abi: CONTRACTS.TEST_TOKEN.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const capyNFTContract = getContract({
  address: CONTRACTS.CAPY_NFT.address,
  abi: CONTRACTS.CAPY_NFT.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const alloContract = getContract({
  address: CONTRACTS.ALLO.address,
  abi: CONTRACTS.ALLO.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const capyStrategy = getContract({
  address: CONTRACTS.CAPY_STRATEGY.address,
  abi: CONTRACTS.CAPY_STRATEGY.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const capyCore = getContract({
  address: CONTRACTS.CAPY_CORE.address,
  abi: CONTRACTS.CAPY_CORE.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const capyStrategyFactory = getContract({
  address: CONTRACTS.CAPY_STRATEGY_FACTORY.address,
  abi: CONTRACTS.CAPY_STRATEGY_FACTORY.abi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

export async function createProfile() {
  const { profileData } = FUNCTION_PARAMS.createProfile;
  return await registryContract.simulate
    .createProfile(
      [
        profileData.nonce,
        profileData.name,
        profileData.metadata,
        profileData.owner,
        profileData.members,
      ],
      {
        account,
      }
    )
    .finally(async () => {
      const unwatch = registryContract.watchEvent.ProfileCreated(
        {},
        { onLogs: (logs) => console.log("the logs ", logs) }
      );
    });
}

export async function mintToken() {
  const { amount } = FUNCTION_PARAMS.mintToken;
  return await capyTokenContract.write.mint([ADMIN_ADDRESS, amount], {
    account,
  });
}

export async function approveAllo() {
  const { amount } = FUNCTION_PARAMS.approveAllo;
  return await capyTokenContract.write.approve([
    CONTRACTS.ALLO.address,
    amount,
  ]);
}

export async function transferNFTOwnership() {
  const { newOwner } = FUNCTION_PARAMS.transferNFTOwnership;
  return await capyNFTContract.write.transferOwnership([newOwner]);
}

export async function createPoolWithCustomStrategy() {
  const { params } = FUNCTION_PARAMS.createPoolWithCustomStrategy;
  return await alloContract.simulate.createPoolWithCustomStrategy(
    [
      params.profileId,
      params.strategy,
      params.initStrategyData,
      params.token,
      params.amount,
      params.metadata,
      params.managers,
    ],
    { account }
  );
}

export async function registerRecipient() {
  const { poolId, data } = FUNCTION_PARAMS.registerRecipient;
  return await alloContract.write.registerRecipient([poolId, data]);
}

export async function updateRecipientStatus() {
  const { recipientId, status } = FUNCTION_PARAMS.updateRecipientStatus;
  return await capyStrategy.write.updateRecipientStatus([recipientId, status], {
    account,
  });
}

export async function allocate() {
  const { poolId, data } = FUNCTION_PARAMS.allocate;
  return await alloContract.write.allocate([poolId, data], { account });
}

export async function distributeFunds() {
  const { poolId, recipientIds, data } = FUNCTION_PARAMS.distributeFunds;
  return await alloContract.write
    .distribute([poolId, recipientIds, data], {
      account,
    })
    .finally(async () => {
      capyCore.watchEvent.StreamSetup(
        {},
        { onLogs: (logs) => console.log("StreamSetup logs ", logs) }
      );
      capyCore.watchEvent.DistributionHandled(
        {},
        { onLogs: (logs) => console.log("DistributionHandled logs ", logs) }
      );
    });
}

export async function createStrategy() {
  return await capyStrategyFactory.write.createStrategy({
    account,
  });
}

export async function balanceOfDrips() {
  return await capyCore.simulate.transfer(
    [
      3n,
      0n,
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      4,
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ],
    {
      account,
    }
  );
}

export async function mintTokenToCapyCore() {
  const { amount } = FUNCTION_PARAMS.mintToken;
  return await capyTokenContract.write.mint([
    CONTRACTS.CAPY_CORE.address,
    amount,
  ]);
}

export async function capyCoreTest() {
  const {
    poolId,
    token,
    recipients,
    allocations,
    duration,
    whitelistedCollectors,
  } = FUNCTION_PARAMS.capyCoreTest;
  return await capyCore.simulate.handleDistribution(
    [poolId, token, recipients, allocations, duration, whitelistedCollectors],
    { account }
  );
}

// import { TransactionExecutionError, decodeErrorResult } from "viem";

// export async function distributeFunds() {
//   const { poolId, recipientIds, data } = FUNCTION_PARAMS.distributeFunds;

//   try {
//     console.log("Attempting to distribute funds with params:", {
//       poolId,
//       recipientIds,
//       data,
//     });

//     const tx = await alloContract.write.distribute(
//       [poolId, recipientIds, data],
//       {
//         account,
//         gas: 200_000n,
//       }
//     );

//     console.log("Transaction hash:", tx);

//     // Wait for transaction receipt
//     const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
//     console.log("Transaction receipt:", receipt);

//     return receipt;
//   } catch (error) {
//     if (error instanceof TransactionExecutionError) {
//       console.error("Transaction execution failed:", error.message);
//       console.error("Error details:", {
//         name: error.name,
//         cause: error.cause,
//         data: error.data,
//       });

//       // Try to decode the error
//       if (error.data) {
//         try {
//           const decodedError = decodeErrorResult({
//             abi: alloContract.abi,
//             data: error.data,
//           });
//           console.error("Decoded error:", decodedError);
//         } catch (decodeError) {
//           console.error("Could not decode error:", decodeError);
//         }
//       }

//       // Get more transaction details
//       if (error.transaction) {
//         console.error("Transaction details:", error.transaction);
//       }
//     } else {
//       console.error("An unexpected error occurred:", error);
//     }
//     throw error;
//   }
// }
