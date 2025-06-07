const { connect, Wallet } = require('./xrplClient');
const xrpl = require('xrpl');

/**
 * Mints an XLS-20 NFT as a soul-bound passport
 * @param {string} seed - Seed of the issuing wallet
 * @param {string} uri - Metadata URI or DID reference
 * @returns {Promise<Object>} transaction result
 */
async function mintPassport(seed, uri) {
  const client = await connect();
  const wallet = Wallet.fromSeed(seed);

  const tx = {
    TransactionType: 'NFTokenMint',
    Account:         wallet.classicAddress,
    URI:             xrpl.convertStringToHex(uri),
    Flags:           xrpl.NFTokenMintFlag.tfBurnable || xrpl.NFTokenMintFlag.tfOnlyXRP,
    TransferFee:     0
  };

  const prepared = await client.autofill(tx);
  const signed   = wallet.sign(prepared);
  const result   = await client.submitAndWait(signed.tx_blob);
  return result;
}

module.exports = { mintPassport };