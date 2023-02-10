import { CardBody, Button, CardFooter } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import "./Staking.styles.css";
import {
  selectToken,
  selectTokenApproved,
  selectTokenBalance,
} from "../../redux/mdt-token/token.selector";
import { selectStakingContract } from "../../redux/staking-contract/staking.selectors";
import { selectUserDepositInfo } from "../../redux/user-deposit/user-deposit.selector";
import {
  approveTokens,
  loadDetailsAfterStaking,
  withDrawAmount,
} from "../../utilities/interactions";
import { selectWeb3Account } from "../../redux/web3/web3.selector";
import { useEffect, useState } from "react";
import StakingModal from "../StakingModal/StakingModal.component";
import Timer from "../Timer/Timer.component";
import { toast } from "react-toastify";

const Staking = () => {
  const mdtBalance = useSelector(selectTokenBalance);
  const token = useSelector(selectToken);
  const stakingContract = useSelector(selectStakingContract);
  const account = useSelector(selectWeb3Account);
  const tokenApproved = useSelector(selectTokenApproved);
  const [open, setOpen] = useState(false);
  const userDepositData = useSelector(selectUserDepositInfo);

  const dispatch = useDispatch();

  const handleApprove = () => {
    approveTokens(dispatch, token, stakingContract, account);
  };

  const handleWithDraw = () => {
    console.log("handle withdraw");

    const { endTime } = userDepositData;
    const remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
      withDrawAmount(account, stakingContract, token, dispatch);
    } else {
      toast.error("Maturity date not reached", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      // alert("Maturity date not reached");
    }
  };

  const handleStakingClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (account && tokenApproved) {
      loadDetailsAfterStaking(account, stakingContract, token, dispatch);
    }
  }, [account, tokenApproved, stakingContract, token, dispatch]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CardBody width={"90%"} display="block" padding={"40px"}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            colorScheme="blue"
            width={"20%"}
            background="transparent"
            border={"2px solid white"}
          >
            7
          </Button>
          <Button
            colorScheme="blue"
            width={"20%"}
            background="transparent"
            border={"2px solid white"}
            backgroundColor="rgba(128,90,213)"
          >
            14
          </Button>
          <Button
            colorScheme="blue"
            width={"20%"}
            background="transparent"
            border={"2px solid white"}
          >
            30
          </Button>
          <Button
            colorScheme="blue"
            width={"20%"}
            background="transparent"
            border={"2px solid white"}
          >
            60
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            padding: "5px",
          }}
        >
          <Button
            colorScheme="blue"
            width={"45%"}
            background="transparent"
            border={"2px solid white"}
          >
            90
          </Button>
          <Button
            colorScheme="blue"
            width={"45%"}
            background="transparent"
            border={"2px solid white"}
          >
            180
          </Button>
        </div>
      </CardBody>

      <CardBody className="details-container">
        <div className="details-group">
          <p className="details">
            Your staked amount :
            <span className="numbers">{userDepositData.depositAmount} MDT</span>
          </p>
          <p className="details">
            Maturity Date :
            <span className="numbers">
              {userDepositData.depositAmount !== "0" && account !== null ? (
                <Timer
                  start={userDepositData.depositTime}
                  end={userDepositData.endTime}
                />
              ) : (
                <></>
              )}
            </span>
          </p>
        </div>

        <div className="details-group">
          <p className="details">
            APY Rate :<span className="numbers">11 %</span>
          </p>
          <p className="details">
            Balance :
            <span className="numbers">
              {mdtBalance !== null ? mdtBalance : 0} MDT
            </span>
          </p>
        </div>
      </CardBody>

      <CardFooter
        width={"100%"}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        {tokenApproved !== "undefined" && tokenApproved ? (
          <>
            {console.log(tokenApproved)}
            <Button
              colorScheme="purple"
              width={"80%"}
              marginBottom="15px"
              onClick={() => {
                if (userDepositData.depositAmount !== "0") {
                  handleWithDraw();
                } else {
                  handleStakingClick();
                }
              }}
            >
              {userDepositData.depositAmount !== "0" ? "Withdraw" : "Stake"}
            </Button>

            <StakingModal
              open={open}
              handleStakingClick={handleStakingClick}
              stakingContract={stakingContract}
              token={token}
              account={account}
              mdtBalance={mdtBalance}
              dispatch={dispatch}
            />
          </>
        ) : (
          <Button
            colorScheme="purple"
            width={"80%"}
            onClick={handleApprove}
            disabled={account ? false : true}
          >
            Approve
          </Button>
        )}
      </CardFooter>
    </div>
  );
};

export default Staking;
