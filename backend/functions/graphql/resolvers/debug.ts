import { SQL } from "@acme/core/sql";
import { Resolvers } from "./types";

export const DebugResolver: Resolvers = {
  Query: {
    debug: async () => {
      return {};
    },
  },
  Debug: {
    database: async () => {
      const result = await SQL.DB.raw("SELECT 1").execute();
      return JSON.stringify(result);
    },
  },
};
