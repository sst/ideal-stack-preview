import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { config } from "../config";
import RDSDataService from "aws-sdk/clients/rdsdataservice";

export type Database = {};

export const DB = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      client: new RDSDataService(),
      database: config("RDS_DATABASE"),
      secretArn: config("RDS_SECRET"),
      resourceArn: config("RDS_ARN"),
    },
  }),
});
