import z from "zod";

export const CouponDtoSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  valid: z.boolean(),
  amountOff: z.number().nullable(),
  percentOff: z.number().nullable(),
  productIds: z.string().array(),
  duration: z.enum(["forever", "once", "repeating"]),
  durationInMonths: z.number().nullable(),
  redeemBy: z.number().nullable(),
  metadata: z.record(z.string(), z.string()).nullable(),
});

export type CouponDto = z.infer<typeof CouponDtoSchema>;
