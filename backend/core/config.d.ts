import { Config } from "@serverless-stack/backend";

declare module "@serverless-stack/backend" {
  interface ConfigType {
    RDS_DATABASE: string;
    RDS_SECRET: string;
    RDS_ARN: string;
    BUCKET: string;
    COGNITO_USER_POOL_ID: string;
    MY_SPECIAL_CONFIG: string;
  }
}
