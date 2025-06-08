const connect = require('../db/mongo');
const { ObjectId } = require('mongodb');
const xrpClient    = require('../xrpl/xrplClient');
const { resolveDID } = require('../xrpl/did');

module.exports.resolvers = {
  Query: {
    me: async (_, __, { user }) => {
        const db = await connect();
        const u  = await db
          .collection('users')
          .findOne({ auth0_id: user.sub });
        if (u) u.id = u._id.toString();
        return u;
    },
    users: async () => {
      const db = await connect();
      return db.collection('users').find().toArray();
    },
    user: async (_, { id }) => {
      const db = await connect();
      return db.collection('users').findOne({ _id: id });
    },

    resolveDID: async (_, { did }) => await resolveDID(did), 
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
    resolveDID: async (_, { did }) => resolveDID(did),
  },

  Mutation: {
    rescore: async (_, __, { user }) => {
      console.log(`🔄 rescoring for ${user.sub}`);
      return 'OK';
    },

    requestLoan: async (_, { userId, amount }) => {
      // Placeholder: call XRPL LoanSet transaction
      const loan = {
        _id: new ObjectId(),
        borrowerId: new ObjectId(userId),
        principal: amount,
        status: 'DRAWN',
        xrplLoanId: 'placeholder_tx_hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const db = await connect();
      await db.collection('loans').insertOne(loan);
      return loan;
    },

    repayLoan: async (_, { loanId, amount }) => {
      // Placeholder: call XRPL LoanPay transaction
      const loan = {
        // fetch and update logic
      };
      const db = await connect();
      await db.collection('loans').updateOne(
        { _id: new ObjectId(loanId) },
        { $set: { status: 'REPAID', updatedAt: new Date() } }
      );
      return db.collection('loans').findOne({ _id: new ObjectId(loanId) });
    },

    deleteAllUsers: async () => {
      const db = await connect();
      await db.collection('users').deleteMany({});
      return true;
    }, 

    

    saveXRPLAddress: async (_, { address, publicKey }, { user }) => {
        const db    = await connect();
        const users = db.collection('users');
  
        // Use your Auth0 sub to find the existing record
        // and on first insert also set email + createdAt
        const now = new Date().toISOString();
        const result = await users.findOneAndUpdate(
          { auth0_id: user.sub },
          {
            $set: { xrplAccount: address, publicKey: publicKey },
            $setOnInsert: {
              email:     user.email || null,
              createdAt: now,
            },
          },
          {
            upsert:         true,
            returnDocument: 'after',
          }
        );
        console.log(result)

       
        // Normalize for GraphQL (if your schema uses `id` not `_id`)
        result.id = result._id.toString();
  
        return result;
      },
  
        // relay a signed DIDSet transaction
        submitDID: async (_, { txBlob }) => {
          const client = await xrpClient.connect();
          const result = await client.submitAndWait(txBlob);
          return {
            transactionHash: result.result.hash,
            ledgerIndex:     result.result.ledger_index,
          };
        },

  },
  
  User: {
    scores: async (u) => {
      const db = await connect();
      return db.collection('scores').find({ userId: u.id }).toArray();
    },
    loans: async (u) => {
      const db = await connect();
      return db.collection('loans').find({ borrowerId: new ObjectId(u.id) }).toArray();
    }
  }
};
