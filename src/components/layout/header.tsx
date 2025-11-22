"use client";

import { Bell, Search, ChevronDown, Menu, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useSidebarStore } from "@/store/sidebar-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";

export default function Header() {
  const { open } = useSidebarStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const { data: user } = useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: () => authApi.getProfile().then((res) => res.data),
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout API errors, still logout locally
      console.error("Logout API error:", error);
    } finally {
      logout();
      router.push("/sign-in");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <header
      className="h-20 md:h-24 px-6 md:px-8 flex items-center justify-between bg-white md:backdrop-blur-sm sticky top-0 z-20 transition-all"
      role="banner"
    >
      {/* --- SOL TARAFA --- */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobil Menü Butonu */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-500 -ml-2 hover:bg-gray-100"
          onClick={open}
          aria-label="Toggle navigation menu"
          aria-expanded={false}
          type="button"
        >
          <Menu size={24} aria-hidden="true" />
        </Button>

        {/* Başlık: Mobilde GİZLENDİ (Tasarım gereği) */}
        <h1 className="hidden md:block text-2xl font-bold text-maglo-black">
          Dashboard
        </h1>
      </div>

      {/* --- SAĞ TARAF --- */}
      <div className="flex items-center gap-2 md:gap-8">
        {/* Arama Çubuğu (Sadece Desktop) */}
        <div className="relative hidden md:block w-72">
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"
            aria-hidden="true"
          />
          <Input
            id="search-input"
            type="search"
            placeholder="Search here..."
            className="pl-11 bg-white border-none shadow-sm rounded-2xl h-12 text-sm focus-visible:ring-1 focus-visible:ring-maglo"
            aria-label="Search dashboard"
          />
        </div>

        {/* Mobilde Arama İkonu DA GİZLENDİ (Tasarım gereği) */}

        <div className="flex items-center gap-3 md:gap-4">
          {/* Bildirim İkonu */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-500 hover:text-maglo-black hover:bg-gray-100  relative w-10 h-10"
            aria-label="Notifications"
            type="button"
          >
            <Bell size={22} aria-hidden="true" />
            {/* Bildirim Noktası */}
            <span
              className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
              aria-label="You have new notifications"
            ></span>
          </Button>

          {/* Kullanıcı Profili */}
          <div className="flex items-center gap-3 md:pl-6 md:border-l border-gray-200 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 outline-none bg-white/80 md:bg-[#FAFAFA] rounded-full  px-2 md:px-2 py-2 transition-all"
                  aria-label="User profile menu"
                  type="button"
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={`${user.fullName} profile picture`}
                    />
                    <AvatarFallback
                      className="bg-maglo text-maglo-black font-bold"
                      aria-label={`${user.fullName} initials`}
                    >
                      {user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* İsim ve Rol (Sadece Desktop) */}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-maglo-black leading-tight">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}{" "}
                      Account
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="text-gray-400 hidden md:block"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
