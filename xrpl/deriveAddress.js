const { Wallet } = require('xrpl');

/**
 * Derives an XRPL classic address from a given seed
 * @param {string} seed - Wallet seed
 * @returns {string} classicAddress
 */
function deriveAddress(seed) {
  const wallet = Wallet.fromSeed(seed);
  return wallet.classicAddress;
}

module.exports = { deriveAddress };