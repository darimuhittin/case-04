import { ApiErrorResponse, LoginResponse } from "../../lib/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authApi } from "../../lib/api";
import { toast } from "sonner";
import { useAuthStore } from "../../store/auth-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export const useSignIn = () => {
  const { isAuthenticated, checkAuth, login } = useAuthStore();
  const router = useRouter();

  // 1. GİRİŞ KONTROLÜ: Kullanıcı zaten giriş yapmışsa Dashboard'a yönlendir
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/"); // Geri butonuna basınca tekrar login'e dönmemesi için replace kullanıyoruz
    }
  }, [isAuthenticated, router]);

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    signInMutation.mutate(values);
  }

  const signInMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: LoginResponse) => {
      // Token'ı kaydet ve yönlendir
      if (data.data?.accessToken && data.data?.user) {
        login(data);
        toast.success(data.message);
        router.push("/");
      } else {
        toast.error("Giriş başarısız. Lütfen tekrar deneyin.");
      }
    },
    onError: (error: AxiosError) => {
      const apiResponse = error.response?.data as ApiErrorResponse;

      // Hata yönetimi
      if (apiResponse?.code === "INVALID_CREDENTIALS") {
        form.setError(
          "password",
          {
            type: "server",
            message: apiResponse.message || "E-posta veya şifre hatalı.",
          },
          { shouldFocus: true }
        );
      }
    },
  });
  return { form, signInMutation, onSubmit };
};
