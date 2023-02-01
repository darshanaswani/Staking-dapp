import Web3 from "web3";
import {
  loadedWeb3,
  web3AccountDisconnect,
  web3AccountLoaded,
} from "../redux/web3/web3.actions";
import Token from "../abis/MdtToken.json";
import Contract from "../abis/Staking.json";
import {
  tokenApprovalError,
  tokenApprovalLoading,
  tokenApproved,
  tokenBalanceLoaded,
  tokenReset,
  tokenLoaded,
  tokenLoadingError,
} from "../redux/mdt-token/token.actions";
import {
  stakingContractLoaded,
  stakingContractLoadingError,
} from "../redux/staking-contract/staking.actions";
import { conversion } from "./helper";
import {
  userDepositDetailsReset,
  userDepositFetched,
  userDepositFetching,
  userDepositFetchingError,
} from "../redux/user-deposit/user-deposit.actions";
import { toast } from "react-toastify";

export const loadWeb3 = (dispatch) => {
  if (typeof window.ethereum !== "undefined") {
    const web3 = new Web3(window.ethereum);
    dispatch(loadedWeb3(web3));
    return web3;
  } else {
    window.alert("Please install Metamask");
  }
};

export const loadToken = async (web3, dispatch) => {
  try {
    const token = new web3.eth.Contract(Token.abi, Token.address);
    dispatch(tokenLoaded(token));

    return token;
  } catch (error) {
    dispatch(tokenLoadingError(error));
    return null;
  }
};

export const loadStakingContract = async (web3, dispatch) => {
  try {
    const stakingContract = new web3.eth.Contract(
      Contract.abi,
      Contract.address
    );
    dispatch(stakingContractLoaded(stakingContract));
    return stakingContract;
  } catch (error) {
    dispatch(stakingContractLoadingError(error));
    console.log(
      "Contract not deployed to the current network. Please select another network with Metamask."
    );
    return null;
  }
};

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = await accounts[0];
  if (typeof account !== "undefined") {
    dispatch(web3AccountLoaded(account));
    return account;
  } else {
    window.alert("please login with metamask");
    return null;
  }
};

export const loadBalances = async (dispatch, account, token) => {
  if (typeof account !== "undefined") {
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(conversion(tokenBalance)));
  }
};

export const getTotalSupply = async (token) => {
  return await token.methods.totalSupply().call();
};

export const approveTokens = async (
  dispatch,
  token,
  stakingContract,
  account
) => {
  const totalSupply = await getTotalSupply(token);
  console.log(totalSupply);
  if (typeof account !== "undefined") {
    const receipt = await token.methods
      .approve(stakingContract.options.address, totalSupply)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        dispatch(tokenApprovalLoading());
      });
    if (receipt?.events?.Approval?.returnValues) {
      dispatch(tokenApproved(true));
    } else {
      dispatch(tokenApprovalError({ error: "Transaction unsuccessful" }));
    }
  } else {
    console.log("Please connect to metamask");
    return;
  }
};

export const checkAllowance = async (
  dispatch,
  token,
  stakingContract,
  account
) => {
  const stakingContractAddress = stakingContract?.options?.address;
  console.log("check allowance");
  if (account && stakingContract && token) {
    const allowance = await token?.methods
      ?.allowance(account, stakingContractAddress)
      ?.call();
    if (allowance !== "0") {
      dispatch(tokenApproved(true));
      return true;
    } else {
      dispatch(tokenApproved(false));
      return false;
    }
  }
};

export const loadDetailsAfterStaking = async (
  account,
  stakingContract,
  token,
  dispatch
) => {
  const userDepositeDetails = await stakingContract.methods
    .userDeposits(account)
    .call();

  const depositTimeStart = Number(userDepositeDetails[1]) * 1000;
  const depositTimeEnd = Number(userDepositeDetails[2]) * 1000;

  const diff =
    Number(userDepositeDetails[2]) * 1000 -
    Number(userDepositeDetails[1]) * 1000;

  console.log(depositTimeStart);
  console.log(depositTimeEnd);
  console.log(diff);

  const data = {
    depositAmount: Web3.utils.fromWei(userDepositeDetails[0], "ether"),
    depositTime: depositTimeStart,
    endTime: depositTimeEnd,
    userIndex: userDepositeDetails[3],
    rewards: userDepositeDetails[4],
    paid: userDepositeDetails[5],
  };
  dispatch(userDepositFetched(data));
  loadBalances(dispatch, account, token);
  return userDepositeDetails;
};

export const stakeAmount = async (
  account,
  amount,
  stakingContract,
  token,
  dispatch
) => {
  try {
    const weiValue = Web3.utils.toWei(amount, "ether");
    // dispatch(userDepositFetching());
    let toastId = 0;
    const receipt = await stakingContract.methods
      .stake(weiValue)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        dispatch(userDepositFetching());
        toastId = toast.loading("processing the transaction", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.log(hash);
      });
    console.log(receipt);
    toast.update(toastId, {
      render: "Stake transaction completed successfully",
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "success",
    });
    loadDetailsAfterStaking(account, stakingContract, token, dispatch);
  } catch (err) {
    dispatch(userDepositFetchingError(err));
    toast.dismiss();
    toast.error("Some error occured while transaction", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};

export const loadDetailsAfterWithDrawing = async (
  account,
  stakingContract,
  dispatch
) => {
  const userDepositeDetails = await stakingContract.methods
    .userDeposits(account)
    .call();
  console.log("user details after withdrawing");
  console.log(userDepositeDetails);

  const data = {
    depositAmount: userDepositeDetails[0],
    depositTime: userDepositeDetails[1],
    endTime: userDepositeDetails[2],
    userIndex: userDepositeDetails[3],
    rewards: userDepositeDetails[4],
    paid: userDepositeDetails[5],
  };

  dispatch(userDepositFetched(data));
  return userDepositeDetails;
};

export const withDrawAmount = async (
  account,
  stakingContract,
  token,
  dispatch
) => {
  try {
    const id = toast.loading("Processing...", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    console.log(id);
    const receipt = await stakingContract.methods
      .withdraw()
      .send({
        from: account,
      })
      .on("transactionHash", (hash) => {
        console.log(hash);
      });

    toast.update(id, {
      render: "Completed",
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "success",
    });
    console.log(receipt);
    loadDetailsAfterWithDrawing(account, stakingContract, dispatch);
    loadBalances(dispatch, account, token);
  } catch (error) {
    toast.dismiss();
    toast.error("Error while transaction", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};

export const connectWallet = (dispatch, token, stakingContract) => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        const account = accounts[0];
        console.log(`Wallet connected: ${account}`);
        dispatch(web3AccountLoaded(account));
        checkAllowance(dispatch, token, stakingContract, account);
        loadDetailsAfterStaking(account, stakingContract, token, dispatch);
        toast.success("Connected account successfully !", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        toast.error("Error occured while connecting to your wallet !", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Handle error
        console.log(error, error.code);

        // 4001 - The request was rejected by the user
        // -32602 - The parameters were invalid
        // -32603- Internal error
      });
  } else {
    window.open("https://metamask.io/download/", "_blank");
  }
};

export const disconnectAccount = (dispatch) => {
  dispatch(web3AccountDisconnect());
  dispatch(tokenReset());
  dispatch(userDepositDetailsReset());
};
