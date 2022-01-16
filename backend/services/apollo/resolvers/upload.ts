import { config } from "core/config";
import { Resolvers } from "./types";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3();

export const UploadResolver: Resolvers = {
  Mutation: {
    upload: async (_parent, vars, ctx) => {
      const user = ctx.assertAuthenticated();
      const url = s3.getSignedUrl("putObject", {
        Bucket: config("BUCKET"),
        Key: `${user.id}/${vars.name}`,
        ContentType: vars.type,
        ACL: "public-read",
      });
      return url;
    },
  },
};
