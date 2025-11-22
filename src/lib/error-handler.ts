import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiErrorResponse } from "./types";
/**
 * Parses API errors and returns user-friendly messages
 */
export function parseApiError(error: unknown): {
  message: string;
  code?: string;
  details?: Array<{ field: string; message: string }>;
  statusCode?: number;
} {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    const statusCode = error.response?.status;

    // Use the error message from the API if available
    if (response?.message) {
      return {
        message: response.message,
        code: response.code,
        details: response.details,
        statusCode,
      };
    }

    // Default messages based on HTTP status code
    switch (statusCode) {
      case 400:
        return {
          message: "Invalid request. Please check your information.",
          statusCode,
        };
      case 401:
        return {
          message: "Your session has expired. Please sign in again.",
          statusCode,
        };
      case 403:
        return {
          message: "You do not have permission for this operation.",
          statusCode,
        };
      case 404:
        return {
          message: "The requested resource was not found.",
          statusCode,
        };
      case 422:
        return {
          message:
            response?.message || "Validation error. Please check the form.",
          code: response?.code,
          details: response?.details,
          statusCode,
        };
      case 429:
        return {
          message: "Too many requests. Please try again later.",
          statusCode,
        };
      case 500:
        return {
          message: "Server error. Please try again later.",
          statusCode,
        };
      case 503:
        return {
          message: "Service is currently unavailable. Please try again later.",
          statusCode,
        };
      default:
        if (
          error.code === "ECONNABORTED" ||
          error.message?.includes("timeout")
        ) {
          return {
            message: "Request timed out. Please try again.",
            statusCode,
          };
        }
        if (error.code === "ERR_NETWORK" || !error.response) {
          return {
            message:
              "Network connection error. Please check your internet connection.",
            statusCode,
          };
        }
        return {
          message: "An unexpected error occurred. Please try again.",
          statusCode,
        };
    }
  }

  // If not an AxiosError, return a generic error message
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred.",
    };
  }

  return {
    message: "An unexpected error occurred. Please try again.",
  };
}

/**
 * Displays API error using toast notification
 */
export function handleApiError(error: unknown, customMessage?: string) {
  const parsedError = parseApiError(error);

  const message = customMessage || parsedError.message;

  // Special handling for 401 error (logout etc.)
  if (parsedError.statusCode === 401) {
    // Clear token and redirect to login page
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      // Only show toast, redirection can be handled at component level
    }
  }

  toast.error(message, {
    duration: 5000,
  });

  return parsedError;
}

/**
 * Global error handler for React Query
 */
export function handleQueryError(error: unknown) {
  return handleApiError(error);
}
