import { FARMING_ACTION_TYPES } from "./farming.types";

const INITIAL_STATE = {
  contract: {},
  isLoading: false,
  error: null,
};

const farmingReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case FARMING_ACTION_TYPES.FARMING_CONTRACT_LOADED:
      return {
        ...state,
        contract: payload,
        isLoading: false,
      };
    case FARMING_ACTION_TYPES.FARMING_CONTRACT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case FARMING_ACTION_TYPES.FARMING_CONTRACT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default farmingReducer;
