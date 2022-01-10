import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";
import { Auth } from "./Auth";

type Props = {
  api: Api["outputs"];
  auth: Auth["outputs"];
};

export class Frontend extends sst.Stack {
  constructor(scope: sst.App, props: Props) {
    super(scope, "frontend");

    const client = props.auth.userPool.addClient("frontendClient", {
      userPoolClientName: "frontend",
    });

    const site = new sst.StaticSite(this, "frontend", {
      path: "frontend",
      environment: {
        VITE_APOLLO_URL: props.api.apollo,
        VITE_COGNITO_USER_POOL_ID: props.auth.userPool.userPoolId,
        VITE_COGNITO_CLIENT_ID: client.userPoolClientId,
      },
    });

    this.addOutputs({
      Site: site.url,
    });
  }
}
