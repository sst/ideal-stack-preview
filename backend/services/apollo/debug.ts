import { Context, SQL } from "@acme/core";
import { Resolvers } from "./types";

export const DebugResolver: Resolvers<Context> = {
  Query: {
    debug: async () => {
      return {};
    },
  },
  Debug: {
    scrap: async () => {
      const result = await SQL.DB.raw("SELECT 1").execute();
      return JSON.stringify(result);
    },
  },
};
