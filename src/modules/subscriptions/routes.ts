import {
  validateCognitoToken,
  validateRequestBody,
  validateRequestParams,
} from "@/common";
import {
  CreateSubscriptionBodySchema,
  SubscriptionController,
  UpdateSubscriptionBodySchema,
  UpdateSubscriptionParamsSchema,
} from "@/modules/subscriptions";
import { Router } from "express";

export const subscriptionRouter = Router();
const subscriptionController = new SubscriptionController();

subscriptionRouter.get(
  "/",
  validateCognitoToken,
  subscriptionController.getSubscriptions
);

subscriptionRouter.post(
  "/",
  validateCognitoToken,
  validateRequestBody(CreateSubscriptionBodySchema),
  subscriptionController.createSubscription
);

subscriptionRouter.patch(
  "/:subscriptionId",
  validateCognitoToken,
  validateRequestParams(UpdateSubscriptionParamsSchema),
  validateRequestBody(UpdateSubscriptionBodySchema),
  subscriptionController.updateSubscription
);
