"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  FileText,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSidebarStore } from "@/store/sidebar-store";
import { useAuthStore } from "@/store/auth-store";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ArrowRightLeft, label: "Transactions", href: "/transactions" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Wallet, label: "My Wallets", href: "/wallets" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const bottomItems = [{ icon: HelpCircle, label: "Help", href: "/help" }];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebarStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  return (
    <>
      {/* --- MOBİL OVERLAY (Siyah Arka Plan) --- */}
      {/* Sidebar açıksa görünür, tıklanınca kapanır */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={close}
      />

      {/* --- SIDEBAR --- */}
      {/* Responsive Düzeltme:
          1. max-w-[85vw]: Mobilde ekranın tamamını kaplamaması ve taşmaması için genişlik sınırı.
          2. overflow-hidden: İçerik taşmasını önlemek için.
      */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 max-w-[85vw] bg-[#FAFAFA]  transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto overflow-x-hidden">
          {/* LOGO & CLOSE BUTTON */}
          <div className="flex items-center justify-between mb-10 shrink-0">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={122}
                height={30}
                className="object-contain h-8 w-auto"
                loading="eager"
              />
            </div>

            {/* Sadece mobilde görünen kapatma butonu */}
            <button
              onClick={close}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close navigation menu"
              type="button"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          {/* MENU ITEMS */}
          <nav className="flex-1 space-y-2" aria-label="Main navigation">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close} // Mobilde tıklanınca menüyü kapat
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-[#C8EE44] text-maglo-black font-bold shadow-sm"
                        : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-medium"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={
                        isActive
                          ? "text-black"
                          : "text-gray-400 group-hover:text-gray-600"
                      }
                      aria-hidden="true"
                    />
                    <span className="text-[14px] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM SECTION */}
          <div className="pt-6 border-t border-gray-50 space-y-2 shrink-0">
            {bottomItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-medium transition-all">
                  <item.icon size={22} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 font-medium transition-all"
              aria-label="Log out"
              type="button"
            >
              <LogOut size={22} aria-hidden="true" />
              <span className="whitespace-nowrap">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
