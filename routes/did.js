// routes/did.js
const express           = require('express');
const connectToDatabase = require('../db/mongo');
const router            = express.Router();

/**
 * POST /api/did
 * Body: {
 *   did:      string,   // e.g. "did:xrpl:1:rABC..."
 *   document?: object,  // full DID JSON (optional)
 *   uri?:      string,  // public URI (optional)
 *   hex?:      string   // hex-encoded doc or URI (optional)
 * }
 */
router.post('/', async (req, res) => {
  const { did, document, uri, hex } = req.body;
  if (!did || (!document && !uri && !hex)) {
    return res.status(433).json({ error: 'Must supply `did` and `document`, `uri` or `hex`.' });
  }

  const parts   = did.split(':');
  const address = parts[parts.length - 1];
  const now     = new Date();

  // Compute hex if only document given
  const computedHex = !hex && document
    ? Buffer.from(JSON.stringify(document), 'utf8').toString('hex')
    : hex || null;

  const payload = {
    address,
    did,
    document: document || null,
    uri:      uri      || null,
    hex:      computedHex,
    updatedAt: now,
  };

  try {
    const db = await connectToDatabase();
    await db.collection('dids').updateOne(
      { address },
      {
        $set: payload,
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
    return res.json({ message: 'DID saved', did, address });
  } catch (err) {
    console.error('❌ DID POST error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

/**
 * GET /api/did/:address
 */
router.get('/:address', async (req, res) => {
  const address = req.params.address;
  try {
    const db = await connectToDatabase();
    const record = await db.collection('dids').findOne({ address });
    if (!record) return res.status(404).json({ error: 'No DID found for ' + address });
    const { _id, ...out } = record;
    return res.json(out);
  } catch (err) {
    console.error('❌ DID GET error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
