import { TOKEN_ACTION_TYPES } from "./token.types";
const INITIAL_STATE = {
  contract: {},
  isLoading: true,
  error: null,
  balance: 0,
};

const tokenReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOKEN_ACTION_TYPES.TOKEN_LOADED:
      return {
        ...state,
        isLoading: false,
        contract: payload,
      };
    case TOKEN_ACTION_TYPES.TOKEN_LOADING_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    case TOKEN_ACTION_TYPES.TOKEN_BALANCE_LOADED:
      return { ...state, balance: payload };
    case TOKEN_ACTION_TYPES.TOKEN_APPROVAL_LOADING:
      return {
        ...state,
        tokenApprovalLoading: true,
      };
    case TOKEN_ACTION_TYPES.TOKEN_APPROVED:
      return {
        ...state,
        tokenApprovalLoading: false,
        tokenApproved: payload,
      };
    case TOKEN_ACTION_TYPES.TOKEN_APPROVAL_ERROR:
      return {
        ...state,
        tokenApprovalError: payload,
      };
    case TOKEN_ACTION_TYPES.TOKEN_RESET:
      return {
        ...state,
        balance: 0,
        tokenApproved: false,
      };

    default:
      return state;
  }
};

export default tokenReducer;
