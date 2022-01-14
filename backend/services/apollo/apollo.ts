import {
  ApolloError,
  ApolloServerBase,
  runHttpQuery,
} from "apollo-server-core";
import { Headers } from "fetch-headers";
import { typeDefs } from "./schema";
import { useContext } from "@acme/core";
import { merge } from "lodash-es";

import { TodoResolver } from "./todo";
import { UserResolver } from "./user";
import { SessionResolver } from "./session";
import { DebugResolver } from "./debug";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "core/config";
import { UploadResolver } from "./upload";

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Context,
} from "aws-lambda";

type ApolloContext = {
  event: APIGatewayProxyEventV2;
  context: Context;
};

class ApolloServerLambda extends ApolloServerBase<ApolloContext> {
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

const verifier = CognitoJwtVerifier.create({
  userPoolId: config("COGNITO_USER_POOL_ID"),
});

const resolvers = merge([
  TodoResolver,
  UserResolver,
  SessionResolver,
  DebugResolver,
  UploadResolver,
]);

const server = new ApolloServerLambda({
  typeDefs,
  introspection: true,
  formatError: (error) => {
    console.log(error.extensions);
    return error;
  },
  context: async (req) => {
    const auth = req.event.headers.authorization;
    if (!auth)
      return useContext({
        type: "public",
      });

    const token = auth.split("Bearer ")[1];
    try {
      const payload = await verifier.verify(token, {
        clientId: null,
        tokenUse: "access",
      });
      return useContext({
        type: "user",
        properties: {
          id: payload.sub,
        },
      });
    } catch (ex) {
      throw new ApolloError("Auth error", "auth_error");
    }
  },
  resolvers,
});
server.start();

export const handler = server.createHandler();
