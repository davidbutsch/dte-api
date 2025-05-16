import z from "zod";

export const SubscriptionDtoSchema = z.object({
  id: z.string(),
  billingCycleAnchor: z.number(),
  cancelAt: z.number().nullable(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.number().nullable(),
  customerId: z.string(),
  latestInvoiceId: z.string().nullable(),
  status: z.enum([
    "active",
    "canceled",
    "incomplete",
    "incomplete_expired",
    "past_due",
    "paused",
    "trialing",
    "unpaid",
  ]),
  items: z
    .object({
      id: z.string(),
      currentPeriodStart: z.number(),
      currentPeriodEnd: z.number(),
      quantity: z.number().nullable(),
      subscriptionId: z.string(),
      price: z.object({
        id: z.string(),
        productId: z.string(),
        billingScheme: z.enum(["per_unit", "tiered"]),
        currency: z.string(),
        recurring: z
          .object({
            interval: z.enum(["day", "week", "month", "year"]),
            intervalCount: z.number(),
            trialPeriodDays: z.number().nullable(),
          })
          .nullable(),
        unitAmount: z.number().nullable(),
        metadata: z.record(z.string(), z.string()).nullable(),
      }),
      metadata: z.record(z.string(), z.string()).nullable(),
    })
    .array(),
  metadata: z.record(z.string(), z.string()).nullable(),
});

export type SubscriptionDto = z.infer<typeof SubscriptionDtoSchema>;
