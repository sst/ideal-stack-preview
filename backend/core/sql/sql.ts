import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { Config } from "@serverless-stack/backend";
import RDSDataService from "aws-sdk/clients/rdsdataservice.js";

type TodoRow = {
  id: string;
  title: string;
  author_id: string;
};

export type Database = {
  todos: TodoRow;
};

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
