import { Address } from "viem";

export type Token = {
  symbol: string;
  name: string;
  address: Address;
};

export interface FundingFlowState {
  address: string;
  emojiCodePoint: string;
  token: Token | null;
  description: string;
  duration: string;
  allocation: string;
  recipient: Address;
  creator?: Address;
  createdAt: string;
}
