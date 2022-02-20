import * as sst from "@serverless-stack/resources";

export class Database extends sst.Stack {
  public readonly outputs: {
    cluster: sst.RDS;
  };

  constructor(scope: sst.App) {
    super(scope, "database");

    const cluster = new sst.RDS(this, "RDS", {
      engine: "postgresql10.14",
      defaultDatabaseName: "starter",
      migrations: "./backend/migrations",
    });

    this.outputs = {
      cluster,
    };
  }
}
