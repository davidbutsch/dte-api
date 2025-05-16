import { z } from "zod";

// Only contains stripe subscription update params which are supported or allowed
// Refer to `Stripe.SubscriptionUpdateParams`
export const UpdateSubscriptionBodySchema = z
  .object({
    cancel_at_period_end: z.boolean(),
  })
  // Disallows unrecognized keys
  .strict();

export type UpdateSubscriptionBody = z.infer<
  typeof UpdateSubscriptionBodySchema
>;
