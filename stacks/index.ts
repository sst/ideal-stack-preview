import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";
import { Frontend } from "./Frontend";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {},
  });

  const api = new Api(app);
  new Frontend(app, {
    api: api.outputs,
  });
}
