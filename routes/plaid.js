const express = require('express');
const router = express.Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

require('dotenv').config();

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(config);

// Store access_token in memory for demo
let ACCESS_TOKEN = null;

// Create Link Token
router.post('/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id' },
      client_name: 'Plaid Test App',
      products: process.env.PLAID_PRODUCTS.split(','),
      country_codes: process.env.PLAID_COUNTRY_CODES.split(','),
      language: 'en',
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Exchange Public Token for Access Token
router.post('/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    ACCESS_TOKEN = response.data.access_token;
    res.json({ access_token: ACCESS_TOKEN });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get Transactions
router.get('/transactions', async (req, res) => {
  if (!ACCESS_TOKEN) {
    return res.status(400).json({ error: 'Access token not set. Exchange public token first.' });
  }

  const now = new Date();
  const startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  try {
    const response = await plaidClient.transactionsGet({
      access_token: ACCESS_TOKEN,
      start_date: startDate,
      end_date: endDate,
    });
    res.json(response.data.transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
