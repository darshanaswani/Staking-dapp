import { USER_DEPOSIT_ACTION_TYPES } from "./user-deposit.types";

const INITIAL_STATE = {
  isLoading: false,
  userDepositInfo: {
    depositAmount: 0,
    depositTime: null,
    endTime: null,
    userIndex: null,
    rewards: 0,
    paid: false,
  },
  error: null,
};

const userDepositReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_FETCHED:
      return {
        ...state,
        userDepositInfo: payload,
        isLoading: false,
        error: null,
      };

    case USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    case USER_DEPOSIT_ACTION_TYPES.USER_DEPOSIT_DETAILS_RESET:
      return {
        ...state,
        userDepositInfo: {
          depositAmount: 0,
          depositTime: null,
          endTime: null,
          userIndex: null,
          rewards: 0,
          paid: false,
        },
      };

    default:
      return state;
  }
};

export default userDepositReducer;
