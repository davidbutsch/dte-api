import { env, NotFoundError } from "@/common";
import express from "express";

import { errorHandler } from "@/common";
import { customerRouter } from "@/modules/customers";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "./winston";

export const app = express();

app.enable("trust proxy");
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/customers", customerRouter);

// Handle undefined routes
app.use((_request, _response, next) =>
  next(new NotFoundError("Route not found."))
);

app.use(errorHandler);

app.listen(env.keys.PORT, () => {
  Logger.info(`Listening on port ${env.keys.PORT}`);
});
