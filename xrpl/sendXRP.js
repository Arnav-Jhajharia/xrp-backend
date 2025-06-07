const { connect, Wallet } = require('./xrplClient');

/**
 * Sends XRP from one wallet to another
 * @param {string} seed - Seed of the source wallet
 * @param {string} destination - Classic address of the recipient
 * @param {number|string} amountDrops - Amount in drops (1 XRP = 1e6 drops)
 * @returns {Promise<Object>} transaction result
 */
async function sendXRP(seed, destination, amountDrops) {
  const client = await connect();
  const wallet = Wallet.fromSeed(seed);

  const tx = {
    TransactionType: 'Payment',
    Account:         wallet.classicAddress,
    Amount:          amountDrops.toString(),
    Destination:     destination
  };

  const prepared = await client.autofill(tx);
  const signed   = wallet.sign(prepared);
  const result   = await client.submitAndWait(signed.tx_blob);
  return result;
}

module.exports = { sendXRP };