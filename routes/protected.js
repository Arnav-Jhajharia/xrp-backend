const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db/mongo');

router.get('/', async (req, res) => {
    const db = await connectToDatabase();
    const auth0_id = req.auth.sub;
  
    // Check if user exists
    let user = await db.collection('users').findOne({ auth0_id });
  
    // Auto-create if not found
    if (!user) {
      user = {
        auth0_id,
        email: req.auth.email,
        createdAt: new Date(),
      };
      await db.collection('users').insertOne(user);
      console.log(`🆕 Created new user: ${auth0_id}`);
    }
  
    const users = await db.collection('users').find().toArray();
  
    res.json({
      message: '🛡️ Protected route with Mongo!',
      user: req.auth,
      users,
    });
  });
  

module.exports = router;
