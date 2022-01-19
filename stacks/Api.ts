import * as sst from "@serverless-stack/resources";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

import { Database } from "./Database";
import { Auth } from "./Auth";
import { Parameter } from "./Parameter";

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
      },
    });
    props.db.cluster.secret?.grantRead(apollo.serverFunction);
    props.db.cluster.grantDataApiAccess(apollo.serverFunction);

    Parameter.use(
      apollo.serverFunction,
      new Parameter(this, { name: "BUCKET", value: bucket.bucketName }),
      new Parameter(this, {
        name: "RDS_SECRET",
        value: props.db.cluster.secret!.secretArn,
      }),
      new Parameter(this, {
        name: "RDS_ARN",
        value: props.db.cluster.clusterArn,
      }),
      new Parameter(this, {
        name: "RDS_DATABASE",
        value: "acme",
      }),
      new Parameter(this, {
        name: "COGNITO_USER_POOL_ID",
        value: props.auth.userPool.userPoolId,
      }),
      new Parameter(this, {
        name: "MY_SPECIAL_CONFIG",
      })
    );

    this.outputs = {
      apollo: apollo.url,
    };
  }
}
