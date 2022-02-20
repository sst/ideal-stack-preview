import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";
import { Auth } from "./Auth";
import { Database } from "./Database";
import { Frontend } from "./Frontend";
import { RemovalPolicy } from "aws-cdk-lib";

export default async function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {},
  });
  if (app.local) app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

  const db = new Database(app);
  const auth = new Auth(app);
  const api = new Api(app, {
    db: db.outputs,
    auth: auth.outputs,
  });
  new Frontend(app, {
    api: api.outputs,
    auth: auth.outputs,
  });
}
