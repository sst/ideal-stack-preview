import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";
import { Auth } from "./Auth";
import { Database } from "./Database";
import { Frontend } from "./Frontend";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {},
  });

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
