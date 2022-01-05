import { Resolvers } from "./types";

export const UserResolver: Resolvers = {
  Query: {
    user: async (_parent, args) => {
      return {
        id: args.id,
      };
    },
  },
};
