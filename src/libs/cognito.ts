import { env } from "@/common";
import { CognitoJwtVerifier } from "aws-jwt-verify";

/**
 * verifies JWT tokens issued by Amazon Cognito and returns the payload (user info)
 *
 * @example const payload = await verifier.verify(token);
 */
export const verifier = CognitoJwtVerifier.create({
  userPoolId: env.keys.USER_POOL_ID,
  tokenUse: "id",
  clientId: env.keys.USER_POOL_CLIENT_ID,
});
