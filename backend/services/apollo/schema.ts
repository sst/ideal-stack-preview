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
  type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
  }
  type Query {
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
