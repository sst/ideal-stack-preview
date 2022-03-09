import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { Config } from "@serverless-stack/node/config";
import RDSDataService from "aws-sdk/clients/rdsdataservice.js";

export interface Database {}

export const DB = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      client: new RDSDataService(),
      database: Config.RDS_DATABASE,
      secretArn: Config.RDS_SECRET,
      resourceArn: Config.RDS_ARN,
    },
  }),
});

export * as SQL from "./sql";
