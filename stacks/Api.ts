import * as sst from "@serverless-stack/resources";

export class Api extends sst.Stack {
  constructor(scope: sst.App) {
    super(scope, "gql");

    const apollo = new sst.ApolloApi(this, "apollo", {
      server: "services/apollo/apollo.handler",
    });

    this.addOutputs({
      Apollo: apollo.url,
    });
  }
}
