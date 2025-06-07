const fetch = require('node-fetch');

/**
 * Requests test XRP from the XRPL Testnet faucet for a given address
 * @param {string} address - Classic address to fund
 * @returns {Promise<Object>} faucet response
 */
async function fundTestnet(address) {
  const response = await fetch('https://faucet.altnet.rippletest.net/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination: address })
  });
  const data = await response.json();
  return data.account;
}

module.exports = { fundTestnet };