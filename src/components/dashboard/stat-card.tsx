"use client";

import type { ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FinancialMetric } from "@/lib/types";

const formatCurrency = (amount?: number, currency?: string) => {
  if (amount === undefined) return "₺0,00";
  // Normalize currency codes - "$" should be treated as "USD"
  const normalizedCurrency = currency === "$" ? "USD" : currency || "USD";

  if (normalizedCurrency === "TRY") {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizedCurrency,
  }).format(amount);
};

interface StatCardProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  metric?: FinancialMetric;
  isLoading: boolean;
  selected?: boolean;
}

export function StatCard({
  icon: Icon,
  title,
  metric,
  isLoading,
  selected = false,
}: StatCardProps) {
  const bg = selected ? "bg-[#363A3F]" : "bg-[#F8F8F8]";
  const iconBg = selected ? "bg-[#2D2D2D]" : "bg-[#F3F4F6]";
  const textColor = selected ? "text-white" : "text-gray-800";
  const iconColor = selected ? "text-[#C8EE44]" : "text-gray-800";

  if (isLoading) {
    return <Skeleton className="h-26 w-full rounded-3xl" />;
  }
  return (
    <div
      className={`${bg} px-2 py-6 rounded-3xl flex items-center gap-2  transition-all hover:shadow-md h-full`}
    >
      <div
        className={` p-2 rounded-full flex items-center justify-center ${iconBg}`}
      >
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-xs mb-1 font-medium">{title}</p>

        <h4
          className={`text-2xl lg:text-xl xl:text-2xl font-bold ${textColor} truncate`}
        >
          {formatCurrency(metric?.amount, metric?.currency)}
        </h4>
      </div>
    </div>
  );
}
