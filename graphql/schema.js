const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  type User  { id: ID! email: String! createdAt: String! }
  type Query { me: User }
  type Transaction { name: String! amount: Float! date: String! }
  type Query { transactions: [Transaction] }
  type Mutation { rescore: String }  # returns "OK" for now
`;
