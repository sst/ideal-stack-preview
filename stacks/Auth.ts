import * as sst from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";

export class Auth extends sst.Stack {
  public readonly outputs: {
    userPool: Exclude<sst.Auth["cognitoUserPool"], undefined>;
  };
  constructor(scope: sst.App) {
    super(scope, "auth");

    const auth = new sst.Auth(this, "auth2", {
      cognito: {
        userPool: {
          passwordPolicy: {
            requireDigits: false,
            requireSymbols: false,
            requireLowercase: false,
            requireUppercase: false,
          },
          removalPolicy: RemovalPolicy.DESTROY,
        },
      },
    });

    this.outputs = {
      userPool: auth.cognitoUserPool!,
    };
  }
}
