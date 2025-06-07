const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectToDatabase = require('../db/mongo');
const {
  Wallet,
  fundTestnet,
  deriveAddress,
  getBalance,
  sendXRP,
  mintPassport,
  setDID,
  resolveDID
} = require('../xrpl');



// Create or onboard wallet for user
router.post('/create-wallet', async (req, res) => {
  const { userId } = req.body;
  const db = await connectToDatabase();
  const users = db.collection('users');
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.xrplAccount) return res.json(user);

  const wallet = Wallet.generate();
  await fundTestnet(wallet.classicAddress);
  await users.updateOne(
    { _id: user._id },
    { $set: { xrplAccount: wallet.classicAddress, xrplSeed: wallet.seed } }
  );
  const updated = await users.findOne({ _id: user._id });
  res.json(updated);
});

// Derive address from seed
router.post('/derive-address', (req, res) => {
  const { seed } = req.body;
  try {
    const address = deriveAddress(seed);
    res.json({ address });
  } catch (err) {
    res.status(400).json({ error: 'Invalid seed' });
  }
});

// Get XRP balance
router.get('/balance/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Send XRP payment
router.post('/send', async (req, res) => {
  const { seed, destination, drops } = req.body;
  try {
    const result = await sendXRP(seed, destination, drops);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Payment failed', details: err.message });
  }
});

// Mint passport NFT
router.post('/mint-passport', async (req, res) => {
  const { seed, uri } = req.body;
  try {
    const result = await mintPassport(seed, uri);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Minting failed', details: err.message });
  }
});


// DIDSet
router.post('/did/set', async (req, res) => {
    try {
      const result = await setDID(req.body.seed, req.body.didDocument);
      res.json({
        transactionHash: result.tx_json.hash,
        ledgerIndex:     result.result.ledger_index
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }

});


// Resolve DID
router.get('/did/resolve/:did', async (req, res) => {
  try {
    const doc = await resolveDID(req.params.did);
    res.json(doc);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});



module.exports = router;