import { BadRequestError, InternalServerError } from "@/common";
import { RequestHandler } from "express";
import { ZodTypeAny, z } from "zod";

const validate = (
  schema: ZodTypeAny,
  source: "body" | "params" | "query"
): RequestHandler => {
  return async (request, _response, next) => {
    try {
      console.log(request.body);
      await schema.parseAsync(request[source]);
      next();
    } catch (error) {
      // Pass BadRequestError for parse errors
      if (error instanceof z.ZodError)
        return next(
          new BadRequestError(`Invalid request ${source}.`, error.errors)
        );

      // Otherwise pass InternalServerError and include original error
      return next(
        new InternalServerError(`Error parsing request ${source}.`, { error })
      );
    }
  };
};

export const validateRequestBody = (schema: ZodTypeAny): RequestHandler =>
  validate(schema, "body");

export const validateRequestParams = (schema: ZodTypeAny): RequestHandler =>
  validate(schema, "params");

export const validateRequestQuery = (schema: ZodTypeAny): RequestHandler =>
  validate(schema, "query");
