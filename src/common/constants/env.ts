import dotenv from "dotenv";
import { defaultEnvOptions } from "./defaults";

dotenv.config();

const keys = [
  "NODE_ENV",
  "PORT",
  "LOG_PATH",
  "STRIPE_SECRET_KEY",
  "STRIPE_ENDPOINT_SECRET",
  "USER_POOL_ID",
  "USER_POOL_CLIENT_ID",
  "ACCESS_KEY_ID",
  "SECRET_ACCESS_KEY",
  "ASSETS_BUCKET_NAME",
] as const; // const assert creates readonly "tuple" array
type Key = (typeof keys)[number];
export type EnvKeys = Record<Key, string>;

export class Env {
  keys: EnvKeys = {} as EnvKeys;

  // constructor & validate accept readonly arrays to allow for `keys` as a valid argument
  constructor(required: readonly Key[] | Key[] = keys) {
    this.validate(required);
  }

  validate(required: readonly Key[] | Key[]) {
    const validatedKeys: any = {};

    required.forEach((key) => {
      const value = process.env[key] || defaultEnvOptions[key];

      // check if undefined allows for empty strings
      if (value == undefined)
        throw new Error(
          `Missing environment variable "${key}" has no default, cannot start service`
        );

      validatedKeys[key] = value;
    });

    this.keys = validatedKeys;
  }
}

export const env = new Env(keys);
