import { typeDefs } from "./schema";
import { useContext } from "@acme/core";
import { merge } from "lodash-es";

import { TodoResolver } from "./resolvers/todo";
import { UserResolver } from "./resolvers/user";
import { SessionResolver } from "./resolvers/session";
import { DebugResolver } from "./resolvers/debug";
import { UploadResolver } from "./resolvers/upload";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "core/config";
import { ApolloError } from "apollo-server-core";
import { ApolloServerLambda } from "./toBeExtracted";

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

const server = new ApolloServerLambda({
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
    try {
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
    } catch (ex) {
      throw new ApolloError("Auth error", "auth_error");
    }
  },
  resolvers,
});
server.start();

export const handler = server.createHandler();
