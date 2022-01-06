import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";

type Props = {
  api: Api["outputs"];
};

export class Frontend extends sst.Stack {
  constructor(scope: sst.App, props: Props) {
    super(scope, "frontend");

    const site = new sst.StaticSite(this, "frontend", {
      path: "frontend",
      environment: {
        VITE_APOLLO_URL: props.api.apollo,
      },
    });

    this.addOutputs({
      Site: site.url,
    });
  }
}
