// routes/protected/onboard.js
const express = require('express');
const router  = express.Router();
const { Wallet } = require('xrpl');
const { fundTestnet } = require('../../xrpl/fundWallet');
const connect = require('../../db/mongo');

router.post('/create-wallet', async (req, res) => {
  const { userId } = req.body;
  const db = await connect();
  const users = db.collection('users');
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.xrplAccount) {
    return res.json({ user });
  }

  const wallet = Wallet.generate();
  await fundTestnet(wallet.classicAddress);
  await users.updateOne(
    { _id: user._id },
    { $set: { xrplAccount: wallet.classicAddress, xrplSeed: wallet.seed } }
  );
  const updated = await users.findOne({ _id: user._id });
  res.json({ user: updated });
});

module.exports = router;
