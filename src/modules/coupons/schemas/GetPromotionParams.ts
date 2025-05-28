import { z } from "zod";

export const GetPromotionParamsSchema = z
  .object({
    code: z.string(),
  })
  // Disallows unrecognized keys
  .strict();

export type GetPromotionParams = z.infer<typeof GetPromotionParamsSchema>;
