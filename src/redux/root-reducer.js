import { combineReducers } from "redux";
import web3Reducer from "./web3/web3.reducer";
import tokenReducer from "./mdt-token/token.reducer";
import stakingReducer from "./staking-contract/staking.reducer";
import userDepositReducer from "./user-deposit/user-deposit.reducer";
import farmingReducer from "./farming-contract/farming.reducer";
import lpTokenReducer from "./lpToken/lpToken.reducer";
import farmingDepositReducer from "./farming-user-deposit/farming-user-deposit.reducer";

const rootReducer = combineReducers({
  web3: web3Reducer,
  token: tokenReducer,
  staking: stakingReducer,
  userDepositDetails: userDepositReducer,
  farming: farmingReducer,
  lpToken: lpTokenReducer,
  farmingUserDeposit: farmingDepositReducer,
});

export default rootReducer;
