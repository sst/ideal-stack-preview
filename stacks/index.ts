import * as sst from "@serverless-stack/resources";
import { Auth } from "./Auth";
import { Database } from "./Database";
import { Frontend } from "./Frontend";
import { RemovalPolicy } from "aws-cdk-lib";
import { FunctionalStackProps, init, setStackProps } from "./Functional";
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

  await init(app, Database, Auth, Upload, GraphQL, Frontend, One, Two);
  Parameter.codegen();
}

// This is just a normal function that houses shared logic
function CopyableStack(description: string) {
  setStackProps({
    description,
  });
}

// These are the actual stacks
const One = (_props: FunctionalStackProps) => CopyableStack("This is copy one");
const Two = (_props: FunctionalStackProps) =>
  CopyableStack("And this is copy two");
