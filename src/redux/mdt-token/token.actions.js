import { TOKEN_ACTION_TYPES } from "./token.types";

export const tokenLoaded = (payload) => ({
  type: TOKEN_ACTION_TYPES.TOKEN_LOADED,
  payload,
});

export const tokenLoadingError = (payload) => ({
  type: TOKEN_ACTION_TYPES.TOKEN_LOADING_ERROR,
  payload,
});

export const tokenBalanceLoaded = (payload) => ({
  type: TOKEN_ACTION_TYPES.TOKEN_BALANCE_LOADED,
  payload,
});

export const tokenApprovalLoading = () => ({
  type: TOKEN_ACTION_TYPES.TOKEN_APPROVAL_LOADING,
});

export const tokenApproved = (payload) => ({
  type: TOKEN_ACTION_TYPES.TOKEN_APPROVED,
  payload,
});

export const tokenApprovalError = (payload) => ({
  type: TOKEN_ACTION_TYPES.TOKEN_LOADING_ERROR,
  payload,
});

export const tokenReset = () => ({
  type: TOKEN_ACTION_TYPES.TOKEN_RESET,
});
