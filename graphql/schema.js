const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  type User  { id: ID! email: String! createdAt: String! }
  type Query { me: User }
  type Mutation { rescore: String }  # returns "OK" for now
`;
