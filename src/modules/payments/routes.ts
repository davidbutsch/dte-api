import { validateCognitoToken, validateRequestParams } from "@/common";
import {
  DeletePaymentMethodParamsSchema,
  PaymentController,
} from "@/modules/payments";
import { Router } from "express";

export const paymentRouter = Router();
const paymentController = new PaymentController();

paymentRouter.get(
  "/methods",
  validateCognitoToken,
  paymentController.getPaymentMethods
);

paymentRouter.post(
  "/setup-intents",
  validateCognitoToken,
  paymentController.createSetupIntent
);

paymentRouter.delete(
  "/methods/:paymentMethodId",
  validateRequestParams(DeletePaymentMethodParamsSchema),
  paymentController.deletePaymentMethod
);
