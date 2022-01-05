import { Resolvers } from "./types";

export const SessionResolver: Resolvers = {
  Query: {
    session: async (_parent, _args, ctx) => {
      return {
        user: {
          id: ctx.actor.properties.id,
        },
      };
    },
  },
};
