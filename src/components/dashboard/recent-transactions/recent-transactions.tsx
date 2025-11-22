"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { financialApi } from "@/lib/api";
import type { ApiResponse, RecentTransactionsPayload } from "@/lib/types";
import TransactionRow from "./components/transaction-row";
import TransactionRowSkeleton from "./components/transaction-row-skeleton";
import TransactionRowError from "./components/transaction-row-error";
import TransactionRowEmpty from "./components/transacton-row-empty";

export function RecentTransactions() {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<ApiResponse<RecentTransactionsPayload>>({
    queryKey: ["recent-transactions"],
    queryFn: () => financialApi.getRecentTransactions(5),
  });

  const transactions = response?.data?.transactions ?? [];

  return (
    <section
      className="bg-white p-6 rounded-3xl border border-gray-100 h-full"
      aria-labelledby="recent-transactions-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          id="recent-transactions-heading"
          className="text-lg font-bold text-maglo-black"
        >
          Recent Transaction
        </h2>
        <Button
          variant="ghost"
          className="text-[#0DA06A] hover:text-[#0DA06A] hover:bg-green-50 text-sm font-bold px-2"
          aria-label="View all recent transactions"
        >
          View All <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Recent transactions">
          <caption className="sr-only">
            List of recent financial transactions
          </caption>
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 border-b border-gray-50">
              <th scope="col" className="pb-4 pl-2">
                NAME/BUSINESS
              </th>
              <th scope="col" className="pb-4 text-center">
                TYPE
              </th>
              <th scope="col" className="pb-4 text-center">
                AMOUNT
              </th>
              <th scope="col" className="pb-4 text-center pr-2">
                DATE
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TransactionRowSkeleton key={index} index={index} />
              ))
            ) : isError ? (
              <TransactionRowError />
            ) : transactions.length === 0 ? (
              <TransactionRowEmpty />
            ) : (
              transactions.map((item) => (
                <TransactionRow key={item.id} transaction={item} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
