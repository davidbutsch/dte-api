import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "@/common";
import { verifier } from "@/libs";
import { RequestHandler } from "express";

export const validateCognitoToken: RequestHandler = async (
  request,
  response,
  next
) => {
  // Get authorization header
  const authorizationHeader = request.headers["authorization"];

  // Throw bad request if no authoriation header is provided
  if (!authorizationHeader)
    return next(new BadRequestError("Missing authorization header"));

  // Parse token content from header (e.g. "Bearer abc123TokenExample")
  const token = authorizationHeader.split(" ")[1];

  try {
    // Try to validate jwt
    const payload = await verifier.verify(token);

    // Attach token payload to response.locals
    response.locals.tokenPayload = payload;

    // Move to next middleware
    next();
  } catch (error) {
    // Pass custom error if constructor name is recognized
    if (error instanceof Error)
      switch (error.constructor.name) {
        case "JwtExpiredError":
          return next(new UnauthorizedError("Authorization token expired."));
      }

    // Otherwise pass InternalServerError and include unrecognized error
    return next(
      new InternalServerError(`Error verifying authorization token.`, { error })
    );
  }
};
