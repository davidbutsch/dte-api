import z from "zod";

export const CustomerDtoSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  defaultPaymentMethodId: z.string().nullable(),
  metadata: z.record(z.string(), z.string()).nullable(),
});

export type CustomerDto = z.infer<typeof CustomerDtoSchema>;
