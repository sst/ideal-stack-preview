import * as sst from "@serverless-stack/resources";
import { Auth } from "./Auth";
import { Database } from "./Database";
import { Frontend } from "./Frontend";
import { RemovalPolicy } from "aws-cdk-lib";
import { init } from "./Functional";
import { GraphQL } from "./Graphql";
import { Upload } from "./Upload";
import { Parameter } from "./Parameter";

export default async function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {
      SSM_PREFIX: `/${app.name}/${app.stage}/`,
      SSM_FALLBACK: `/${app.name}/fallback/`,
    },
  });
  if (app.local) app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

  await init(app, Database, Auth, Upload, GraphQL, Frontend);
  Parameter.codegen();
}
