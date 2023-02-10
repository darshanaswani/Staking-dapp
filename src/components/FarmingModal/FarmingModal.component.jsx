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
import { stakeAmount } from "../../utilities/farming-interactions";
import { useSelector } from "react-redux";
import { selectUserDepositFetching } from "../../redux/user-deposit/user-deposit.selector";
import { toast } from "react-toastify";

const FarmingModal = ({
  open,
  handleStakingClick,
  farmingContract,
  lpToken,
  account,
  lpTokenBalance,
  dispatch,
}) => {
  const [amount, setAmount] = useState(0);
  const userDepositFetchingStarted = useSelector(selectUserDepositFetching);
  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConfirmStakeAmountClick = () => {
    if (account !== "undefined" && amount <= lpTokenBalance && amount > 0) {
      stakeAmount(account, amount, farmingContract, lpToken, dispatch);
    } else {
      toast.dismiss();
      toast.error("check user account or amount", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log("check user account or amount");
    }
  };

  return (
    <Modal isOpen={open} onClose={handleStakingClick} isCentered>
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
              Stake
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
                  setAmount(lpTokenBalance);
                }}
              >
                Max
              </Button>
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button
                colorScheme="purple"
                onClick={handleConfirmStakeAmountClick}
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

export default FarmingModal;
