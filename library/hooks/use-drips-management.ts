import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";

import { config } from "@/providers/wagmi/config";
import addressDriver from "@/types/contracts/address-driver";
import drips from "@/types/contracts/drips";

const DRIPS_ADDRESS = drips.address as `0x${string}`;
const ADDRESS_DRIVER_ADDRESS = addressDriver.address as `0x${string}`;

const DRIPS_ABI = drips.abi;
const ADDRESS_DRIVER_ABI = addressDriver.abi;

const MAX_CYCLES = 7000; // Adjust as needed

async function findOptimalCycles(
  accountId: bigint,
  erc20TokenAddress: Address,
  maxCycles: number
) {
  let left = 0;
  let right = maxCycles;
  let minNonZeroCycle = -1;
  let maxReceivableCycle = -1;
  let maxReceivableAmount = BigInt(0);

  // Binary search to find the minimum non-zero cycle
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const receivable = await readContract(config, {
      address: DRIPS_ADDRESS,
      abi: DRIPS_ABI,
      functionName: "receiveStreamsResult",
      args: [accountId, erc20TokenAddress, mid],
    });

    if (receivable > BigInt(0)) {
      minNonZeroCycle = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  // If no non-zero cycle found, return null
  if (minNonZeroCycle === -1) return null;

  // Find the maximum receivable cycle
  left = minNonZeroCycle;
  right = maxCycles;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const receivable = await readContract(config, {
      address: DRIPS_ADDRESS,
      abi: DRIPS_ABI,
      functionName: "receiveStreamsResult",
      args: [accountId, erc20TokenAddress, mid],
    });

    if (receivable > maxReceivableAmount) {
      maxReceivableCycle = mid;
      maxReceivableAmount = receivable;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return { minNonZeroCycle, maxReceivableCycle, maxReceivableAmount };
}

export function useDripsManagement(erc20TokenAddress: Address) {
  const { address } = useAccount();
  const [isReceiveStreamsProcessing, setIsReceiveStreamsProcessing] =
    useState(false);
  const [isSplitProcessing, setIsSplitProcessing] = useState(false);
  const [isCollectProcessing, setIsCollectProcessing] = useState(false);

  const [optimalReceivableAmount, setOptimalReceivableAmount] = useState<
    bigint | null
  >(null);

  const { data: accountId } = useReadContract({
    address: ADDRESS_DRIVER_ADDRESS,
    abi: ADDRESS_DRIVER_ABI,
    functionName: "calcAccountId",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const { data: cycles } = useReadContract({
    address: DRIPS_ADDRESS,
    abi: DRIPS_ABI,
    functionName: "receivableStreamsCycles",
    args: [accountId || BigInt(0), erc20TokenAddress],
    query: {
      enabled: !!accountId,
    },
  });

  const calculateOptimalReceivableAmount = useCallback(async () => {
    if (!accountId || !cycles || cycles <= 0) {
      setOptimalReceivableAmount(null);
      return;
    }

    try {
      const optimalCycles = await findOptimalCycles(
        accountId,
        erc20TokenAddress,
        MAX_CYCLES
      );

      if (optimalCycles) {
        setOptimalReceivableAmount(optimalCycles.maxReceivableAmount);
      } else {
        setOptimalReceivableAmount(null);
      }
    } catch (error) {
      console.error("Error calculating optimal receivable amount:", error);
      setOptimalReceivableAmount(null);
    }
  }, [accountId, cycles, erc20TokenAddress]);

  useEffect(() => {
    calculateOptimalReceivableAmount();
  }, [calculateOptimalReceivableAmount]);

  const { data: splittableAmount, refetch: refetchSplittableAmount } =
    useReadContract({
      address: DRIPS_ADDRESS,
      abi: DRIPS_ABI,
      functionName: "splittable",
      args: [accountId || BigInt(0), erc20TokenAddress],
      query: {
        enabled: !!accountId,
      },
    });

  const { data: collectableAmount, refetch: refetchCollectableAmount } =
    useReadContract({
      address: DRIPS_ADDRESS,
      abi: DRIPS_ABI,
      functionName: "collectable",
      args: [accountId || BigInt(0), erc20TokenAddress],
      query: {
        enabled: !!accountId,
      },
    });

  const { writeContract: writeReceiveStreams, isPending: isReceiving } =
    useWriteContract();
  const { writeContract: writeSplit, isPending: isSpliting } =
    useWriteContract();
  const { writeContract: writeCollect, isPending: isCollecting } =
    useWriteContract();

  const handleReceiveAndCollect = useCallback(async () => {
    if (!accountId || !address) return;

    const receiveStreams = async (): Promise<void> => {
      if (!cycles || cycles <= 0) return;
      setIsReceiveStreamsProcessing(true);
      const optimalCycles = await findOptimalCycles(
        accountId,
        erc20TokenAddress,
        MAX_CYCLES
      );
      if (!optimalCycles) {
        return setIsReceiveStreamsProcessing(false);
      }

      return new Promise((resolve, reject) => {
        writeReceiveStreams(
          {
            address: DRIPS_ADDRESS,
            abi: DRIPS_ABI,
            functionName: "receiveStreams",
            args: [
              accountId,
              erc20TokenAddress,
              optimalCycles.maxReceivableCycle,
            ],
          },
          {
            onSuccess: async (hash) => {
              console.log("Receive streams transaction hash:", hash);
              try {
                const receipt = await waitForTransactionReceipt(config, {
                  hash,
                });
                if (receipt.status !== "success") {
                  throw new Error("Receive streams failed");
                }
                setOptimalReceivableAmount(BigInt(0));
                resolve();
              } catch (error) {
                reject(error);
              } finally {
                setIsReceiveStreamsProcessing(false);
              }
            },
            onError: (error) => {
              setIsReceiveStreamsProcessing(false);
              reject(error);
            },
          }
        );
      });
    };

    const splitFunds = async (): Promise<void> => {
      const latestSplittableAmount = await refetchSplittableAmount().then(
        (result) => result.data
      );

      if (!latestSplittableAmount || latestSplittableAmount <= BigInt(0)) {
        return;
      }

      return new Promise((resolve, reject) => {
        writeSplit(
          {
            address: DRIPS_ADDRESS,
            abi: DRIPS_ABI,
            functionName: "split",
            args: [accountId, erc20TokenAddress, []],
          },
          {
            onSuccess: async (hash) => {
              console.log("Split transaction hash:", hash);
              try {
                setIsSplitProcessing(true);
                const receipt = await waitForTransactionReceipt(config, {
                  hash,
                });
                if (receipt.status !== "success") {
                  throw new Error("Split failed");
                }
                await refetchSplittableAmount();
                resolve();
              } catch (error) {
                reject(error);
              } finally {
                setIsSplitProcessing(false);
              }
            },
            onError: reject,
          }
        );
      });
    };

    const collectFunds = async (): Promise<void> => {
      const latestCollectableAmount = await refetchCollectableAmount().then(
        (result) => result.data
      );

      if (!latestCollectableAmount || latestCollectableAmount <= BigInt(0)) {
        return;
      }

      return new Promise((resolve, reject) => {
        writeCollect(
          {
            address: ADDRESS_DRIVER_ADDRESS,
            abi: ADDRESS_DRIVER_ABI,
            functionName: "collect",
            args: [erc20TokenAddress, address],
          },
          {
            onSuccess: async (hash) => {
              console.log("Collect transaction hash:", hash);
              try {
                setIsCollectProcessing(true);
                const receipt = await waitForTransactionReceipt(config, {
                  hash,
                });
                if (receipt.status !== "success") {
                  throw new Error("Collect failed");
                }
                await refetchCollectableAmount();
                resolve();
              } catch (error) {
                reject(error);
              } finally {
                setIsCollectProcessing(false);
              }
            },
            onError: reject,
          }
        );
      });
    };

    try {
      await receiveStreams();
      await splitFunds();
      await collectFunds();
      console.log("All operations completed successfully");
    } catch (error) {
      console.error("Error managing drips:", error);
    }
  }, [
    accountId,
    address,
    cycles,
    erc20TokenAddress,
    writeReceiveStreams,
    refetchSplittableAmount,
    writeSplit,
    refetchCollectableAmount,
    writeCollect,
  ]);

  return {
    accountId,
    cycles,
    splittableAmount,
    collectableAmount,
    optimalReceivableAmount,
    handleReceiveAndCollect,
    isReceiving,
    isReceiveStreamsProcessing,
    isSpliting,
    isSplitProcessing,
    isCollecting,
    isCollectProcessing,
  };
}
