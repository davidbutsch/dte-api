import { validateRequestQuery } from "@/common";
import {
  GalleryController,
  GetGalleryFilesQueryParamsSchema,
} from "@/modules/gallery";
import { Router } from "express";

export const galleryRouter = Router();
const galleryController = new GalleryController();

galleryRouter.get(
  "/paths/",
  validateRequestQuery(GetGalleryFilesQueryParamsSchema),
  galleryController.getGalleryFilePaths
);
