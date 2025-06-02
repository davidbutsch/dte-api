import { env, NotFoundError } from "@/common";
import express from "express";

import { errorHandler } from "@/common";
import { couponRouter } from "@/modules/coupons";
import { customerRouter } from "@/modules/customers";
import { galleryRouter } from "@/modules/gallery";
import { notificationRouter } from "@/modules/notifications";
import { paymentRouter } from "@/modules/payments";
import { priceRouter } from "@/modules/prices";
import { productRouter } from "@/modules/products";
import { stripeRouter } from "@/modules/stripe";
import { subscriptionRouter } from "@/modules/subscriptions";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "./winston";

export const app = express();

app.enable("trust proxy");
app.use(helmet());
app.use(cors());

// Only parse json for non-webhook requests
app.use((request, response, next) => {
  if (request.url == "/stripe/events") next();
  else express.json()(request, response, next);
});

// Log requests
app.use((request, _response, next) => {
  Logger.info({
    message: `${request.method} ${request.url}`,
    url: request.url,
    headers: request.headers,
  });
  next();
});

// Routes
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/prices", priceRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/coupons", couponRouter);
app.use("/payments", paymentRouter);
app.use("/stripe", stripeRouter);
app.use("/gallery", galleryRouter);
app.use("/notifications", notificationRouter);

// Handle undefined routes
app.use((request, _response, next) =>
  next(new NotFoundError(`${request.method} ${request.url} not found.`))
);

app.use(errorHandler);

app.listen(env.keys.PORT, () => {
  Logger.info(`Listening on port ${env.keys.PORT}`);
});
