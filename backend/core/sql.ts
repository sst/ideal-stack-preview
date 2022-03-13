import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import RDSDataService from "aws-sdk/clients/rdsdataservice.js";

export interface Database {}

export const DB = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      client: new RDSDataService(),
      database: process.env.RDS_DATABASE,
      secretArn: process.env.RDS_SECRET,
      resourceArn: process.env.RDS_ARN,
    },
  }),
});

export * as SQL from "./sql";
