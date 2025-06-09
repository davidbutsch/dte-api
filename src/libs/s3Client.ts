import { env } from "@/common";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: env.keys.ACCESS_KEY_ID,
    secretAccessKey: env.keys.SECRET_ACCESS_KEY,
  },
});
