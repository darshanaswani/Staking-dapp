import { STAKING_ACTION_TYPES } from "./staking.types";

const INITIAL_STATE = {
  isLoading: true,
  contract: {},
  error: null,
};

const stakingReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case STAKING_ACTION_TYPES.STAKING_LOADED:
      return {
        ...state,
        contract: payload,
        isLoading: false,
      };
    case STAKING_ACTION_TYPES.STAKING_LOADING_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default stakingReducer;
