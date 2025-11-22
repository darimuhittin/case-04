"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { financialApi } from "@/lib/api";

import type { ApiResponse, ScheduledTransfersPayload } from "@/lib/types";

const formatCurrency = (amount: number, currency: string) => {
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

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ScheduledTransfers() {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<ApiResponse<ScheduledTransfersPayload>>({
    queryKey: ["scheduled-transfers"],
    queryFn: financialApi.getScheduledTransfers,
  });

  const transfers = response?.data?.transfers ?? [];

  return (
    <section
      className="bg-white p-6 rounded-3xl   h-full"
      aria-labelledby="scheduled-transfers-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          id="scheduled-transfers-heading"
          className="text-lg font-bold text-maglo-black"
        >
          Scheduled Transfers
        </h2>
        <Button
          variant="ghost"
          className="text-[#0DA06A] hover:text-[#0DA06A] hover:bg-green-50 text-sm font-bold px-2"
          aria-label="View all scheduled transfers"
        >
          View All <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : isError ? (
          <div className="text-center py-8" role="alert" aria-live="assertive">
            <p className="text-red-500 font-medium mb-2">
              Planlanmış transferler yüklenirken bir hata oluştu.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Sayfayı yenile
            </button>
          </div>
        ) : transfers.length === 0 ? (
          <div
            className="text-center text-gray-500 py-8"
            role="status"
            aria-live="polite"
          >
            No scheduled transfers found
          </div>
        ) : (
          transfers.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.image} alt={`${item.name} avatar`} />
                  <AvatarFallback
                    className="bg-gray-100 font-bold text-gray-600"
                    aria-label={`${item.name} initials`}
                  >
                    {getInitials(item.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm text-maglo-black">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {formatDateTime(item.date)}
                  </p>
                </div>
              </div>
              <div className="font-bold text-maglo-black text-sm">
                {formatCurrency(item.amount, item.currency)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
