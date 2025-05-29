import { z } from "zod";

export const DeletePaymentMethodParamsSchema = z
  .object({
    paymentMethodId: z.string(),
  })
  // Disallows unrecognized keys
  .strict();

export type DeletePaymentMethodParams = z.infer<
  typeof DeletePaymentMethodParamsSchema
>;
