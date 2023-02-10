import { LPTOKEN_ACTION_TYPES } from "./lpToken.types";

export const lpTokenLoaded = (payload) => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_CONTRACT_LOADED,
  payload,
});

export const lpTokenLoading = () => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_CONTRACT_LOADING,
});

export const lpTokenError = (payload) => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_CONTRACT_ERROR,
  payload,
});

export const lpTokenApproved = (payload) => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_APPROVED,
  payload,
});

export const lpTokenApprovalLoading = () => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_APPROVAL_LOADING,
});

export const lpTokenApprovalError = (payload) => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_APPROVAL_ERROR,
  payload,
});

export const lpTokenBalanceLoaded = (payload) => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_LOAD_BALANCE,
  payload,
});

export const lpTokenReset = () => ({
  type: LPTOKEN_ACTION_TYPES.LPTOKEN_RESET,
});
