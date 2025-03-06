const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    userid: ID!
    username: String!
    passhash: String
    email: String
    phone: String
    role: Int!
    dateofbirth: String
    usersyrname: String!
  }

  type Query {
    users: [User]
    user(userid: ID!): User
  }

  type Mutation {
    createUser(
      username: String!
      passhash: String!
      email: String
      phone: String
      role: Int!
      dateofbirth: String
      usersyrname: String!
    ): User

    updateUser(
      userid: ID!
      username: String
      passhash: String
      email: String
      phone: String
      role: Int
      dateofbirth: String
      usersyrname: String
    ): User

    deleteUser(userid: ID!): Boolean
  }
`;

module.exports = typeDefs;
