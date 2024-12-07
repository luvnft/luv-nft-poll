import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { RPC_URL, PRIVATE_KEY } from "./constants.js";
import { anvil, sepolia } from "wagmi/chains";

export const ethenaTestnet = defineChain({
  id: 31337, //52085143,
  name: "ethenaTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.rpc.ethena.fi"],
    },
  },
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

export const account = privateKeyToAccount(PRIVATE_KEY);

export const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(RPC_URL),
});
