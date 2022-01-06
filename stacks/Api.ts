import * as sst from "@serverless-stack/resources";

export class Api extends sst.Stack {
  public readonly outputs: {
    apollo: string;
  };

  constructor(scope: sst.App) {
    super(scope, "api");

    const apollo = new sst.ApolloApi(this, "apollo", {
      server: "services/apollo/apollo.handler",
    });

    this.outputs = {
      apollo: apollo.url,
    };
  }
}
