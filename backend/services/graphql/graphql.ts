import { typeDefs } from "./schema";
import { useContext, Context } from "@acme/core";
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { TodoResolver } from "./resolvers/todo";
import { UserResolver } from "./resolvers/user";
import { SessionResolver } from "./resolvers/session";
import { DebugResolver } from "./resolvers/debug";
import {
  createGQLHandler,
  Config,
  UploadResolver,
} from "@serverless-stack/node";

const verifier = CognitoJwtVerifier.create({
  userPoolId: Config.COGNITO_USER_POOL_ID,
});

export const handler = createGQLHandler<Context>({
  typeDefs,
  resolvers: [
    TodoResolver,
    UserResolver,
    SessionResolver,
    DebugResolver,
    UploadResolver<Context>({
      user: async (ctx) => ctx.assertAuthenticated().id,
      bucket: Config.BUCKET,
    }),
  ],
  context: async (req) => {
    const auth = req.event.headers.authorization;
    if (auth) {
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
    }
    return useContext({
      type: "public",
    });
  },
});
