import { z } from "zod";

export const GetProductParamsSchema = z
  .object({
    productId: z.string(),
  })
  // Disallows unrecognized keys
  .strict();

export type GetProductParams = z.infer<typeof GetProductParamsSchema>;
