import {
  GetProductParams,
  GetProductPricesParams,
  ProductService,
} from "@/modules/products";
import { Request, Response } from "express";

export class ProductController {
  private productService = new ProductService();

  /**
   * Gets all products.
   */
  getProducts = async (_request: Request, response: Response) => {
    const products = await this.productService.getProducts();

    response.json(products);
  };

  /**
   * Gets product from request parameter `productId`.
   *
   * Requires middleware(s):
   * - `validateRequestParams(GetProductParamsSchema)`
   */
  getProduct = async (request: Request, response: Response) => {
    const { productId } = request.params as GetProductParams;

    const product = await this.productService.getProductById(productId);

    response.json(product);
  };

  /**
   * Gets product price ids from request parameter `productId`.
   *
   * Requires middleware(s):
   * - `validateRequestParams(GetProductPriceIdsParamsSchema)`
   */
  getProductPrices = async (request: Request, response: Response) => {
    const { productId } = request.params as GetProductPricesParams;

    const prices = await this.productService.getProductPricesById(productId);

    response.json(prices);
  };
}
