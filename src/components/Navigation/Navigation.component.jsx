import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWeb3Account,
  selectWeb3Loaded,
} from "../../redux/web3/web3.selector";
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
import { disconnectFarmingUser } from "../../utilities/farming-interactions";
import { selectFarmingContract } from "../../redux/farming-contract/farming.selectors";
import { selectLpToken } from "../../redux/lpToken/lpToken.selectors";

const Navigation = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useSelector(selectWeb3Account);
  const token = useSelector(selectToken);
  const stakingContract = useSelector(selectStakingContract);
  const web3 = useSelector(selectWeb3Loaded);
  const farmingContract = useSelector(selectFarmingContract);
  const lpToken = useSelector(selectLpToken);

  const handleAccountChange = async (...args) => {
    // you can console to see the args
    console.log("handle account change");
    console.log(args[0]);
    const accounts = args[0];
    // if no accounts that means we are not connected
    if (accounts.length === 0) {
      console.log("Please connect to metamask");
      // our old data is not current connected account
      // currentAccount account that you already fetched and assume you stored it in useState
    } else if (accounts[0] !== account) {
      // if account changed you should update the currentAccount so you return the updated the data
      // assuming you have [currentAccount,setCurrentAccount]=useState
      // however you are tracking the state currentAccount, you have to update it. in case of redux you have to dispatch update action etc
      // setCurrentAccount(accounts[0)
      console.log(account);
      console.log(accounts[0]);
      if (account)
        await connectWallet(
          dispatch,
          token,
          stakingContract,
          web3,
          farmingContract,
          lpToken
        );
      console.log("DONE");
    }
  };

  const handleChainIdChange = async (chainId) => {
    window.location.reload(true);
    toast.success("chain id changed", {
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

  const handleDisconnect = () => {
    disconnectAccount(dispatch, account);
    disconnectFarmingUser(dispatch);
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

  useEffect(() => {
    window?.ethereum?.on("accountsChanged", handleAccountChange);
    return () => {
      window?.ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
  });

  useEffect(() => {
    window?.ethereum?.on("chainChanged", handleChainIdChange);
    return () => {
      window?.ethereum?.removeListener("chainChanged", handleChainIdChange);
    };
  });

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
          onClick={async () => {
            await connectWallet(
              dispatch,
              token,
              stakingContract,
              web3,
              farmingContract,
              lpToken
            );
          }}
        >
          Connect
        </Button>
      )}
    </div>
  );
};

export default Navigation;
