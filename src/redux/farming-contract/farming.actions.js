import { FARMING_ACTION_TYPES } from "./farming.types";

export const farmingContractLoading = () => ({
  type: FARMING_ACTION_TYPES.FARMING_CONTRACT_LOADING,
});

export const farmingContractLoaded = (payload) => ({
  type: FARMING_ACTION_TYPES.FARMING_CONTRACT_LOADED,
  payload,
});

export const farmingContractError = (payload) => ({
  type: FARMING_ACTION_TYPES.FARMING_CONTRACT_ERROR,
  payload,
});
