import { GetPriceParams, PriceService } from "@/modules/prices";
import { Request, Response } from "express";

export class PriceController {
  private priceService = new PriceService();

  /**
   * Gets price from request parameter `priceId`.
   *
   * Requires middleware(s):
   * - `validateRequestParams(GetPriceParamsSchema)`
   */
  getPrice = async (request: Request, response: Response) => {
    const { priceId } = request.params as GetPriceParams;

    const price = await this.priceService.getPriceById(priceId);

    response.json(price);
  };
}
