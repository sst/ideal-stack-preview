import * as sst from "@serverless-stack/resources";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

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

    const bucket = new sst.Bucket(this, "bucket");
    bucket.s3Bucket.addCorsRule({
      allowedMethods: [HttpMethods.PUT],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
    });

    const apollo = new sst.ApolloApi(this, "apollo", {
      server: "services/gql/gql.handler",
      defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
      defaultFunctionProps: {
        permissions: [bucket],
        bundle: {
          format: "esm",
        },
        environment: {
          BUCKET: bucket.bucketName,
          RDS_SECRET: props.db.cluster.secret!.secretArn,
          RDS_ARN: props.db.cluster.clusterArn,
          RDS_DATABASE: "acme",
          COGNITO_USER_POOL_ID: props.auth.userPool.userPoolId,
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
