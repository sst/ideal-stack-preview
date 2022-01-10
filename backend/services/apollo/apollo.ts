import { ApolloServer } from "apollo-server-lambda";
import { typeDefs } from "./schema";
import { useContext } from "@acme/core";
import { merge } from "lodash-es";

import { TodoResolver } from "./todo";
import { UserResolver } from "./user";
import { SessionResolver } from "./session";
import { DebugResolver } from "./debug";

const resolvers = merge([
  TodoResolver,
  UserResolver,
  SessionResolver,
  DebugResolver,
]);

const server = new ApolloServer({
  typeDefs,
  introspection: true,
  context: () =>
    useContext({
      type: "user",
      properties: {
        id: "user1",
      },
    }),
  resolvers,
});

export const handler = server.createHandler();
