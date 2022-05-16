import { StackContext, use, GraphQLApi } from "@serverless-stack/resources";
import { Database } from "./Database";

export function Api({ stack }: StackContext) {
  const rds = use(Database);
  const api = new GraphQLApi(stack, "api", {
    defaults: {
      function: {
        permissions: [rds],
        environment: {
          RDS_SECRET_ARN: rds.secretArn,
          RDS_ARN: rds.clusterArn,
          RDS_DATABASE: rds.defaultDatabaseName,
        },
      },
    },
    server: {
      handler: "functions/graphql/graphql.handler",
    },
  });

  stack.addOutputs({
    API_URL: api.url,
  });

  return api;
}
