import { env, NotFoundError } from "@/common";
import express from "express";

import { errorHandler } from "@/common";
import { customerRouter } from "@/modules/customers";
import { priceRouter } from "@/modules/prices";
import { productRouter } from "@/modules/products";
import { subscriptionRouter } from "@/modules/subscriptions";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "./winston";

export const app = express();

app.enable("trust proxy");
app.use(helmet());
app.use(cors());
app.use(express.json());

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

// Handle undefined routes
app.use((request, _response, next) =>
  next(new NotFoundError(`${request.method} ${request.url} not found.`))
);

app.use(errorHandler);

app.listen(env.keys.PORT, () => {
  Logger.info(`Listening on port ${env.keys.PORT}`);
});
