import { FARMING_USERDEPOSIT_ACTION_TYPES } from "./farming-user-deposit.types";

const INITIAL_STATE = {
  isLoading: false,
  userDepositDetails: {
    amount: 0,
    initialState: "",
    latestClaim: "",
    currentPeriod: "",
    participants: 0,
    timeRemaining: 1000,
    poolShare: 0,
  },
  error: null,
};

const farmingDepositReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_FETCHING:
      return {
        ...state,
        isLoading: true,
      };
    case FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_FETCHED:
      return {
        ...state,
        isLoading: false,
        userDepositDetails: payload,
      };
    case FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    case FARMING_USERDEPOSIT_ACTION_TYPES.FARMING_USERDEPOSIT_RESET:
      return {
        ...state,
        isLoading: false,
        error: null,
        userDepositDetails: {
          amount: 0,
          initialState: "",
          latestClaim: "",
          currentPeriod: "",
          participants: 0,
          timeRemaining: Date.now(),
          poolShare: 0,
        },
      };

    default:
      return state;
  }
};

export default farmingDepositReducer;
