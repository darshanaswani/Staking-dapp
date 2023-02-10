import { LPTOKEN_ACTION_TYPES } from "./lpToken.types";

const INITIAL_STATE = {
  contract: {},
  isLoading: false,
  error: null,
  tokenApprovalLoading: false,
  tokenApproved: false,
  tokenApprovalError: null,
  balance: 0,
};

const lpTokenReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case LPTOKEN_ACTION_TYPES.LPTOKEN_CONTRACT_LOADED:
      return {
        ...state,
        contract: payload,
        isLoading: false,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_CONTRACT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_CONTRACT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_APPROVAL_LOADING:
      return {
        ...state,
        tokenApprovalLoading: true,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_APPROVED:
      return {
        ...state,
        tokenApprovalLoading: false,
        tokenApproved: payload,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_APPROVAL_ERROR:
      return {
        ...state,
        tokenApprovalLoading: false,
        tokenApprovalError: payload,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_LOAD_BALANCE:
      return {
        ...state,
        balance: payload,
      };
    case LPTOKEN_ACTION_TYPES.LPTOKEN_RESET:
      return {
        ...state,
        tokenApproved: false,
        balance: 0,
      };
    default:
      return state;
  }
};

export default lpTokenReducer;
