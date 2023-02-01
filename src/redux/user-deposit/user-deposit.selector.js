import { createSelector } from "reselect";

export const selectUserdepositReducer = (state) => state.userDepositDetails;

export const selectUserDepositFetching = createSelector(
  selectUserdepositReducer,
  (state) => state.isLoading
);

export const selectUserDepositInfo = createSelector(
  selectUserdepositReducer,
  (state) => state.userDepositInfo
);
