require('dotenv').config();
const axios = require('axios');

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;

async function waitForTransactions() {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await axios.get(`http://localhost:3001/plaid/transactions`);
      console.log('✅ Transactions:', res.data);
      return;
    } catch (err) {
      // if (err.response?.data?.error_code === 'PRODUCT_NOT_READY') {
        console.log(`⏳ Waiting... (${i + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s
      // } else {
        // throw err;
      // }
    }
  }
  console.error('❌ Gave up waiting for transactions.');
}

async function runTest() {
  try {
    // Step 1: Create sandbox public token
    const sandboxTokenRes = await axios.post('https://sandbox.plaid.com/sandbox/public_token/create', {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      institution_id: 'ins_109508',
      initial_products: ['auth', 'transactions'],
    });

    const publicToken = sandboxTokenRes.data.public_token;
    console.log('Public token:', publicToken);

    // Step 2: Exchange token
    const exchangeRes = await axios.post('http://localhost:3001/plaid/exchange_public_token', {
      public_token: publicToken,
    });

    const accessToken = exchangeRes.data.access_token;
    console.log('Access token:', accessToken);

    // Step 3: Get transactions
    waitForTransactions();

  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
  }
}

runTest();
