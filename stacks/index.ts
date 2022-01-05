import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {},
  });

  new Api(app);
}
