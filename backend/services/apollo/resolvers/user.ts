import { defineResolver } from "./resolver";

export const UserResolver = defineResolver({
  Query: {
    user: async (_parent, args) => {
      return {
        id: args.id,
      };
    },
  },
});
