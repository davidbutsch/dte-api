import { z } from "zod";

export const SetupIntentDtoSchema = z
  .object({
    clientSecret: z.string().nullable(),
  })
  // Disallows unrecognized keys
  .strict();

export type SetupIntentDto = z.infer<typeof SetupIntentDtoSchema>;
