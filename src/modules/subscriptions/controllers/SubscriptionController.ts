import {
  CreateSubscriptionBody,
  SubscriptionService,
  UpdateSubscriptionBody,
  UpdateSubscriptionParams,
} from "@/modules/subscriptions";
import { Request, Response } from "express";

export class SubscriptionController {
  private subscriptionService = new SubscriptionService();

  /**
   * Gets all subscriptions associated with token payload email.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   */
  getSubscriptions = async (_request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const subscriptions =
      await this.subscriptionService.getSubscriptionListByEmail(email);

    response.status(200).json(subscriptions);
  };

  /**
   * Creates subscription with token payload email and request body.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   * - `validateRequestBody(CreateSubscriptionBodySchema)`
   */
  createSubscription = async (request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const body: CreateSubscriptionBody = request.body;

    const subscription =
      await this.subscriptionService.createSubscriptionByEmail(email, body);

    response.json(subscription);
  };

  /**
   * Updates subscription with token payload email, request params, and request body.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   * - `validateRequestParams(UpdateSubscriptionParamsSchema)`
   * - `validateRequestBody(UpdateSubscriptionBodySchema)`
   */
  updateSubscription = async (request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const body: UpdateSubscriptionBody = request.body;
    const { subscriptionId } = request.params as UpdateSubscriptionParams;

    const updatedSubscription =
      await this.subscriptionService.updateSubscriptionById(
        email,
        subscriptionId,
        body
      );

    response.json(updatedSubscription);
  };
}
