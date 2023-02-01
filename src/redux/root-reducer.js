import { combineReducers } from "redux";
import web3Reducer from "./web3/web3.reducer";
import tokenReducer from "./mdt-token/token.reducer";
import stakingReducer from "./staking-contract/staking.reducer";
import userDepositReducer from "./user-deposit/user-deposit.reducer";

const rootReducer = combineReducers({
  web3: web3Reducer,
  token: tokenReducer,
  staking: stakingReducer,
  userDepositDetails: userDepositReducer,
});

export default rootReducer;
