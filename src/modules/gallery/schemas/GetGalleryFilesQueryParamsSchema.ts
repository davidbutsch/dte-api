import z from "zod";

export const GetGalleryFilesQueryParamsSchema = z.object({
  token: z.string().optional(),
  // Numeric string
  limit: z.string().regex(/^\d+$/).transform(Number),
});

export type GetGalleryFilesQueryParams = z.infer<
  typeof GetGalleryFilesQueryParamsSchema
>;
