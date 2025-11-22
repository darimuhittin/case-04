"use client";

import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Sol: Form Alanı */}
      <div className="flex flex-row justify-center items-start p-[40px] bg-white">
        <div className="w-full h-full max-w-[440px] flex flex-col justify-center relative">
          <Image
            priority
            src="/images/logo.png"
            alt="Maglo Logo"
            width={100}
            height={30} // Orijinal orana göre yüksekliği ayarladım (Logo genelde yataydır)
            className="mb-[157.5px] object-contain absolute top-0 left-0"
          />

          {children}
        </div>
      </div>

      {/* Sağ: Görsel Alanı */}
      <div className="hidden lg:flex bg-[#F3F4F6] items-center justify-center relative overflow-hidden">
        <Image
          src="/images/hand-clock.png"
          alt="Maglo Welcome"
          fill // Görseli ebeveyn div'e doldurur
          className="object-cover" // Görselin oranını koruyarak doldurmasını sağlar
          priority // Sayfa yüklenir yüklenmez indir (LCP optimizasyonu)
        />
      </div>
    </div>
  );
}
