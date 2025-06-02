import z from "zod";

export const SendNotificationQueryParamsSchema = z.object({
  message: z.string(),
});

export type SendNotificationQueryParams = z.infer<
  typeof SendNotificationQueryParamsSchema
>;
