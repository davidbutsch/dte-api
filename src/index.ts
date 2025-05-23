process.title = "dte-api";
Error.stackTraceLimit = process.env.NODE_ENV === "production" ? -1 : 10;

import { addAlias } from "module-alias";
addAlias("@", `${__dirname}/`);

import * as libs from "@/libs";

import { env } from "@/common";

libs.Logger.info(
  `${process.title} with process id of ${process.pid} starting in ${env.keys.NODE_ENV} mode`
);
