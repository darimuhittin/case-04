import { useCallback } from "react";
import { handleApiError, parseApiError } from "@/lib/error-handler";
import type { AxiosError } from "axios";

/**
 * API hatalarını yönetmek için custom hook
 * Bileşenlerde kolayca kullanılabilir
 */
export function useApiError() {
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    return handleApiError(error, customMessage);
  }, []);

  const parseError = useCallback((error: unknown) => {
    return parseApiError(error);
  }, []);

  return {
    handleError,
    parseError,
  };
}

