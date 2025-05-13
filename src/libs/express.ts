import { env } from "@/common";
import express from "express";

import cors from "cors";
import helmet from "helmet";
import { Logger } from "./winston";

export const app = express();

app.enable("trust proxy");
app.use(helmet());
app.use(cors());

app.listen(env.keys.PORT, () => {
  Logger.info(`Listening on port ${env.keys.PORT}`);
});
