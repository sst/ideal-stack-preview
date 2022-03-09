import * as sst from "@serverless-stack/resources";
import { Context } from "./Functional";

export function Auth(props: Context) {
  const auth = new sst.Auth(props.stack, "auth2", {
    cognito: {
      userPool: {
        passwordPolicy: {
          requireDigits: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false,
        },
      },
    },
  });
  return auth;
}
