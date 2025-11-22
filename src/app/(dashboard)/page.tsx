"use client";

import { useQuery } from "@tanstack/react-query";
import { financialApi } from "@/lib/api";
import { RevenueChart } from "@/components/dashboard/revenue-chart/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions/recent-transactions";
import { ScheduledTransfers } from "@/components/dashboard/scheduled-transfers";
import { WalletSection } from "@/components/dashboard/wallet-section";
import { StatCard } from "@/components/dashboard/stat-card";
import { Wallet, PiggyBank } from "lucide-react";
import type {
  ApiResponse,
  FinancialSummary,
  WalletResponse,
} from "@/lib/types";

export default function DashboardPage() {
  const {
    data: summaryResponse,
    isLoading: loadingSummary,
    isFetching: isFetchingSummary,
  } = useQuery<ApiResponse<FinancialSummary>>({
    queryKey: ["financial-summary"],
    queryFn: financialApi.getSummary,
  });

  const summary = summaryResponse?.data;

  const { data: walletsResponse, isLoading: loadingWallet } =
    useQuery<WalletResponse>({
      queryKey: ["financial-wallet"],
      queryFn: financialApi.getWallet,
    });

  const walletCards = walletsResponse?.data?.cards ?? [];

  return (
    <main
      className="space-y-6 animate-in fade-in duration-500 pb-10 "
      role="main"
    >
      {/* --- ROW 1: KPI CARDS --- */}
      {/* Tablette (md) 2 sütun, Laptopta (lg) 3 sütun */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Total Balance - Dark Theme */}
        <section
          className="flex flex-col gap-6 xl:col-span-2"
          aria-label="Financial overview"
        >
          {/* cards */}
          <div
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            role="group"
            aria-label="Financial metrics"
          >
            <StatCard
              icon={Wallet}
              title="Total balance"
              metric={summary?.totalBalance}
              isLoading={loadingSummary || isFetchingSummary}
              selected
            />
            <StatCard
              icon={Wallet}
              title="Total spending"
              metric={summary?.totalExpense}
              isLoading={loadingSummary || isFetchingSummary}
            />
            <StatCard
              icon={PiggyBank}
              title="Total saved"
              metric={summary?.totalSavings}
              isLoading={loadingSummary || isFetchingSummary}
            />
          </div>

          <RevenueChart />
          <RecentTransactions />
        </section>

        <aside
          className="flex flex-col gap-6 md:flex-row xl:flex-col xl:col-span-1"
          aria-label="Wallet and transfers"
        >
          <WalletSection loading={loadingWallet} cards={walletCards} />
          <div className="w-full">
            <ScheduledTransfers />
          </div>
        </aside>
      </div>
    </main>
  );
}
