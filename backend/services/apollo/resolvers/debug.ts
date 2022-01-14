import { SQL } from "@acme/core";
import { defineResolver } from "./resolver";

export const DebugResolver = defineResolver({
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
});
