import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectWeb3Account } from "../../redux/web3/web3.selector";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { connectWallet, disconnectAccount } from "../../utilities/interactions";
import { selectToken } from "../../redux/mdt-token/token.selector";
import { selectStakingContract } from "../../redux/staking-contract/staking.selectors";
import { toast } from "react-toastify";

const Navigation = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useSelector(selectWeb3Account);
  const token = useSelector(selectToken);
  const stakingContract = useSelector(selectStakingContract);

  const handleDisconnect = () => {
    disconnectAccount(dispatch);
    onClose();
    toast.success("Disconnected account successfully !", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <div
      className="navigation"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        height: "15vh",
        padding: "20px",
      }}
    >
      {account !== null ? (
        <>
          <Button colorScheme="purple" width={"20%"} onClick={onOpen}>
            {account.slice(0, 5) + "...." + account.slice(37)}
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent
              boxShadow="dark-lg"
              borderRadius="5px"
              border="2px solid grey"
              background="rgba(30,28,32,0.6)"
              backdropFilter="saturate(180%) blur(10px)"
              padding="5px"
              alignItems="center"
            >
              <ModalHeader
                fontWeight="bold"
                fontSize="3xl"
                textAlign="center"
                textColor="white"
              >
                Your Wallet
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody
                border="1px solid white"
                borderRadius="5px"
                width="-webkit-max-content"
              >
                <Text color="white">{account}</Text>
              </ModalBody>
              <ModalFooter justifyContent="center">
                <Button colorScheme="purple" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Button
          colorScheme="purple"
          width={"20%"}
          onClick={() => {
            connectWallet(dispatch, token, stakingContract);
          }}
        >
          Connect
        </Button>
      )}
    </div>
  );
};

export default Navigation;
