import { WEB3_TYPES } from "./web3.types";

export const loadedWeb3 = (payload) => ({
  type: WEB3_TYPES.WEB3_LOADED,
  payload,
});

export const web3LoadingError = (payload) => ({
  type: WEB3_TYPES.WEB3_ERROR,
  payload,
});

export const web3AccountLoaded = (payload) => ({
  type: WEB3_TYPES.WEB3_ACCOUNT_LOADED,
  payload,
});

export const web3AccountDisconnect = (payload) => ({
  type: WEB3_TYPES.WEB3_ACCOUNT_DISCONNECT,
});
