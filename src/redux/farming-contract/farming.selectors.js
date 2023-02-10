import { createSelector } from "reselect";

export const selectFarmingReducer = (state) => state.farming;

export const selectFarmingContract = createSelector(
  selectFarmingReducer,
  (state) => state.contract
);
