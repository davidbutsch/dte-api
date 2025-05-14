export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(401, message, details);
  }
}

export class PaymentRequiredError extends HttpError {
  constructor(message = "Payment Required", details?: unknown) {
    super(402, message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details?: unknown) {
    super(403, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found", details?: unknown) {
    super(404, message, details);
  }
}

export class MethodNotAllowedError extends HttpError {
  constructor(message = "Method Not Allowed", details?: unknown) {
    super(405, message, details);
  }
}

export class NotAcceptableError extends HttpError {
  constructor(message = "Not Acceptable", details?: unknown) {
    super(406, message, details);
  }
}

export class ProxyAuthenticationRequiredError extends HttpError {
  constructor(message = "Proxy Authentication Required", details?: unknown) {
    super(407, message, details);
  }
}

export class RequestTimeoutError extends HttpError {
  constructor(message = "Request Timeout", details?: unknown) {
    super(408, message, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict", details?: unknown) {
    super(409, message, details);
  }
}

export class GoneError extends HttpError {
  constructor(message = "Gone", details?: unknown) {
    super(410, message, details);
  }
}

export class LengthRequiredError extends HttpError {
  constructor(message = "Length Required", details?: unknown) {
    super(411, message, details);
  }
}

export class PreconditionFailedError extends HttpError {
  constructor(message = "Precondition Failed", details?: unknown) {
    super(412, message, details);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = "Payload Too Large", details?: unknown) {
    super(413, message, details);
  }
}

export class URITooLongError extends HttpError {
  constructor(message = "URI Too Long", details?: unknown) {
    super(414, message, details);
  }
}

export class UnsupportedMediaTypeError extends HttpError {
  constructor(message = "Unsupported Media Type", details?: unknown) {
    super(415, message, details);
  }
}

export class RangeNotSatisfiableError extends HttpError {
  constructor(message = "Range Not Satisfiable", details?: unknown) {
    super(416, message, details);
  }
}

export class ExpectationFailedError extends HttpError {
  constructor(message = "Expectation Failed", details?: unknown) {
    super(417, message, details);
  }
}

export class ImATeapotError extends HttpError {
  constructor(message = "I'm a teapot", details?: unknown) {
    super(418, message, details);
  }
}

export class MisdirectedRequestError extends HttpError {
  constructor(message = "Misdirected Request", details?: unknown) {
    super(421, message, details);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = "Unprocessable Entity", details?: unknown) {
    super(422, message, details);
  }
}

export class LockedError extends HttpError {
  constructor(message = "Locked", details?: unknown) {
    super(423, message, details);
  }
}

export class FailedDependencyError extends HttpError {
  constructor(message = "Failed Dependency", details?: unknown) {
    super(424, message, details);
  }
}

export class TooEarlyError extends HttpError {
  constructor(message = "Too Early", details?: unknown) {
    super(425, message, details);
  }
}

export class UpgradeRequiredError extends HttpError {
  constructor(message = "Upgrade Required", details?: unknown) {
    super(426, message, details);
  }
}

export class PreconditionRequiredError extends HttpError {
  constructor(message = "Precondition Required", details?: unknown) {
    super(428, message, details);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = "Too Many Requests", details?: unknown) {
    super(429, message, details);
  }
}

export class RequestHeaderFieldsTooLargeError extends HttpError {
  constructor(message = "Request Header Fields Too Large", details?: unknown) {
    super(431, message, details);
  }
}

export class UnavailableForLegalReasonsError extends HttpError {
  constructor(message = "Unavailable For Legal Reasons", details?: unknown) {
    super(451, message, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error", details?: unknown) {
    super(500, message, details);
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = "Not Implemented", details?: unknown) {
    super(501, message, details);
  }
}

export class BadGatewayError extends HttpError {
  constructor(message = "Bad Gateway", details?: unknown) {
    super(502, message, details);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = "Service Unavailable", details?: unknown) {
    super(503, message, details);
  }
}

export class GatewayTimeoutError extends HttpError {
  constructor(message = "Gateway Timeout", details?: unknown) {
    super(504, message, details);
  }
}

export class HTTPVersionNotSupportedError extends HttpError {
  constructor(message = "HTTP Version Not Supported", details?: unknown) {
    super(505, message, details);
  }
}

export class VariantAlsoNegotiatesError extends HttpError {
  constructor(message = "Variant Also Negotiates", details?: unknown) {
    super(506, message, details);
  }
}

export class InsufficientStorageError extends HttpError {
  constructor(message = "Insufficient Storage", details?: unknown) {
    super(507, message, details);
  }
}

export class LoopDetectedError extends HttpError {
  constructor(message = "Loop Detected", details?: unknown) {
    super(508, message, details);
  }
}

export class BandwidthLimitExceededError extends HttpError {
  constructor(message = "Bandwidth Limit Exceeded", details?: unknown) {
    super(509, message, details);
  }
}

export class NotExtendedError extends HttpError {
  constructor(message = "Not Extended", details?: unknown) {
    super(510, message, details);
  }
}

export class NetworkAuthenticationRequiredError extends HttpError {
  constructor(message = "Network Authentication Required", details?: unknown) {
    super(511, message, details);
  }
}
