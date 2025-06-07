const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a message indicating the public route is working.
 *     tags:
 *       - Public
 *     responses:
 *       200:
 *         description: Success message for the public route.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Public route works!
 */
router.get('/', (req, res) => {
  res.json({ message: '🌐 Public route works!' });
});

module.exports = router;
