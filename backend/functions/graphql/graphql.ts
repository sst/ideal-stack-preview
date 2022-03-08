import { typeDefs } from "./schema";
import { useContext, Context } from "@acme/core/context";

import { TodoResolver } from "./resolvers/todo";
import { UserResolver } from "./resolvers/user";
import { SessionResolver } from "./resolvers/session";
import { DebugResolver } from "./resolvers/debug";
import { createGQLHandler } from "@serverless-stack/node/graphql";
import { Auth } from "@serverless-stack/node/auth";
import { Config } from "@serverless-stack/node/config";

Auth.init(Config.COGNITO_USER_POOL_ID);

export const handler = createGQLHandler<Context>({
  typeDefs,
  resolvers: [TodoResolver, UserResolver, SessionResolver, DebugResolver],
  context: async (req) => {
    const auth = req.event.headers.authorization;
    if (auth) {
      const [_, token] = auth.split("Bearer ");
      try {
        const payload = await Auth.verify(token);
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
