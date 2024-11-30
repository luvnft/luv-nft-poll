import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Address } from "viem";

type State = {
  profile: {
    name: string;
    id: Address | null;
  };
  token: Address | null;
};

type Actions = {
  setCurrentProfile: (name: string, id: Address) => void;
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
    token: null,

    setCurrentProfile: (name, id) =>
      set((state) => {
        state.profile = { name, id };
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
