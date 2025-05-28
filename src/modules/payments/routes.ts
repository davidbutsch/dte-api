import { validateCognitoToken } from "@/common";
import { PaymentController } from "@/modules/payments";
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
