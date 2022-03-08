import * as sst from "@serverless-stack/resources";
import { FunctionalStackProps } from "./Functional";
import { Parameter } from "./Parameter";

export function Auth(props: FunctionalStackProps) {
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
  return {
    auth,
    parameters: Parameter.create(props.stack, {
      COGNITO_USER_POOL_ID: auth.cognitoUserPool!.userPoolId,
    }),
  };
}
