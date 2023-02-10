import Web3 from "web3";
export const DECIMALS = 10 ** 18;

// Shortcut to avoid passing around web3 connection
export const conversion = (wei) => {
  if (wei) {
    return wei / DECIMALS; // 18 decimal places
  }
};

export const bscChainId = 97;

export const getNetworkDetails = () => ({
  chainId: Web3.utils.toHex(bscChainId),
  chainName: "Bscscan testnet",
  nativeCurrency: {
    name: "TBNB",
    symbol: "TBNB", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://data-seed-prebsc-2-s3.binance.org:8545"],
  blockExplorerUrls: ["https://testnet.bscscan.com/"],
});

export const getHexChainId = () => {
  return Web3.utils.toHex(bscChainId);
};

export const getEtherValue = (amount) => Web3.utils.fromWei(amount, "ether");

export const getWeiValue = (amount) => Web3.utils.toWei(amount, "ether");
