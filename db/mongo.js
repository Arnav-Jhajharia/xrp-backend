const { MongoClient } = require('mongodb');

require('dotenv').config();
console.log(process.env.MONGO_URI);
const client = new MongoClient(process.env.MONGO_URI);

async function connect() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db("users");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
}

module.exports = connect;
