const { Client, Wallet } = require('xrpl');
require('dotenv').config();

// XRPL endpoint (Testnet by default)
const NETWORK = process.env.XRPL_ENDPOINT || 'wss://s.altnet.rippletest.net:51233';
const client  = new Client(NETWORK);

/**
 * Connects to the XRPL network if not already connected
 * @returns {Client}
 */
async function connect() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client;
}

module.exports = { client, connect, Wallet };