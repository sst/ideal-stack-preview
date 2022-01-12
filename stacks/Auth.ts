import * as sst from "@serverless-stack/resources";

export class Auth extends sst.Stack {
  public readonly outputs: {
    userPool: Exclude<sst.Auth["cognitoUserPool"], undefined>;
  };
  constructor(scope: sst.App) {
    super(scope, "auth");

    const auth = new sst.Auth(this, "auth", {
      cognito: {
        userPool: {
          signInAliases: {
            email: true,
          },
          passwordPolicy: {
            requireDigits: false,
            requireSymbols: false,
            requireLowercase: false,
            requireUppercase: false,
          },
        },
      },
    });

    this.outputs = {
      userPool: auth.cognitoUserPool!,
    };
  }
}
