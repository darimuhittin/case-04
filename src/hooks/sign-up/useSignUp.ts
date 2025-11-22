import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authApi } from "../../lib/api";
import { useAuthStore } from "../../store/auth-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { handleApiError, parseApiError } from "../../lib/error-handler";
import { toast } from "sonner";

export const useSignUp = () => {
  const formSchema = z.object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
  });

  const router = useRouter();

  // 1. GİRİŞ KONTROLÜ
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const signUpMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.");
      router.push("/sign-in");
    },
    onError: (error: AxiosError) => {
      const parsedError = parseApiError(error);

      // Validation hatalarını form alanlarına ekle
      if (
        parsedError.code === "VALIDATION_FAILED" &&
        Array.isArray(parsedError.details)
      ) {
        type FormField = keyof z.infer<typeof formSchema>;
        const validFields: FormField[] = ["fullName", "email", "password"];

        parsedError.details.forEach((detail) => {
          if (validFields.includes(detail.field as FormField)) {
            form.setError(
              detail.field as FormField,
              {
                type: "server",
                message: detail.message,
              },
              { shouldFocus: true }
            );
          }
        });
        toast.warning("Lütfen formdaki işaretli hataları düzeltin.");
      } else {
        // Diğer hatalar için merkezi error handler kullan
        handleApiError(
          error,
          "Kayıt işlemi başarısız. Lütfen bilgileri kontrol edin."
        );
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    signUpMutation.mutate(values);
  }

  return { form, signUpMutation, onSubmit };
};
