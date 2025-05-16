import { z } from "zod";

export const UpdateSubscriptionParamsSchema = z
  .object({
    subscriptionId: z.string(),
  })
  // Disallows unrecognized keys
  .strict();

export type UpdateSubscriptionParams = z.infer<
  typeof UpdateSubscriptionParamsSchema
>;
