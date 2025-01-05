"use client"
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "@/providers/wagmi/config";


const USDE_ADDRESS = "0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27";
const USDE_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const LowBalanceModal: React.FC = () => {
  const [balance, setBalance] = useState<number>();
  const [isVisible, setIsVisible] = useState(false);
  const { address } = useAccount();

  const checkFaucetBalance = async () => {
    try {
      if (!address) return;
      const balance = await readContract(config, {
        address: USDE_ADDRESS,
        abi: USDE_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(Number(balance));
    } catch (err) {
      console.error("Failed to check user balance:", err);
    }
  };

  useEffect(() => {
    checkFaucetBalance();
  }, [address]);



  useEffect(() => {
    if (balance !== undefined && balance < 1) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [balance]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="bg-white rounded-lg p-6 w-80 shadow-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="https://assets.coingecko.com/coins/images/33613/standard/usde.png?1733810059"
          alt="USDe Coin"
          className="mx-auto mb-4 w-16 h-16"
        />
        <h2 className="text-lg font-semibold mb-2">Low Balance!</h2>
        <p className="text-sm text-gray-600 mb-4">
          Get free USDe tokens from the faucet below.
        </p>
        <a
          href="https://usde-bridge.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go to Faucet
        </a>
      </div>
    </div>
  );
};

export default LowBalanceModal;