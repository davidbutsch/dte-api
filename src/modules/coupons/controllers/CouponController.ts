import { CouponService, GetPromotionParams } from "@/modules/coupons";
import { Request, Response } from "express";

export class CouponController {
  private couponService = new CouponService();

  /**
   * Gets promotion from request parameter `code`.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   * - `validateRequestParams(GetPromotionParamsSchema)`
   */
  getPromotion = async (request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const { code } = request.params as GetPromotionParams;

    const promotion = await this.couponService.getPromotionByCode(email, code);

    response.json(promotion);
  };
}
