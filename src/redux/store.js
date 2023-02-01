import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import rootReducer from "./root-reducer";

const middlewares = [logger];
const composedEnhancers = compose(applyMiddleware(...middlewares));

const store = createStore(rootReducer, composedEnhancers);

export default store;
