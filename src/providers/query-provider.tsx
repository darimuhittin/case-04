"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { parseApiError } from "@/lib/error-handler"; // Hata ayıklayıcıyı import ettik

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 1. Global Query Hata Yönetimi
        queryCache: new QueryCache({
          onError: (error) => {
            // Axios hatasını parse et ve kullanıcı dostu mesajı göster
            const parsed = parseApiError(error);
            toast.error(parsed.message);
          },
        }),

        // 2. Global Mutation Hata Yönetimi
        mutationCache: new MutationCache({
          onError: (error) => {
            const parsed = parseApiError(error);
            toast.error(parsed.message);
          },
          // Opsiyonel: Her başarılı işlemde mesaj göstermek istemeyebilirsiniz.
          // Eğer API her işlemde { message: "Success" } dönüyorsa açabilirsiniz.
        }),

        defaultOptions: {
          queries: {
            // Akıllı Retry Mantığı
            retry: (failureCount, error) => {
              // 401 (Yetkisiz), 403 (Yasaklı) veya 404 (Bulunamadı) hatalarında tekrar deneme
              if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status && [401, 403, 404].includes(status)) {
                  return false;
                }
              }
              // Diğer hatalarda (500 vs) en fazla 2 kez dene
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 dakika
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
