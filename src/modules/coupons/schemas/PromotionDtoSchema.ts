import z from "zod";
import { CouponDtoSchema } from "./CouponDtoSchema";

export const PromotionDtoSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  code: z.string(),
  coupon: CouponDtoSchema,
  customerId: z.string().nullable(),
  expiresAt: z.number().nullable(),
  maxRedemptions: z.number().nullable(),
  restrictions: z.object({
    firstTimeTransaction: z.boolean(),
    minimumAmount: z.number().nullable(),
  }),
  timesRedeemed: z.number(),
  metadata: z.record(z.string(), z.string()).nullable(),
});

export type PromotionDto = z.infer<typeof PromotionDtoSchema>;
