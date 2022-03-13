import { RDS, StackContext } from "@serverless-stack/resources";

export function Database(ctx: StackContext) {
  const cluster = new RDS(ctx.stack, "RDS", {
    engine: "postgresql10.14",
    defaultDatabaseName: "starter",
    migrations: "./migrations",
  });

  return cluster;
}
