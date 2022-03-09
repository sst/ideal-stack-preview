import { typeDefs } from "./schema";
import { useContext, Context } from "@acme/core/context";

import { TodoResolver } from "./resolvers/todo";
import { UserResolver } from "./resolvers/user";
import { SessionResolver } from "./resolvers/session";
import { DebugResolver } from "./resolvers/debug";
import { createGQLHandler } from "@serverless-stack/node/graphql";
import { Cognito } from "@serverless-stack/node/cognito";
import { UploadResolver } from "./resolvers/upload";

const cognito = Cognito.create(process.env.COGNITO_USER_POOL_ID!);

export const handler = createGQLHandler<Context>({
  typeDefs,
  resolvers: [
    UploadResolver,
    TodoResolver,
    UserResolver,
    SessionResolver,
    DebugResolver,
  ],
  context: async (req) => {
    const auth = req.event.headers.authorization;
    if (auth) {
      const [_, token] = auth.split("Bearer ");
      try {
        const payload = await cognito.verify(token);
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
