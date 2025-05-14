import { HttpError } from "@/common";
import { Logger } from "@/libs";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  const isHttpError = error instanceof HttpError;

  const name = isHttpError ? error.name : "InternalServerError";
  const status = isHttpError ? error.status : 500;
  const message = isHttpError ? error.message : "Internal Server Error";

  response.status(status).json({
    error: {
      name,
      status,
      message,
      // Include error stack in development mode.
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  });

  Logger.error(error);
};
