import { z } from "zod";

/**
 * Only contains stripe subscription update params which are supported or allowed
 * @see Stripe.CustomerUpdateParams
 */
export const UpdateCustomerBodySchema = z
  .object({
    invoice_settings: z
      .object({
        default_payment_method: z.string(),
      })
      .optional(),
  })
  // Disallows unrecognized keys
  .strict();

export type UpdateCustomerBody = z.infer<typeof UpdateCustomerBodySchema>;
