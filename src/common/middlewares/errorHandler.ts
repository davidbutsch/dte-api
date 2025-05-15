import { HttpError } from "@/common";
import { Logger } from "@/libs";
import { ErrorRequestHandler } from "express";
import { serializeError } from "serialize-error";

export const errorHandler: ErrorRequestHandler = (
  err,
  _request,
  response,
  _next
) => {
  const isHttpError = err instanceof HttpError;

  const name = isHttpError ? err.name : "InternalServerError";
  const status = isHttpError ? err.status : 500;
  const message = err?.message || "Something went wrong.";

  const error: Record<string, any> = {
    name,
    status,
    message,
  };

  const isProductionMode = process.env.NODE_ENV == "production";

  // Handle optional details object if it exists
  if (
    "details" in err &&
    typeof err.details === "object" &&
    err.details !== null
  ) {
    // Clone details using spread operator to avoid mutating original error object
    const details = { ...err.details };

    // Serialize `details.error` if it exists
    if ("error" in details) details.error = serializeError(details.error);

    // Attach full details for logging
    error.details = details;
  }

  // Attach stack trace for logging if it exists
  if (err && typeof err.stack === "string") error.stack = err.stack;

  // By logging now, winston attaches `timestamp` and `level` properties to the error object
  Logger.error(error);

  // In production mode and if the details object exists...
  if (isProductionMode && error.details) {
    // Remove the serialized error (which may contain sensitive data like stack traces)
    delete error.details.error;

    // Remove the details object entirely if now empty
    if (Object.keys(error.details).length === 0) delete error.details;
  }

  // In production mode, omit error stack
  if (isProductionMode) delete error.stack;

  response.status(status).json({
    error,
  });
};
