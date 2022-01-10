import * as sst from "@serverless-stack/resources";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers";

import { Database } from "./Database";
import { Auth } from "./Auth";

type Props = {
  db: Database["outputs"];
  auth: Auth["outputs"];
};

export class Api extends sst.Stack {
  public readonly outputs: {
    apollo: string;
  };

  constructor(scope: sst.App, props: Props) {
    super(scope, "api");

    const apollo = new sst.ApolloApi(this, "apollo", {
      server: "services/apollo/apollo.handler",
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      defaultAuthorizer: new HttpUserPoolAuthorizer(
        "authorizer",
        props.auth.userPool,
        {
          userPoolClients: [props.auth.userPool.addClient("client")],
        }
      ),
      defaultFunctionProps: {
        environment: {
          RDS_SECRET: props.db.cluster.secret!.secretArn,
          RDS_ARN: props.db.cluster.clusterArn,
          RDS_DATABASE: "postgres",
        },
        bundle: {
          nodeModules: ["kysely", "kysely-data-api"],
        },
      },
    });
    props.db.cluster.secret?.grantRead(apollo.serverFunction);
    props.db.cluster.grantDataApiAccess(apollo.serverFunction);

    this.outputs = {
      apollo: apollo.url,
    };
  }
}
