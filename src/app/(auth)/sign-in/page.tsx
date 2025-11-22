"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSignIn } from "@/hooks/sign-in/useSignIn";
import { AuthFormField } from "@/components/auth/form-field";
import { GoogleButton } from "@/components/auth/google-button";
import Image from "next/image";
export default function SignInPage() {
  const { form, signInMutation, onSubmit } = useSignIn();

  return (
    <main
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      role="main"
    >
      <header className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2 tracking-tight">
          Sign In
        </h1>
        <p className="text-gray-500 text-base">
          Welcome back! Please enter your details
        </p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          aria-label="Sign in form"
          noValidate
        >
          {/* Email */}
          <AuthFormField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            id="signin-email"
            errorId="signin-email-error"
            disabled={signInMutation.isPending}
          />

          {/* Password */}
          <AuthFormField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="•••••••"
            id="signin-password"
            errorId="signin-password-error"
            disabled={signInMutation.isPending}
          />

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-12 font-bold text-[#1A1A1A] text-base mt-4 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C8EE44" }}
            disabled={signInMutation.isPending}
            aria-busy={signInMutation.isPending}
          >
            {signInMutation.isPending ? (
              <>
                <Loader2
                  className="animate-spin mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Google Button */}
          <GoogleButton action="sign in" disabled={signInMutation.isPending} />
        </form>
      </Form>

      <footer className="mt-8 text-center text-sm text-gray-500 font-medium">
        <div className="relative flex flex-col items-center justify-center">
          <div className="flex gap-2">
            Don&apos;t have an account?{" "}
            <div className="flex flex-col items-center justify-center">
              <Link
                href="/sign-up"
                className="text-[#1A1A1A] font-bold decoration-[#C8EE44] decoration-2 "
              >
                Sign up
              </Link>
              <Image
                src="/images/bottom.png"
                alt="Maglo Bottom"
                width={43}
                height={5}
              />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
