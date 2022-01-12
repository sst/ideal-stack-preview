import { ApolloServer } from "apollo-server-lambda";
import { typeDefs } from "./schema";
import { useContext } from "@acme/core";
import { merge } from "lodash-es";

import { TodoResolver } from "./todo";
import { UserResolver } from "./user";
import { SessionResolver } from "./session";
import { DebugResolver } from "./debug";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "core/config";
import { UploadResolver } from "./upload";

const verifier = CognitoJwtVerifier.create({
  userPoolId: config("COGNITO_USER_POOL_ID"),
});

const resolvers = merge([
  TodoResolver,
  UserResolver,
  SessionResolver,
  DebugResolver,
  UploadResolver,
]);

const server = new ApolloServer({
  typeDefs,
  introspection: true,
  formatError: (error) => {
    console.log(error.extensions);
    return error;
  },
  context: async (req) => {
    const auth = req.event.headers.authorization;
    if (!auth)
      return useContext({
        type: "public",
      });

    const token = auth.split("Bearer ")[1];
    const payload = await verifier.verify(token, {
      clientId: null,
      tokenUse: "access",
    });
    return useContext({
      type: "user",
      properties: {
        id: payload.sub,
      },
    });
  },
  resolvers,
});

export const handler = server.createHandler();
