const { connect, Wallet } = require('./xrplClient');

import { Client, Wallet } from 'xrpl'


async function setDID(seed, didDocument) {
  const client = await connect();
  const wallet = Wallet.fromSeed(seed);
  const json   = JSON.stringify(didDocument);
  const tx = {
    TransactionType: 'DIDSet',
    Account:         wallet.classicAddress,
    DID:             didDocument.id,
    Properties:      Buffer.from(json).toString('hex')
  };
  const prepared = await client.autofill(tx);
  const signed   = wallet.sign(prepared);
  return await client.submitAndWait(signed.tx_blob);
}

export async function setDID(seed, didDocument) {
  const client = new Client('wss://xrplcluster.com')      // or your node
  await client.connect()

  try {
    const wallet = Wallet.fromSeed(seed)

    // Encode the DID document as hex
    const didDocHex = Buffer.from(JSON.stringify(didDocument), 'utf8').toString('hex')

    const tx = {
      TransactionType: 'DIDSet',
      Account: wallet.classicAddress,
      DIDDocument: didDocHex            // <= spec-compliant field
    }

    // Autofill, sign & submit in one step
    const result = await client.submitAndWait(tx, { autofill: true, wallet })

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`DIDSet failed: ${result.result.meta.TransactionResult}`)
    }
    return result                       // validated TX + metadata
  } finally {
    await client.disconnect()
  }
}

async function resolveDID(did) {
  const parts   = did.split(':');
  const address = parts.pop();
  const client  = await connect();
  const res     = await client.request({
    command: 'account_objects',
    account: address,
    type:    'DID'
  });
  if (!res.result.account_objects.length) throw new Error('DID not found');
  const obj  = res.result.account_objects[0];
  const hex  = obj.Properties;
  return JSON.parse(Buffer.from(hex, 'hex').toString());
}

module.exports = { setDID, resolveDID };
