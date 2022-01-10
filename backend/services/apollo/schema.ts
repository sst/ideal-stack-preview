import { gql } from "apollo-server-lambda";
export const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
  }
  input CreateTodoInput {
    id: String!
    title: String!
    user: String!
  }
  type Debug {
    scrap: String!
  }
  type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
  }
  type Query {
    debug: Debug!
    session: Session!
    user(id: ID!): User!
  }
  type Session {
    currentUser: User!
  }
  type Todo {
    id: ID!
    title: String!
  }
  type User {
    id: ID!
    todos: [Todo!]!
  }
`;
