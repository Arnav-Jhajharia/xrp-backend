// xrpl/did.js
const { Buffer } = require('buffer');           // ensure Buffer is available
const { Wallet } = require('xrpl');
const { connect } = require('./xrplClient');    // your helper that exports connect()

/**
 * Submit a DIDSet transaction on XRPL.
 */
async function setDID(seed, doc) {
  // 1) connect to XRPL
  const client = await connect(); 

  // 2) prepare the DIDSet using the proper 'Properties' field
  const wallet = Wallet.fromSeed(seed);
  const hexDoc = Buffer
    .from(JSON.stringify(doc), 'utf8')
    .toString('hex');

  const tx = {
    TransactionType: 'DIDSet',
    Account:         wallet.classicAddress,
    DID:             doc.id,
    Properties:      hexDoc,
  };

  // 3) autofill, sign, and submit
  const prepared = await client.autofill(tx);
  const signed   = wallet.sign(prepared);
  const result   = await client.submitAndWait(signed.tx_blob);

  return {
    tx_json: result.tx_json,
    result:  result.result,
  };
}

/**
 * Resolve a DID by fetching it from the ledger.
 */
async function resolveDID(didString) {
  const client = await connect();
  const address = didString.split(':').pop();

  const resp = await client.request({
    command:      'account_objects',
    account:      address,
    ledger_index: 'validated',
    type:         'DID',
  });

  const obj = resp.result.account_objects.find(o => o.DID === didString);
  if (!obj) throw new Error(`No DID record for ${didString}`);

  // DID entries on chain use 'Properties' for the hex blob
  const hex = obj.Properties;
  const json = Buffer.from(hex, 'hex').toString('utf8');
  return JSON.parse(json);
}

module.exports = { setDID, resolveDID };
