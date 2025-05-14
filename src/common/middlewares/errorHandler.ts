import { HttpError } from "@/common";
import { Logger } from "@/libs";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: any,
  _request: Request,
  response: Response,
  _next: NextFunction
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
