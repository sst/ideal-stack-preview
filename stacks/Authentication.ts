import { StackContext, Auth } from "@serverless-stack/resources";

export function Authentication(props: StackContext) {
  const auth = new Auth(props.stack, "auth2", {
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
