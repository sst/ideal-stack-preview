import { StackContext, use, ViteStaticSite } from "@serverless-stack/resources";
import { Authentication } from "./Authentication";
import { GraphQL } from "./Graphql";

export function Frontend(props: StackContext) {
  const auth = use(Authentication);
  const graphql = use(GraphQL);
  const client = auth.cognitoUserPool!.addClient("frontendClient", {
    userPoolClientName: "frontend",
  });

  const site = new ViteStaticSite(props.stack, "frontend", {
    path: "frontend",
    environment: {
      VITE_GRAPHQL_URL: graphql.url,
      VITE_COGNITO_USER_POOL_ID: auth.cognitoUserPool!.userPoolId,
      VITE_COGNITO_CLIENT_ID: client.userPoolClientId,
    },
  });

  return site;
}
