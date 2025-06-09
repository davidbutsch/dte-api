import {
  ASSETS_BUCKET_URL,
  env,
  GALLERY_FOLDER_PREFIX,
  InternalServerError,
} from "@/common";
import { s3Client } from "@/libs";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export class GalleryService {
  /**
   * Retrievs gallery file paths along with `nextToken` for retrieving next set of paths.
   *
   * @param limit - Specifies the maximum number of paths to return.
   * @param token - Optional continuation token for retrieving next set of paths.
   */
  getPaginatedGalleryFilePaths = async (
    limit: number,
    token?: string | undefined | null
  ) => {
    try {
      let ContinuationToken = token || undefined;
      const paths: string[] = [];

      const command = new ListObjectsV2Command({
        Bucket: env.keys.ASSETS_BUCKET_NAME,
        Prefix: GALLERY_FOLDER_PREFIX,
        ContinuationToken,
        MaxKeys: limit,
      });

      const response = await s3Client.send(command);

      if (response.Contents)
        // Only push item Key (the file path) if it does not match the gallery folder prefix
        // Only push item Key (^) if it is defined
        for (const item of response.Contents)
          if (item.Key !== GALLERY_FOLDER_PREFIX && item.Key)
            // Prepend file path with assets bucket url
            paths.push(ASSETS_BUCKET_URL + item.Key);

      const nextToken = response.NextContinuationToken || null;

      return { nextToken, paths };
    } catch (error) {
      // Throw InternalServerError and include unrecognized error along with method paramaters
      throw new InternalServerError(
        `Error getting paginated gallery file paths.`,
        {
          error,
          limit,
          token,
        }
      );
    }
  };
}
