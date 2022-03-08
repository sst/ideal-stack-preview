import * as sst from "@serverless-stack/resources";
import { FunctionalStackProps } from "./Functional";
import { HttpMethods } from "aws-cdk-lib/aws-s3";
import { Parameter } from "./Parameter";

export function Upload(props: FunctionalStackProps) {
  const bucket = new sst.Bucket(props.stack, "bucket");
  bucket.s3Bucket.addCorsRule({
    allowedMethods: [HttpMethods.PUT],
    allowedOrigins: ["*"],
    allowedHeaders: ["*"],
  });

  return {
    bucket,
    parameters: Parameter.create(props.stack, {
      UPLOAD_BUCKET: bucket.bucketName,
    }),
  };
}
