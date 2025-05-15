import { z } from "zod";

export const GetPriceParamsSchema = z
  .object({
    priceId: z.string(),
  })
  // Disallows unrecognized keys
  .strict();

export type GetPriceParams = z.infer<typeof GetPriceParamsSchema>;
