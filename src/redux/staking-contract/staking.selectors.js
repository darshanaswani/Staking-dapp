import { createSelector } from "reselect";

export const selectStakingReducer = (state) => state.staking;

export const selectStakingContract = createSelector(
  selectStakingReducer,
  (state) => state.contract
);
