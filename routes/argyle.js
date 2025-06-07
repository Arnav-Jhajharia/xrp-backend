const express = require('express');
const router = express.Router();
const connect = require('../db/mongo');
const { ObjectId } = require('mongodb');

// Utility to load a single identity by ID
const getIdentityById = async (id) => {
  const db = await connect();
  return db.collection('identities').findOne({ _id: new ObjectId(id) });
};

// Base identity formatter
const formatIdentity = (identity) => {
  if (!identity) return null;
  return {
    id: identity._id,
    fullName: identity.full_name,
    firstName: identity.first_name,
    lastName: identity.last_name,
    maritalStatus: identity.marital_status,
    jobTitle: identity.job_title,
    hireDate: identity.hire_date,
    terminationDate: identity.termination_date || null,
    terminationReason: identity.termination_reason || null,
    basePay: identity.base_pay,
    payCycle: identity.pay_cycle,
    platformIds: identity.platform_ids,
  };
};

// GET all identities (filtered)
router.get('/identities', async (req, res) => {
  try {
    const db = await connect();
    const raw = await db.collection('identities').find().toArray();
    const identities = raw.map(formatIdentity);
    res.json(identities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch identities' });
  }
});

// GET single identity (filtered)
router.get('/identities/:id', async (req, res) => {
  try {
    const identity = await getIdentityById(req.params.id);
    if (!identity) return res.status(404).json({ error: 'Identity not found' });
    res.json(formatIdentity(identity));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch identity' });
  }
});

// GET base pay
router.get('/identities/:id/base-pay', async (req, res) => {
  try {
    const identity = await getIdentityById(req.params.id);
    if (!identity || !identity.base_pay) return res.status(404).json({ error: 'Base pay not found' });
    res.json(identity.base_pay);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch base pay' });
  }
});

// GET pay cycle
router.get('/identities/:id/pay-cycle', async (req, res) => {
  try {
    const identity = await getIdentityById(req.params.id);
    if (!identity || !identity.pay_cycle) return res.status(404).json({ error: 'Pay cycle not found' });
    res.json({ payCycle: identity.pay_cycle });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pay cycle' });
  }
});

// GET platform IDs
router.get('/identities/:id/platform-ids', async (req, res) => {
  try {
    const identity = await getIdentityById(req.params.id);
    if (!identity || !identity.platform_ids) return res.status(404).json({ error: 'Platform IDs not found' });
    res.json(identity.platform_ids);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform IDs' });
  }
});

// GET basic info
router.get('/identities/:id/basic-info', async (req, res) => {
  try {
    const identity = await getIdentityById(req.params.id);
    if (!identity) return res.status(404).json({ error: 'Identity not found' });

    const info = {
      fullName: identity.full_name,
      firstName: identity.first_name,
      lastName: identity.last_name,
      maritalStatus: identity.marital_status,
      jobTitle: identity.job_title,
      hireDate: identity.hire_date,
      terminationDate: identity.termination_date || null,
      terminationReason: identity.termination_reason || null,
    };

    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch basic info' });
  }
});

module.exports = router;
