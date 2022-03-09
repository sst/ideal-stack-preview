import { Context } from "./Functional";
import { HttpMethods } from "aws-cdk-lib/aws-s3";
import { Bucket } from "@serverless-stack/resources";

export function Upload(props: Context) {
  const bucket = new Bucket(props.stack, "bucket");
  bucket.s3Bucket.addCorsRule({
    allowedMethods: [HttpMethods.PUT],
    allowedOrigins: ["*"],
    allowedHeaders: ["*"],
  });

  return bucket;
}
