import { Address } from "viem";

export type Token = {
  symbol: string;
  name: string;
  address: Address;
};

export interface GroupedStream {
  poolId: string;
  strategyAddress: string;
  avatar: string;
  name: string;
  description: string;
  token: string;
  recipient: string;
  duration: number;
  capyNftId: string;
  recipientDriverAccountId: string;
  createdAt: number;
  totalAllocation: string;
}
