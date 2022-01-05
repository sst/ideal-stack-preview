import { ApolloServer } from "apollo-server-lambda";
import { TodoResolver } from "./todo";
import { UserResolver } from "./user";
import { SessionResolver } from "./session";
import { typeDefs } from "./schema";
import { useContext } from "@acme/core";
import { merge } from "lodash-es";

const resolvers = merge([TodoResolver, UserResolver, SessionResolver]);
console.log(resolvers);

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
