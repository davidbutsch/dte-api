import { GalleryService, GetGalleryFilesQueryParams } from "@/modules/gallery";
import { Request, Response } from "express";

export class GalleryController {
  private galleryService = new GalleryService();

  /**
   * Retrieves gallery file paths along with `nextToken` for retrieving next set of paths.
   *
   * Requires middleware(s):
   * - `validateRequestQuery(GetGalleryFilesQueryParamsSchema)`
   */
  getGalleryFilePaths = async (request: Request, response: Response) => {
    const query = request.query as typeof request.query &
      GetGalleryFilesQueryParams;

    const { nextToken, paths } =
      await this.galleryService.getPaginatedGalleryFilePaths(
        query.limit,
        query.token
      );

    response.json({
      nextToken,
      paths,
    });
  };
}
