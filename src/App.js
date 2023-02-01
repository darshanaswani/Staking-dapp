import { useEffect, useState } from "react";
import Staking from "./components/Staking/Staking.component";
import Navigation from "./components/Navigation/Navigation.component";
import {
  loadToken,
  loadAccount,
  loadWeb3,
  loadStakingContract,
  loadBalances,
  checkAllowance,
} from "./utilities/interactions";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "./App.css";

const loadBlockChainData = async (dispatch) => {
  const web3 = loadWeb3(dispatch);
  const account = await loadAccount(web3, dispatch);
  const token = await loadToken(web3, dispatch);
  const stakingContract = await loadStakingContract(web3, dispatch);
  await loadBalances(dispatch, account, token);
  checkAllowance(dispatch, token, stakingContract, account);
  // subscribeToEvents(token, stakingContract, dispatch);
};

function App() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  if (!mounted) {
    //componentWillMount
    loadBlockChainData(dispatch);
  }

  useEffect(() => {
    //componentDidMount
    setMounted(true);
  }, []);

  return (
    <div className="App">
      <Navigation />
      <Staking />
      <ToastContainer />
    </div>
  );
}

export default App;
