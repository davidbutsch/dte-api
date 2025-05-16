import { z } from "zod";

export const ProductDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    active: z.boolean(),
    defaultPriceId: z.string().nullable(),
    description: z.string().nullable(),
    images: z.string().array(),
    marketingFeatures: z.string().array(),
    type: z.enum(["good", "service"]),
    metadata: z.record(z.string(), z.string()).nullable(),
  })
  // Disallows unrecognized keys
  .strict();

export type ProductDto = z.infer<typeof ProductDtoSchema>;
