import { FARMING_USERDEPOSIT_ACTION_TYPES } from "./farming-user-deposit.types";

export const farmingUserDepositFetching = () => ({
  type: FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_FETCHING,
});

export const farmingUserDepositFetched = (payload) => ({
  type: FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_FETCHED,
  payload,
});

export const farmingUserDepositError = (payload) => ({
  type: FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_ERROR,
  payload,
});

export const farmingUserDepositReset = () => ({
  type: FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_RESET,
});
