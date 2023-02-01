import { USER_DEPOSIT_ACTION_TYPES } from "./user-deposit.types";

export const userDepositFetched = (payload) => ({
  type: USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_FETCHED,
  payload,
});

export const userDepositFetching = () => ({
  type: USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_LOADING,
});

export const userDepositFetchingError = (payload) => ({
  type: USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_ERROR,
  payload,
});

export const userDepositDetailsReset = () => ({
  type: USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_RESET,
});
