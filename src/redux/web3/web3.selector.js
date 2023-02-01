import { createSelector } from "reselect";

const selectWeb3Reducer = (state) => state.web3;

export const selectWeb3Loading = createSelector(
  selectWeb3Reducer,
  (state) => state.isLoading
);

export const selectWeb3Loaded = createSelector(
  selectWeb3Reducer,
  (state) => state.web3Data
);

export const selectWeb3Error = createSelector(
  selectWeb3Reducer,
  (state) => state.error
);

export const selectWeb3Account = createSelector(
  selectWeb3Reducer,
  (state) => state.account
);
