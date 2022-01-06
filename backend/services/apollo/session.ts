import { Resolvers } from "./types";

export const SessionResolver: Resolvers = {
  Query: {
    session: async (_parent, _args, ctx) => {
      return {
        currentUser: {
          id: ctx.actor.properties.id,
        },
      };
    },
  },
};
