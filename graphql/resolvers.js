const connect = require('../db/mongo');

module.exports.resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      const db = await connect();
      return db.collection('users').findOne({ auth0_id: user.sub });
    },
  },
  Mutation: {
    rescore: async (_, __, { user }) => {
      // ➡️ call your ML micro-service here later
      console.log(`🔄 rescoring for ${user.sub}`);
      return 'OK';
    },
  },
};
