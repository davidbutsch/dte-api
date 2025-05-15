import { validateRequestParams } from "@/common";
import { GetPriceParamsSchema, PriceController } from "@/modules/prices";
import { Router } from "express";

export const priceRouter = Router();
const priceController = new PriceController();

priceRouter.get(
  "/:priceId",
  validateRequestParams(GetPriceParamsSchema),
  priceController.getPrice
);
