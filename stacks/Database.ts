import { RDS } from "@serverless-stack/resources";
import { Context } from "./Functional";

export function Database(ctx: Context) {
  const cluster = new RDS(ctx.stack, "RDS", {
    engine: "postgresql10.14",
    defaultDatabaseName: "starter",
    migrations: "./migrations",
  });

  return cluster;
}
