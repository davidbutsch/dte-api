import { z } from "zod";

export const CreateSubscriptionItemSchema = z
  .object({
    price: z.string(),
    quantity: z.number().optional(),
    discounts: z
      .object({
        promotion_code: z.string().optional(),
      })
      .array(),
    metadata: z.record(z.string(), z.string()).optional(),
  })
  // Disallows unrecognized keys
  .strict();

export const CreateSubscriptionBodySchema = z.object({
  items: z.array(CreateSubscriptionItemSchema).min(1),
  metadata: z.record(z.string(), z.string()).optional(),
});

export type CreateSubscriptionItem = z.infer<
  typeof CreateSubscriptionItemSchema
>;
export type CreateSubscriptionBody = z.infer<
  typeof CreateSubscriptionBodySchema
>;
