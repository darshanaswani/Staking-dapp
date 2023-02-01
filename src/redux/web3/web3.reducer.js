import { WEB3_TYPES } from "./web3.types";

const INITIAL_STATE = {
  web3Data: {},
  isLoading: true,
  error: null,
  account: null,
};

const web3Reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case WEB3_TYPES.WEB3_LOADED:
      return {
        ...state,
        isLoading: false,
        web3Data: payload,
      };
    case WEB3_TYPES.WEB3_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    case WEB3_TYPES.WEB3_ACCOUNT_LOADED:
      return {
        ...state,
        account: payload,
      };
    case WEB3_TYPES.WEB3_ACCOUNT_DISCONNECT:
      return {
        ...state,
        account: null,
      };

    default:
      return state;
  }
};

export default web3Reducer;
