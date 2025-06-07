const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
    scalar JSON

  type Score {
    _id: ID!
    pd: Float!
    limit: Float!
    shapTop: [String!]!
    updatedAt: String!
  }

  type Loan {
    _id: ID!
    principal: Float!
    status: String!
    xrplLoanId: String
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    createdAt: String!
    scores: [Score!]!
    loans: [Loan!]!
    xrplAccount: String
    publicKey:   String
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    resolveDID(did: String!): JSON!
  }

  type Mutation {
    rescore: String  # returns "OK" for now
    requestLoan(userId: ID!, amount: Float!): Loan
    repayLoan(loanId: ID!, amount: Float!): Loan
    deleteAllUsers: Boolean!    # deletes all users from the database
    saveXRPLAddress(address: String!, publicKey: String!): User!
    setDID(seed: String!, didDocument: JSON!): DIDResult!
  }

   type DIDResult {
    transactionHash: String!
    ledgerIndex: Int!
    
  }

  
`;
