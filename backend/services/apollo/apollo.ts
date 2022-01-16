import { typeDefs } from "./schema";
import { useContext, config } from "@acme/core";
import { ApolloServerLambda } from "./toBeExtracted";
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { TodoResolver } from "./resolvers/todo";
import { UserResolver } from "./resolvers/user";
import { SessionResolver } from "./resolvers/session";
import { DebugResolver } from "./resolvers/debug";
import { UploadResolver } from "./resolvers/upload";

const verifier = CognitoJwtVerifier.create({
  userPoolId: config("COGNITO_USER_POOL_ID"),
});

const server = new ApolloServerLambda({
  typeDefs,
  introspection: true,
  resolvers: [
    TodoResolver,
    UserResolver,
    SessionResolver,
    DebugResolver,
    UploadResolver,
  ],
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
    } catch (ex) {}
  },
});

export const handler = server.createHandler();
