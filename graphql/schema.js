const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  type User  { id: ID! email: String! createdAt: String! }
  type Transaction { name: String! amount: Float! date: String! }
  type Query {
    me: User
    transactions: [Transaction]
    identities: [Identity]
    identity(id: ID!): Identity
  }
  type Mutation {
    rescore: String
    importIdentities(data: [IdentityInput]!): String
  }

  type Identity {
    id: ID!
    fullName: String!
    firstName: String!
    lastName: String!
    birthDate: String
    email: String
    phoneNumber: String
    gender: String
    maritalStatus: String
    employmentStatus: String
    employmentType: String
    jobTitle: String
    ssn: String
    hireDate: String
    originalHireDate: String
    terminationDate: String
    terminationReason: String
    payCycle: String
    basePay: Pay
    address: Address
    platformIds: PlatformIds
    paystubs: [Paystub]
    deposits: [DepositDestination]
    gigs: [Gig]
    vehicles: [Vehicle]
    ratings: [Rating]
  }

  type Pay {
    amount: String
    period: String
    currency: String
  }

  type Address {
    line1: String
    line2: String
    city: String
    state: String
    country: String
    postalCode: String
  }

  type PlatformIds {
    employeeId: String
    positionId: String
    platformUserId: String
  }

  type Paystub {
    id: ID!
    date: String!
    grossPay: Float!
    netPay: Float!
    employer: String
  }

  type DepositDestination {
    id: ID!
    accountNumber: String!
    routingNumber: String!
    bankName: String
    type: String
  }

  type Gig {
    id: ID!
    name: String!
    platform: String
    earnings: Float
    startDate: String
    endDate: String
  }

  type Vehicle {
    id: ID!
    make: String!
    model: String!
    year: Int
    licensePlate: String
  }

  type Rating {
    id: ID!
    platform: String
    score: Float!
    reviews: Int
  }

  input IdentityInput {
    fullName: String!
    firstName: String!
    lastName: String!
    email: String!
  }
`;
