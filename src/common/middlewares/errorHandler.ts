import { HttpError } from "@/common";
import { Logger } from "@/libs";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  err,
  _request,
  response,
  _next
) => {
  const isHttpError = err instanceof HttpError;

  const name = isHttpError ? err.name : "InternalServerError";
  const status = isHttpError ? err.status : 500;
  const message = isHttpError ? err.message : "Internal Server Error";

  const error: Record<string, any> = {
    name,
    status,
    message,
  };

  // Include error details if they exist
  if ("details" in err) error.details = err.details;

  // Include error stack in development mode
  if (process.env.NODE_ENV === "development") error.stack = err.stack;

  response.status(status).json({
    error,
  });

  Logger.error(error);
};
