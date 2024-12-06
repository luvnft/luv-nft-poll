import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Address } from "viem";

type State = {
  profile: {
    name: string;
    id: Address | null;
  };
  token: {
    USDe: Address;
    sUSDe: Address;
  };
};

type Actions = {
  setCurrentProfile: (profile: { name: string; id: Address }) => void;
  clearCurrentProfile: () => void;
};

export type ConnectorSlice = State & Actions;

export default persist(
  immer<State & Actions>((set) => ({
    profile: {
      name: "",
      id: null,
    },
    token: {
      USDe: "0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696",
      sUSDe: "0x1B6877c6Dac4b6De4c5817925DC40E2BfdAFc01b",
    },

    setCurrentProfile: (profile: { name: string; id: Address }) =>
      set((state) => {
        state.profile = profile;
      }),

    clearCurrentProfile: () =>
      set((state) => {
        state.profile = {
          name: "",
          id: null,
        };
      }),
  })),
  {
    name: "app-storage",
    storage: createJSONStorage(() => localStorage),
  }
);
