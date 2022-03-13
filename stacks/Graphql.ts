import { Database } from "./Database";
import { Upload } from "./Upload";
import {
  ApiPayloadFormatVersion,
  GraphQLApi,
  StackContext,
  use,
} from "@serverless-stack/resources";
import { Authentication } from "./Authentication";

export function GraphQL(props: StackContext) {
  const db = use(Database);
  const upload = use(Upload);
  const auth = use(Authentication);

  const graphql = new GraphQLApi(props.stack, "graphql", {
    server: {
      handler: "functions/graphql/graphql.handler",
      permissions: [db, upload],
      bundle: {
        format: "esm",
      },
      environment: {
        UPLOAD_BUCKET: upload.bucketName,
        RDS_ARN: db.clusterArn,
        RDS_SECRET: db.secretArn,
        RDS_DATABASE: "database",
        COGNITO_USER_POOL_ID: auth.cognitoUserPool!.userPoolId,
      },
    },
    defaultPayloadFormatVersion: ApiPayloadFormatVersion.V2,
    codegen: "./graphql/codegen.yml",
  });

  return graphql;
}
