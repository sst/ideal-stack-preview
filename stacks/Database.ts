import * as sst from "@serverless-stack/resources";
import { FunctionalStackProps, setStackProps } from "./Functional";
import { Parameter } from "./Parameter";

export function Database(props: FunctionalStackProps) {
  setStackProps({
    description: "My favorite stack",
  });
  const cluster = new sst.RDS(props.stack, "RDS", {
    engine: "postgresql10.14",
    defaultDatabaseName: "starter",
    migrations: "./migrations",
  });

  return {
    cluster,
    parameters: Parameter.create(props.stack, {
      RDS_SECRET: cluster.secretArn,
      RDS_ARN: cluster.clusterArn,
      RDS_DATABASE: "starter",
    }),
  };
}
