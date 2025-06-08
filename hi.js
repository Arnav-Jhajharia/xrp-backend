#!/usr/bin/env node
/**
 * resolve-did-object.js
 *
 * Usage:
 *   npm install xrpl
 *   node resolve-did-object.js did:xrpl:testnet:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
 */

const xrpl = require('xrpl');

async function main() {
  const did = process.argv[2];
  if (!did) {
    console.error('\nUsage: node resolve-did-object.js <did:xrpl:...>\n');
    process.exit(1);
  }

  // 1) extract the classic address (last segment)
  const parts   = did.split(':');
  const address = parts[parts.length - 1];

  // 2) connect to your desired network (main-net or test-net)
  const NETWORK = process.env.NETWORK_URL || 'wss://s.altnet.rippletest.net:51233';
  const client  = new xrpl.Client(NETWORK);
  await client.connect();

  try {
    // 3) query account_objects for type "DID"
    const resp = await client.request({
      command:      'account_objects',
      account:      address,
      ledger_index: 'validated',
      type:         'DID',
    });

    const objs = resp.result.account_objects;
    if (!objs || objs.length === 0) {
      console.log(`ℹ️  No DID objects found for ${did}`);
      process.exit(0);
    }

    // 4) print each DID object (usually contains a URI field)
    console.log(`✅ Found ${objs.length} DID object(s):\n`);
    objs.forEach((o, i) => {
      console.log(`--- Object #${i+1} ---`);
      console.log(JSON.stringify(o, null, 2));
      console.log();
    });
  } finally {
    await client.disconnect();
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
