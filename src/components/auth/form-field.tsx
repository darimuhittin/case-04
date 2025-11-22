"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ComponentProps } from "react";

interface AuthFormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: ComponentProps<"input">["type"];
  placeholder?: string;
  autoComplete?: string;
  id: string;
  disabled?: boolean;
  errorId?: string;
}

export function AuthFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  id,
  disabled = false,
  errorId,
}: AuthFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        const errorMessageId = errorId || `${id}-error`;

        return (
          <FormItem className="space-y-1.5">
            <FormLabel
              htmlFor={id}
              className="font-bold text-[#1A1A1A] text-sm"
            >
              {label}
            </FormLabel>
            <FormControl>
              <Input
                id={id}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                aria-describedby={hasError ? errorMessageId : undefined}
                aria-invalid={hasError}
                className={`h-12 rounded-xl border-gray-200 bg-white transition-all focus:ring-2 
                  ${
                    hasError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:border-[#C8EE44] focus:ring-[#C8EE44]/20"
                  }`}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage
              id={errorMessageId}
              className="text-red-500 font-medium"
            />
          </FormItem>
        );
      }}
    />
  );
}
