import React, { useEffect, useState } from "react";
import {
  Progress,
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
  Flex,
} from "@chakra-ui/react";
import "./Farming.styles.css";
import { useDispatch, useSelector } from "react-redux";
import { selectWeb3Account } from "../../redux/web3/web3.selector";
import {
  approveLpTokens,
  harvestRewards,
  loadUserDepositDetails,
} from "../../utilities/farming-interactions";
import {
  selectLpToken,
  selectLpTokenApproved,
} from "../../redux/lpToken/lpToken.selectors";
import { selectFarmingContract } from "../../redux/farming-contract/farming.selectors";
import { selectLpTokenBalance } from "../../redux/lpToken/lpToken.selectors.js";
import FarmingModal from "../FarmingModal/FarmingModal.component";
import { selectFarmingUserDepositDetails } from "../../redux/farming-user-deposit/farming-user-deposit.selector";
import CountDown from "react-countdown";
import { getEtherValue } from "../../utilities/helper";
import UnstakingModal from "../UnstakingModal/UnstakingModal.component";

const Farming = () => {
  const account = useSelector(selectWeb3Account);
  const lpToken = useSelector(selectLpToken);
  const farmingContract = useSelector(selectFarmingContract);
  const lpTokenApproved = useSelector(selectLpTokenApproved);
  const lpTokenBalance = useSelector(selectLpTokenBalance);
  const [mdtEarned, setMdtEarned] = useState(0);
  const [open, setOpen] = useState(false);
  const [unStakeOpen, setUnstakeOpen] = useState(false);
  const [distributionInfo, setDistributionInfo] = useState({
    totalRewards: 1000000,
    distribution: 200000,
  });

  const userDepositDetails = useSelector(selectFarmingUserDepositDetails);
  const dispatch = useDispatch();
  const shouldStartTheInterval =
    account &&
    lpTokenApproved &&
    userDepositDetails.amount !== 0 &&
    userDepositDetails.amount !== "0";

  useEffect(() => {
    if (account && lpTokenApproved) {
      loadUserDepositDetails(dispatch, account, farmingContract, lpToken);
    }
  }, [account, lpTokenApproved, farmingContract, lpToken, dispatch]);

  const handleLpTokenApproval = () => {
    approveLpTokens(dispatch, lpToken, farmingContract, account);
  };

  const handleLpStakingClick = () => {
    setOpen(!open);
  };

  const handleUnstakingClick = () => {
    setUnstakeOpen(!unStakeOpen);
    // console.log("unstaking click");
  };

  const calculateRewards = async () => {
    console.log("calculate rewards");
    const rewards = await farmingContract?.methods?.calculate(account).call();
    setMdtEarned(Number(getEtherValue(rewards)));
  };

  const calculateDistributedTokens = async () => {
    const currentBlock = await farmingContract?.methods?.currentBlock().call();
    const startingBlock = await farmingContract?.methods
      ?.startingBlock()
      .call();

    const rewPerBlock = await farmingContract?.methods?.rewPerBlock().call();
    const rewardsPerBlock = getEtherValue(rewPerBlock);

    const toRewards = await farmingContract?.methods?.totalReward().call();
    const totalRewards = getEtherValue(toRewards);

    const distribution =
      (Number(currentBlock) - Number(startingBlock)) * Number(rewardsPerBlock);

    setDistributionInfo({
      totalRewards,
      distribution,
    });
  };

  const handleHarvestClick = () => {
    if (account && lpTokenApproved && mdtEarned > 0) {
      harvestRewards(farmingContract, account);
    }
  };

  useEffect(() => {
    if (shouldStartTheInterval) {
      const intervalCall = setInterval(calculateRewards, 9000);
      return () => {
        // clean up
        clearInterval(intervalCall);
      };
    }
    // eslint-disable-next-line
  }, [shouldStartTheInterval]);

  useEffect(() => {
    if (farmingContract) {
      const intervalCall = setInterval(calculateDistributedTokens, 9000);
      return () => {
        // clean up
        clearInterval(intervalCall);
      };
    }
    // eslint-disable-next-line
  }, [farmingContract]);

  return (
    <div className="farming">
      <CardHeader
        display={"flex"}
        justifyContent="space-between"
        paddingBottom={"0"}
      >
        <Text fontSize="xl" color="white">
          Pool Details
        </Text>
        <Text
          color="white"
          fontSize="xl"
          display={"flex"}
          flexDir="column"
          alignItems={"flex-end"}
        >
          {userDepositDetails.amount !== 0 && userDepositDetails.amount !== "0"
            ? `${mdtEarned} MDT earned`
            : "MDT earned"}
          <Button
            colorScheme="purple"
            minWidth="inherit"
            fontSize="13px"
            marginTop="5px"
            display={"block"}
            onClick={handleHarvestClick}
          >
            HARVEST
          </Button>
        </Text>
      </CardHeader>
      <CardBody className="farming-details">
        <div className="farming-detail">
          APY
          <span>12012.72 %</span>
        </div>
        <div className="farming-detail">
          REWARD PER MINUTE
          <span>{userDepositDetails?.rewardsPerMinute?.toFixed(3)} MDT</span>
        </div>
        <div className="farming-detail">
          UNLOCKS IN
          <span>
            {userDepositDetails.amount !== 0 &&
            userDepositDetails.amount !== "0" ? (
              <CountDown date={userDepositDetails.timeRemaining} />
            ) : (
              "7 Days"
            )}
          </span>
        </div>
        <div className="farming-detail">
          YOUR STAKE
          <span>{userDepositDetails.amount} Cake-LP</span>
        </div>
        <div className="farming-detail">
          POOL SHARE
          <span>
            {userDepositDetails.poolshare
              ? `${userDepositDetails?.poolshare?.toFixed(4)} %`
              : "-"}
          </span>
        </div>

        <div className="farming-detail">
          PARTICIPANTS
          <span>{userDepositDetails.participants}</span>
        </div>
        <div className="farming-detail">
          DISTRIBUTED TOKENS
          <span>
            {distributionInfo?.distribution?.toFixed(3)} /{" "}
            {distributionInfo?.totalRewards}
          </span>
        </div>
        <Progress
          value={
            (distributionInfo?.distribution / distributionInfo?.totalRewards) *
            100
          }
          colorScheme="purple"
          borderRadius={"30px"}
        />
      </CardBody>

      <CardFooter color={"white"} paddingTop={0} paddingBottom={0}>
        Balance: {lpTokenBalance} Cake-LP
      </CardFooter>

      <CardFooter display={"flex"} flexDirection="column" alignItems={"center"}>
        <Button
          width={"100%"}
          background="transparent"
          border={"2px solid white"}
          color="white"
          marginBottom={"15px"}
        >
          VIEW POOL
        </Button>

        <Flex
          justifyContent={
            userDepositDetails.amount !== 0 && userDepositDetails.amount !== "0"
              ? "space-between"
              : "center"
          }
          width={
            userDepositDetails.amount !== 0 && userDepositDetails.amount !== "0"
              ? "100%"
              : "100%"
          }
        >
          <Button
            colorScheme="purple"
            width={
              userDepositDetails.amount !== 0 &&
              userDepositDetails.amount !== "0"
                ? "49%"
                : "100%"
            }
            onClick={() => {
              lpTokenApproved
                ? handleLpStakingClick()
                : handleLpTokenApproval();
            }}
            disabled={account !== null ? false : true}
          >
            {lpTokenApproved ? "STAKE" : "APPROVE"}
          </Button>

          {account &&
          lpTokenApproved &&
          userDepositDetails.amount !== 0 &&
          userDepositDetails.amount !== "0" ? (
            <Button
              colorScheme="purple"
              width={"49%"}
              onClick={() => {
                handleUnstakingClick();
              }}
              disabled={account !== null ? false : true}
            >
              UNSTAKE
            </Button>
          ) : null}
        </Flex>

        <UnstakingModal
          open={unStakeOpen}
          handleUnStakingClick={handleUnstakingClick}
          farmingContract={farmingContract}
          lpToken={lpToken}
          account={account}
          stakingAmount={userDepositDetails?.amount}
          dispatch={dispatch}
          mdtEarned={mdtEarned}
        />

        <FarmingModal
          open={open}
          handleStakingClick={handleLpStakingClick}
          farmingContract={farmingContract}
          lpToken={lpToken}
          account={account}
          lpTokenBalance={lpTokenBalance}
          dispatch={dispatch}
        />
      </CardFooter>
    </div>
  );
};

export default Farming;
