export const DECIMALS = 10 ** 18;

// Shortcut to avoid passing around web3 connection
export const conversion = (wei) => {
  if (wei) {
    return wei / DECIMALS; // 18 decimal places
  }
};
