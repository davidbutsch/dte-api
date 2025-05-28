import z from "zod";

export const PaymentMethodDtoSchema = z.object({
  id: z.string(),
  type: z.string(),
  billing: z.object({
    postalCode: z.string().nullable(),
    country: z.string().nullable(), // Two letter country code
  }),
  card: z.object({
    checks: z.object({
      addressLine: z.string().nullable(),
      addressPostalCode: z.string().nullable(),
      cvc: z.string().nullable(),
    }),
    country: z.string().nullable(),
    brand: z.string(),
    expires: z.string(), // MM/YYYY format
    funding: z.string(), // funding type of the card (e.g. credit, debit, prepaid, ...)
    last4: z.string(),
  }),
});

export type PaymentMethodDto = z.infer<typeof PaymentMethodDtoSchema>;
