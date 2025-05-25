import { z } from "zod";

export const GetProductPricesParamsSchema = z
  .object({
    productId: z.string(),
  })
  // Disallows unrecognized keys
  .strict();

export type GetProductPricesParams = z.infer<
  typeof GetProductPricesParamsSchema
>;
