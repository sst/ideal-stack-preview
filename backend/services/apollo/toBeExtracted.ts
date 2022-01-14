import { ApolloServerBase, runHttpQuery } from "apollo-server-core";
import { Headers } from "fetch-headers";

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Context,
} from "aws-lambda";

type ApolloContext = {
  event: APIGatewayProxyEventV2;
  context: Context;
};

export class ApolloServerLambda extends ApolloServerBase<ApolloContext> {
  public createHandler() {
    const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
      await this.ensureStarted();

      if (event.rawPath === "/" && event.requestContext.http.method === "GET") {
        const landing = this.getLandingPage();
        if (landing) {
          return {
            statusCode: 200,
            headers: {
              "Content-Type": "text/html",
            },
            body: landing.html,
          };
        }
      }

      const json = event.body
        ? JSON.parse(event.body)
        : event.queryStringParameters || {};
      const result = await runHttpQuery([], {
        query: json,
        method: event.requestContext.http.method,
        options: await this.graphQLServerOptions({
          event: event,
          context: context,
        }),
        request: {
          method: event.requestContext.http.method,
          url: event.requestContext.http.path,
          headers: new Headers(event.headers),
        },
      });
      return {
        statusCode: 200,
        headers: result.responseInit.headers,
        body: result.graphqlResponse,
      };
    };

    return handler;
  }
}
