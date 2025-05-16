import { validateRequestParams } from "@/common";
import { GetProductParamsSchema, ProductController } from "@/modules/products";
import { Router } from "express";

export const productRouter = Router();
const productController = new ProductController();

productRouter.get("/", productController.getProducts);

productRouter.get(
  "/:productId",
  validateRequestParams(GetProductParamsSchema),
  productController.getProduct
);
