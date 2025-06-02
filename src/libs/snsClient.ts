import { env } from "@/common";
import { SNSClient } from "@aws-sdk/client-sns";

export const snsClient = new SNSClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: env.keys.ACCESS_KEY_ID,
    secretAccessKey: env.keys.SECRET_ACCESS_KEY,
  },
});
