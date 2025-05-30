import { StripeController } from "@/modules/stripe";
import { raw, Router } from "express";

export const stripeRouter = Router();
const stripeController = new StripeController();

stripeRouter.post(
  "/events",
  raw({ type: "application/json" }),
  stripeController.createStripeEvent
);
