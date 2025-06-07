import { BadRequestError } from "@/common";
import { stripeService } from "@/modules/stripe";
import { Request, Response } from "express";

export class StripeController {
  private stripeService = stripeService;

  createStripeEvent = async (request: Request, response: Response) => {
    const signature = request.headers["stripe-signature"];

    if (typeof signature !== "string")
      throw new BadRequestError("Invalid signature.");

    await this.stripeService.handleStripeEvent(request.body, signature);

    response.json({ message: "success" });
  };
}
