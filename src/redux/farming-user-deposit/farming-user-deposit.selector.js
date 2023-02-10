import { createSelector } from "reselect";

export const selectFarmingUserDepositReducer = (state) =>
  state.farmingUserDeposit;

export const selectFarmingUserDepositIsFetching = createSelector(
  selectFarmingUserDepositReducer,
  (state) => state.isLoading
);

export const selectFarmingUserDepositDetails = createSelector(
  selectFarmingUserDepositReducer,
  (state) => state.userDepositDetails
);

export const selectFarmingUserDepositError = createSelector(
  selectFarmingUserDepositReducer,
  (state) => state.error
);
