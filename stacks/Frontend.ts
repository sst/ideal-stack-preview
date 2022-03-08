import * as sst from "@serverless-stack/resources";
import { Auth } from "./Auth";
import { FunctionalStackProps, use } from "./Functional";
import { GraphQL } from "./Graphql";

export function Frontend(props: FunctionalStackProps) {
  const { auth } = use(Auth);
  const graphql = use(GraphQL);
  const client = auth.cognitoUserPool!.addClient("frontendClient", {
    userPoolClientName: "frontend",
  });

  const site = new sst.ViteStaticSite(props.stack, "frontend", {
    path: "frontend",
    environment: {
      VITE_GRAPHQL_URL: graphql.url,
      VITE_COGNITO_USER_POOL_ID: auth.cognitoUserPool!.userPoolId,
      VITE_COGNITO_CLIENT_ID: client.userPoolClientId,
    },
  });

  return site;
}
