import { create } from "zustand";
import { devtools } from "zustand/middleware";

import createGlobalStateSlice from "./create-global-state-slice";

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown;

type State = StateFromFunctions<[typeof createGlobalStateSlice]>;

const useStore = create<State>()(
  devtools(
    (set, get, store) => ({
      ...createGlobalStateSlice(set, get, store),
    }),
    { name: "CapyFlows" }
  )
);

export default useStore;
