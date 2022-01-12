import { Context } from "@acme/core";
import { Resolvers } from "./types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "core/config";

const s3 = new S3Client({});

export const UploadResolver: Resolvers<Context> = {
  Mutation: {
    upload: async (_parent, vars, ctx) => {
      const user = ctx.assertAuthenticated();
      const cmd = new PutObjectCommand({
        Bucket: config("BUCKET"),
        Key: `${user.id}/${vars.name}`,
        ContentType: vars.type,
        ACL: "public-read",
      });
      const url = await getSignedUrl(s3, cmd);

      return url;
    },
  },
};
