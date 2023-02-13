import {
  farmingContractLoading,
  farmingContractLoaded,
  farmingContractError,
} from "../redux/farming-contract/farming.actions";
import {
  lpTokenLoaded,
  lpTokenError,
  lpTokenLoading,
  lpTokenApproved,
  lpTokenApprovalLoading,
  lpTokenApprovalError,
  lpTokenBalanceLoaded,
  lpTokenReset,
} from "../redux/lpToken/lpToken.actions";
import LpToken from "../abis/LpToken.json";
import FarmingContract from "../abis/farming.json";
import { conversion, getEtherValue, getWeiValue } from "../utilities/helper";
import { toast } from "react-toastify";
import Web3 from "web3";
import {
  farmingUserDepositFetched,
  farmingUserDepositFetching,
  farmingUserDepositError,
  farmingUserDepositReset,
} from "../redux/farming-user-deposit/farming-user-deposit.actions";

export const loadlpToken = async (web3, dispatch) => {
  try {
    dispatch(lpTokenLoading());
    const token = new web3.eth.Contract(LpToken.abi, LpToken.address);
    dispatch(lpTokenLoaded(token));
    return token;
  } catch (error) {
    dispatch(lpTokenError(error));
    return null;
  }
};

export const loadFarmingContract = async (web3, dispatch) => {
  try {
    dispatch(farmingContractLoading());
    const farmingContract = new web3.eth.Contract(
      FarmingContract.abi,
      FarmingContract.address
    );
    dispatch(farmingContractLoaded(farmingContract));
    return farmingContract;
  } catch (error) {
    dispatch(farmingContractError(error));
    console.log(
      "Contract not deployed to the current network. Please select another network with Metamask."
    );
    return null;
  }
};

export const getlpTokensTotalSupply = async (token) => {
  return await token.methods.totalSupply().call();
};

export const approveLpTokens = async (
  dispatch,
  lpToken,
  farmingContract,
  account
) => {
  const totalSupply = await getlpTokensTotalSupply(lpToken);
  console.log(totalSupply);
  if (typeof account !== "undefined") {
    const receipt = await lpToken.methods
      .approve(farmingContract.options.address, totalSupply)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("token approving");
        dispatch(lpTokenApprovalLoading());
      });
    if (receipt?.events?.Approval?.returnValues) {
      dispatch(lpTokenApproved(true));
    } else {
      dispatch(lpTokenApprovalError({ error: "Transaction unsuccessful" }));
    }
  } else {
    console.log("Please connect to metamask");
    return;
  }
};

export const checkLpTokenAllowance = async (
  dispatch,
  lpToken,
  farmingContract,
  account
) => {
  const farmingContractAddress = farmingContract?.options?.address;
  console.log("check allowance");
  if (account && farmingContract && lpToken) {
    const allowance = await lpToken?.methods
      ?.allowance(account, farmingContractAddress)
      ?.call();
    if (allowance !== "0") {
      dispatch(lpTokenApproved(true));
      return true;
    } else {
      dispatch(lpTokenApproved(false));
      return false;
    }
  }
};

export const loadLpTokenBalance = async (dispatch, account, token) => {
  if (typeof account !== "undefined") {
    const tokenBalance = await token?.methods?.balanceOf(account).call();
    dispatch(lpTokenBalanceLoaded(conversion(tokenBalance)));
  }
};

export const loadUserDepositDetails = async (
  dispatch,
  account,
  farmingContract,
  token
) => {
  try {
    const userDepositDetails = await farmingContract.methods
      .userDeposits(account)
      .call();

    const participants = await farmingContract.methods
      .totalParticipants()
      .call();

    const currentBlock = await farmingContract.methods.currentBlock().call();

    const calculation =
      (Number(currentBlock) - Number(userDepositDetails[1])) * 3;
    const milliSeconds = (3600 - calculation) * 1000;

    const timeStamp = Date.now() + milliSeconds;

    const stakedBalance = await farmingContract.methods.stakedBalance().call();
    const rewsPerBlock = getEtherValue(
      await farmingContract.methods.rewPerBlock().call()
    );

    const rewardsPerMinute = (60 / 3) * Number(rewsPerBlock);

    const poolshare =
      Number(getEtherValue(stakedBalance)) /
      Number(getEtherValue(userDepositDetails[0]));

    const data = {
      amount: getEtherValue(userDepositDetails[0]),
      initialState: userDepositDetails[1],
      latestClaim: userDepositDetails[2],
      currentPeriod: userDepositDetails[3],
      timeRemaining: timeStamp,
      participants,
      poolshare,
      rewardsPerMinute,
    };
    loadLpTokenBalance(dispatch, account, token);
    dispatch(farmingUserDepositFetched(data));
  } catch (error) {
    console.log(error);
    dispatch(farmingUserDepositError(error));
  }
};

export const stakeAmount = async (
  account,
  amount,
  farmingContract,
  token,
  dispatch
) => {
  try {
    const weiValue = Web3.utils.toWei(amount, "ether");

    let toastId = 0;
    dispatch(farmingUserDepositFetching());
    const receipt = await farmingContract.methods
      .stake(weiValue)
      .send({ from: account })
      .on("transactionHash", (hash) => {
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
      isLoading: false,
    });
    loadUserDepositDetails(dispatch, account, farmingContract, token);
  } catch (err) {
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

export const harvestRewards = async (farmingContract, account) => {
  let toastId;
  try {
    const receipt = await farmingContract.methods
      .claimRewards()
      .send({
        from: account,
      })
      .on("transactionHash", (hash) => {
        toast.dismiss();
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
      });
    console.log(receipt);
    toast.update(toastId, {
      render: "Harvesting Successful",
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "success",
      isLoading: false,
    });
  } catch (error) {
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

export const unStakeAmount = async (
  dispatch,
  farmingContract,
  token,
  account,
  amount
) => {
  let toastId;
  dispatch(farmingUserDepositFetching());
  const receipt = await farmingContract.methods
    .withdraw(getWeiValue(amount))
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      toast.dismiss();
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
    });

  toast.update(toastId, {
    render: "Unstake Successful",
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    type: "success",
    isLoading: false,
  });
  console.log(receipt);
  loadUserDepositDetails(dispatch, account, farmingContract, token);
};

export const disconnectFarmingUser = (dispatch) => {
  dispatch(lpTokenReset());
  dispatch(farmingUserDepositReset());
};
