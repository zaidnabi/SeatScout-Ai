import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Task 9: Consistent Error Hierarchy and Formatting
 */
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, 403, "FORBIDDEN", details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: unknown) {
    super(message, 409, "CONFLICT", details);
    this.name = "ConflictError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      body: {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
      },
      status: error.statusCode,
    };
  }

  if (error instanceof ZodError) {
    return {
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request payload",
          details: error.flatten(),
        },
      },
      status: 400,
    };
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return {
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    status: 500,
  };
}

export function handleApiError(error: unknown): NextResponse {
  const { body, status } = formatErrorResponse(error);
  return NextResponse.json(body, { status });
}
