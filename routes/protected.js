const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db/mongo');

const EMAIL_CLAIM = 'https://fintech.io/email';


router.get('/', async (req, res) => {
  const db      = await connectToDatabase();
  const auth0_id = req.auth.sub;
  console.log(auth0_id)
  const email    = req.auth[EMAIL_CLAIM] || null;

  // Check if user exists
  let user = await db.collection('users').findOne({ auth0_id });
  if (!user) {
    user = { auth0_id, email, createdAt: new Date() };
    await db.collection('users').insertOne(user);
    console.log(`🆕 Created new user: ${auth0_id} (${email})`);
  }
  // If user existed but had null email, you might want to update it:
  else if (!user.email && email) {
    await db.collection('users')
      .updateOne({ auth0_id }, { $set: { email } });
  }

  const users = await db.collection('users').find().toArray();
  res.json({ message: '🛡️ Protected route with Mongo!', user: req.auth, users });
});

  

module.exports = router;
