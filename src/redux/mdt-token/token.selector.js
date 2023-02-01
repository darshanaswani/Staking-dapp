import { createSelector } from "reselect";

export const selectTokenReducer = (state) => state.token;

export const selectToken = createSelector(
  selectTokenReducer,
  (state) => state.contract
);

export const selectTokenBalance = createSelector(selectTokenReducer, (state) =>
  state.balance.toFixed(4)
);

export const selectTokenApproved = createSelector(
  selectTokenReducer,
  (state) => state.tokenApproved
);
