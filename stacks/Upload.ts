import { HttpMethods } from "aws-cdk-lib/aws-s3";
import { Bucket, StackContext } from "@serverless-stack/resources";

export function Upload(props: StackContext) {
  const bucket = new Bucket(props.stack, "bucket");
  bucket.s3Bucket.addCorsRule({
    allowedMethods: [HttpMethods.PUT],
    allowedOrigins: ["*"],
    allowedHeaders: ["*"],
  });

  return bucket;
}
