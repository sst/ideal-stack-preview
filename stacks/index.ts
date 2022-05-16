import { App } from "@serverless-stack/resources";
import { Api } from "./Api";
import { Cognito } from "./Cognito";
import { Database } from "./Database";
import { Web } from "./Web";

export default function main(app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
  });
  app.stack(Database).stack(Cognito).stack(Api).stack(Web);
}
