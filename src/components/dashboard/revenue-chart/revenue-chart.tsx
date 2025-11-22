"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { financialApi } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import RevenueChartHeader from "./components/revenue-chart-header";

export function RevenueChart() {
  const [chartHeight, setChartHeight] = useState(260);

  useEffect(() => {
    const updateHeight = () => {
      setChartHeight(window.innerWidth >= 768 ? 320 : 260);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["working-capital"],
    queryFn: financialApi.getWorkingCapital,
  });

  const rawData = apiResponse?.data?.data;
  const chartData = Array.isArray(rawData) ? rawData : [];

  if (isLoading) {
    return (
      <Skeleton className={`w-full rounded-3xl`} style={{ height: `660px` }} />
    );
  }

  if (isError) {
    return (
      <section className="bg-white p-4 md:p-6 rounded-3xl  border border-gray-100 flex items-center justify-center min-h-[350px]">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">
            Grafik yüklenirken bir hata oluştu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Sayfayı yenile
          </button>
        </div>
      </section>
    );
  }

  return (
    // Mobilde p-4, Desktopta p-6 (Daha fazla alan)
    <section
      className="bg-white p-4 md:p-6 rounded-3xl  border border-gray-100 flex flex-col relative"
      aria-labelledby="working-capital-heading"
    >
      <Skeleton
        className={`w-full h-full rounded-3xl top-0 left-0 ${
          isLoading ? "absolute" : "hidden"
        }`}
      />
      {/* Header: Mobilde dikey, Desktopta yatay hizalama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2
            id="working-capital-heading"
            className="text-lg font-bold text-maglo-black"
          >
            Working Capital
          </h2>
        </div>

        {/* Legend & Filter */}
        <RevenueChartHeader />
      </div>

      {/* Chart Area */}
      <div
        className="w-full min-w-0"
        style={{ height: `${chartHeight}px` }}
        role="img"
        aria-label="Working capital chart showing income and expense trends over time"
      >
        <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            aria-label="Working capital area chart"
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0DA06A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0DA06A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C8EE44" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C8EE44" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F1F1"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
              dy={10}
              // İlk ve son etiketin kesilmemesi için padding ekledik
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0px 10px 40px -10px rgba(0,0,0,0.1)",
              }}
              itemStyle={{
                fontSize: "12px",
                fontWeight: "600",
                padding: "2px 0",
              }}
              formatter={(value: number) => [`₺${value.toLocaleString()}`, ""]}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#0DA06A"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
              name="Income"
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#C8EE44"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
              name="Expense"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
