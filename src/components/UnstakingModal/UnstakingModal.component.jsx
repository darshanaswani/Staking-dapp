import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { unStakeAmount } from "../../utilities/farming-interactions";
import { useSelector } from "react-redux";
import {
  selectFarmingUserDepositIsFetching,
  selectFarmingUserDepositDetails,
} from "../../redux/farming-user-deposit/farming-user-deposit.selector";
import { toast } from "react-toastify";

const UnstakingModal = ({
  open,
  handleUnStakingClick,
  farmingContract,
  lpToken,
  account,
  stakingAmount,
  dispatch,
  mdtEarned,
}) => {
  const [amount, setAmount] = useState(0);
  const userDepositFetchingStarted = useSelector(
    selectFarmingUserDepositIsFetching
  );
  const userDepositDetails = useSelector(selectFarmingUserDepositDetails);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConfirmUnStakingClick = async () => {
    const currentBlock = await farmingContract.methods.currentBlock().call();

    const calculation =
      (Number(currentBlock) - Number(userDepositDetails?.initialState)) * 3;
    const milliSeconds = (3600 - calculation) * 1000;

    console.log("account", account);
    console.log("mdtEarned", mdtEarned);
    console.log("amount", amount);
    console.log("milliseconds", milliSeconds);

    if (
      account &&
      mdtEarned >= 0 &&
      mdtEarned <= 20 &&
      milliSeconds <= 0 &&
      amount <= stakingAmount &&
      amount > 0
    ) {
      unStakeAmount(dispatch, farmingContract, lpToken, account, amount);
    } else {
      toast.dismiss();
      toast.error("please harvest your rewards first", {
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

  return (
    <Modal isOpen={open} onClose={handleUnStakingClick} isCentered>
      <ModalOverlay />

      <ModalContent
        boxShadow="dark-lg"
        borderRadius="5px"
        border="2px solid grey"
        background="rgba(30,28,32,0.6)"
        backdropFilter="saturate(180%) blur(10px)"
        padding="5px"
        display="flex"
      >
        {userDepositFetchingStarted ? (
          <>
            <ModalBody
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </ModalBody>
            <ModalBody display="flex" justifyContent="center">
              <Text fontSize="xl" color="white" fontWeight="bold">
                processing....
              </Text>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader
              fontWeight="bold"
              fontSize="3xl"
              textAlign="center"
              textColor="white"
            >
              Unstake
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <Input
                color="white"
                size="md"
                value={amount}
                onChange={handleChange}
                placeholder="Amount"
                border="1px solid white"
                borderRadius="5px"
              />
              <Button
                width="60px"
                height="26px"
                lineHeight="30px"
                background="white"
                borderRadius="4px"
                color="purple"
                textAlign="center"
                position="absolute"
                top="52%"
                right="40px"
                marginTop="-15px"
                fontSize="sm"
                cursor="pointer"
                onClick={() => {
                  setAmount(stakingAmount);
                }}
              >
                Max
              </Button>
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button
                colorScheme="purple"
                onClick={handleConfirmUnStakingClick}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UnstakingModal;
