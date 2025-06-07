const { connect } = require('./xrplClient');

/**
 * Fetches the XRP balance for a given XRPL address
 * @param {string} address - Classic address
 * @returns {Promise<string>} balance in XRP (string)
 */
async function getBalance(address) {
  const client = await connect();
  const drops  = await client.getXrpBalance(address); // returns balance in drops
  // Convert drops (1 XRP = 1e6 drops) to XRP string
  const xrp = (Number(drops) / 1_000_000).toFixed(6);
  return xrp;
}

module.exports = { getBalance };