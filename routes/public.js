const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: '🌐 Public route works!' });
});

module.exports = router;
