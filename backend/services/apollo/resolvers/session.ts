import { defineResolver } from "./resolver";

export const SessionResolver = defineResolver({
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
});
