#!/usr/bin/env node
/**
 * upload-to-ipfs-infura.js
 *
 * Usage:
 *   node upload-to-ipfs-infura.js <hexData>
 *
 * Example:
 *   node upload-to-ipfs-infura.js 7b226964223a226469643a7872706c3a...7d
 */

require('dotenv').config();
const axios    = require('axios');
const FormData = require('form-data');
const { Buffer } = require('buffer');

const PROJECT_ID     = process.env.INFURA_PROJECT_ID;
const PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET;

if (!PROJECT_ID || !PROJECT_SECRET) {
  console.error('❌ Missing INFURA_PROJECT_ID or INFURA_PROJECT_SECRET in .env');
  process.exit(1);
}

const INFURA_API = 'https://ipfs.infura.io:5001/api/v0/add';

async function main() {
  const hexData = process.argv[2];
  if (!hexData) {
    console.error('\nUsage: node upload-to-ipfs-infura.js <hexData>\n');
    process.exit(1);
  }

  let buffer;
  try {
    buffer = Buffer.from(hexData, 'hex');
  } catch (e) {
    console.error('❌ Provided string is not valid hex');
    process.exit(1);
  }

  // Build multipart/form-data payload
  const form = new FormData();
  form.append('file', buffer, {
    filename: 'did.json',
    contentType: 'application/json',
  });

  // Basic Auth header
  const auth = Buffer.from(`${PROJECT_ID}:${PROJECT_SECRET}`).toString('base64');

  try {
    console.log(`🚀 Uploading to Infura IPFS…`);
    const res = await axios.post(INFURA_API, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${auth}`,
      },
      params: {
        pin: 'false'   // as per docs; set to true if you want automatic pinning
      }
    });

    // Infura returns a string body—parse if needed
    const info = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

    console.log('\n✅ Upload successful!');
    console.log('Name:', info.Name);
    console.log('CID :', info.Hash);
    console.log('Size:', info.Size);
    console.log('Gateway URL:', `https://ipfs.infura.io/ipfs/${info.Hash}`);
  } catch (err) {
    console.error('❌ IPFS upload failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

main();
