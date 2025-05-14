export class HttpError extends Error {
  constructor(public status: number, public message: string = "Error") {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class PaymentRequiredError extends HttpError {
  constructor(message = "Payment Required") {
    super(402, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

export class MethodNotAllowedError extends HttpError {
  constructor(message = "Method Not Allowed") {
    super(405, message);
  }
}

export class NotAcceptableError extends HttpError {
  constructor(message = "Not Acceptable") {
    super(406, message);
  }
}

export class ProxyAuthenticationRequiredError extends HttpError {
  constructor(message = "Proxy Authentication Required") {
    super(407, message);
  }
}

export class RequestTimeoutError extends HttpError {
  constructor(message = "Request Timeout") {
    super(408, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

export class GoneError extends HttpError {
  constructor(message = "Gone") {
    super(410, message);
  }
}

export class LengthRequiredError extends HttpError {
  constructor(message = "Length Required") {
    super(411, message);
  }
}

export class PreconditionFailedError extends HttpError {
  constructor(message = "Precondition Failed") {
    super(412, message);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = "Payload Too Large") {
    super(413, message);
  }
}

export class URITooLongError extends HttpError {
  constructor(message = "URI Too Long") {
    super(414, message);
  }
}

export class UnsupportedMediaTypeError extends HttpError {
  constructor(message = "Unsupported Media Type") {
    super(415, message);
  }
}

export class RangeNotSatisfiableError extends HttpError {
  constructor(message = "Range Not Satisfiable") {
    super(416, message);
  }
}

export class ExpectationFailedError extends HttpError {
  constructor(message = "Expectation Failed") {
    super(417, message);
  }
}

export class ImATeapotError extends HttpError {
  constructor(message = "I'm a teapot") {
    super(418, message);
  }
}

export class MisdirectedRequestError extends HttpError {
  constructor(message = "Misdirected Request") {
    super(421, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = "Unprocessable Entity") {
    super(422, message);
  }
}

export class LockedError extends HttpError {
  constructor(message = "Locked") {
    super(423, message);
  }
}

export class FailedDependencyError extends HttpError {
  constructor(message = "Failed Dependency") {
    super(424, message);
  }
}

export class TooEarlyError extends HttpError {
  constructor(message = "Too Early") {
    super(425, message);
  }
}

export class UpgradeRequiredError extends HttpError {
  constructor(message = "Upgrade Required") {
    super(426, message);
  }
}

export class PreconditionRequiredError extends HttpError {
  constructor(message = "Precondition Required") {
    super(428, message);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = "Too Many Requests") {
    super(429, message);
  }
}

export class RequestHeaderFieldsTooLargeError extends HttpError {
  constructor(message = "Request Header Fields Too Large") {
    super(431, message);
  }
}

export class UnavailableForLegalReasonsError extends HttpError {
  constructor(message = "Unavailable For Legal Reasons") {
    super(451, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = "Not Implemented") {
    super(501, message);
  }
}

export class BadGatewayError extends HttpError {
  constructor(message = "Bad Gateway") {
    super(502, message);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = "Service Unavailable") {
    super(503, message);
  }
}

export class GatewayTimeoutError extends HttpError {
  constructor(message = "Gateway Timeout") {
    super(504, message);
  }
}

export class HTTPVersionNotSupportedError extends HttpError {
  constructor(message = "HTTP Version Not Supported") {
    super(505, message);
  }
}

export class VariantAlsoNegotiatesError extends HttpError {
  constructor(message = "Variant Also Negotiates") {
    super(506, message);
  }
}

export class InsufficientStorageError extends HttpError {
  constructor(message = "Insufficient Storage") {
    super(507, message);
  }
}

export class LoopDetectedError extends HttpError {
  constructor(message = "Loop Detected") {
    super(508, message);
  }
}

export class BandwidthLimitExceededError extends HttpError {
  constructor(message = "Bandwidth Limit Exceeded") {
    super(509, message);
  }
}

export class NotExtendedError extends HttpError {
  constructor(message = "Not Extended") {
    super(510, message);
  }
}

export class NetworkAuthenticationRequiredError extends HttpError {
  constructor(message = "Network Authentication Required") {
    super(511, message);
  }
}
