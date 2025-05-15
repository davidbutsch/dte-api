import { z } from "zod";

export const PriceDtoSchema = z
  .object({
    id: z.string(),
    productId: z.string().nullable(),
    billingScheme: z.enum(["per_unit", "tiered"]),
    currency: z.string(),
    recurring: z
      .object({
        interval: z.enum(["day", "week", "month", "year"]),
        intervalCount: z.number(),
        trialPeriodDays: z.number().nullable(),
      })
      .nullable(),
    tiers: z
      .object({
        unitAmount: z.number(),
        upTo: z.number().nullable(),
      })
      .array()
      .nullable(),
    unitAmount: z.number().nullable(),
    metadata: z.record(z.string(), z.string()).nullable(),
  })
  // Disallows unrecognized keys
  .strict();

export type PriceDto = z.infer<typeof PriceDtoSchema>;
