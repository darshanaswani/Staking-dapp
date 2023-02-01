import { STAKING_ACTION_TYPES } from "./staking.types";

export const stakingContractLoaded = (payload) => ({
  type: STAKING_ACTION_TYPES.STAKING_LOADED,
  payload,
});

export const stakingContractLoadingError = (payload) => ({
  type: STAKING_ACTION_TYPES.STAKING_LOADING_ERROR,
  payload,
});
