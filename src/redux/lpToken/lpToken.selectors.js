import { createSelector } from "reselect";

export const selectLpTokenReducer = (state) => state.lpToken;

export const selectLpToken = createSelector(
  selectLpTokenReducer,
  (state) => state.contract
);

export const selectLpTokenApproved = createSelector(
  selectLpTokenReducer,
  (state) => state.tokenApproved
);

export const selectLpTokenBalance = createSelector(
  selectLpTokenReducer,
  (state) => state.balance
);
