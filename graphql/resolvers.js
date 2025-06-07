const connect = require('../db/mongo');
const { ObjectId } = require('mongodb');

module.exports.resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      const db = await connect();
      return db.collection('users').findOne({ auth0_id: user.sub });
    },
    transactions: async (_, __, { user }) => {
      const db = await connect();
      return db.collection('transactions').find({ userId: user.sub }).toArray();
    },
    identities: async () => {
      const db = await connect();
      return db.collection('identities').find().toArray();
    },
    identity: async (_, { id }) => {
      const db = await connect();
      return db.collection('identities').findOne({ _id: new ObjectId(id) });
    },
  },
  Mutation: {
    rescore: async (_, __, { user }) => {
      // ➡️ call your ML micro-service here later
      console.log(`🔄 rescoring for ${user.sub}`);
      return 'OK';
    },
    importIdentities: async (_, { data }) => {
      const db = await connect();
      await db.collection('identities').insertMany(data);
      return 'Imported';
    },
  },
  Identity: {
    paystubs: async (parent) => {
      const db = await connect();
      return db.collection('paystubs').find({ identityId: parent._id }).toArray();
    },
    deposits: async (parent) => {
      const db = await connect();
      return db.collection('deposits').find({ identityId: parent._id }).toArray();
    },
    gigs: async (parent) => {
      const db = await connect();
      return db.collection('gigs').find({ identityId: parent._id }).toArray();
    },
    vehicles: async (parent) => {
      const db = await connect();
      return db.collection('vehicles').find({ identityId: parent._id }).toArray();
    },
    ratings: async (parent) => {
      const db = await connect();
      return db.collection('ratings').find({ identityId: parent._id }).toArray();
    },
  }
};
