"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isLoading, _hasHydrated } =
    useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (_hasHydrated && !isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, isLoading, router, _hasHydrated]);

  // Show loading until store has hydrated to prevent hydration mismatch
  if (!_hasHydrated || isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-maglo rounded-xl flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-maglo-black" />
          </div>
          <p className="text-gray-500 text-sm font-medium">
            Yetkilendirme kontrol ediliyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Header />

        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
