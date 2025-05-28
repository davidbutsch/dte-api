import { validateCognitoToken, validateRequestParams } from "@/common";
import { CouponController, GetPromotionParamsSchema } from "@/modules/coupons";
import { Router } from "express";

export const couponRouter = Router();
const couponController = new CouponController();

couponRouter.get(
  "/promotions/:code",
  validateCognitoToken,
  validateRequestParams(GetPromotionParamsSchema),
  couponController.getPromotion
);
