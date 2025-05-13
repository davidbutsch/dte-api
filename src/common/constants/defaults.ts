import { EnvKeys } from "./env";

export const defaultEnvOptions: Partial<EnvKeys> = {
  NODE_ENV: "production",
  LOG_PATH: "./logs",
};

export const defaultValidationConfig = {
  whitelist: true,
  forbidNonWhitelisted: true,
};
