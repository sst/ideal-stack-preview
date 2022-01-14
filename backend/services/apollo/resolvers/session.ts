import { Resolvers } from "./types";

export const SessionResolver: Resolvers = {
  Query: {
    session: async (_parent, _args, ctx) => {
      const user = ctx.assertAuthenticated();
      return {
        currentUser: {
          id: user.id,
        },
      };
    },
  },
};
