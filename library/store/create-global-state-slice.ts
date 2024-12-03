import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Address } from "viem";

type State = {
  profile: {
    name: string;
    id: Address | null;
  };
  token: Address;
};

type Actions = {
  setCurrentProfile: (profile: { name: string; id: Address }) => void;
  clearCurrentProfile: () => void;
  setToken: (token: Address) => void;
};

export type ConnectorSlice = State & Actions;

export default persist(
  immer<State & Actions>((set) => ({
    profile: {
      name: "",
      id: null,
    },
    token: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",

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

    setToken: (token) =>
      set((state) => {
        state.token = token;
      }),
  })),
  {
    name: "app-storage",
    storage: createJSONStorage(() => localStorage),
  }
);
