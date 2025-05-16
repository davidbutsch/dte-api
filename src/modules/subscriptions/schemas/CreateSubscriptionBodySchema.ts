import { z } from "zod";

export const CreateSubscriptionItemSchema = z
  .object({
    price: z.string(),
    quantity: z.number().optional(),
  })
  // Disallows unrecognized keys
  .strict();

export const CreateSubscriptionBodySchema = z.object({
  items: z.array(CreateSubscriptionItemSchema).min(1),
});

export type CreateSubscriptionItem = z.infer<
  typeof CreateSubscriptionItemSchema
>;
export type CreateSubscriptionBody = z.infer<
  typeof CreateSubscriptionBodySchema
>;
