"use client";

import { MoreHorizontal, Wifi } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { WalletCard } from "@/lib/types";

interface WalletSectionProps {
  loading: boolean;
  cards: WalletCard[];
}

const ChipIcon = () => (
  <div className="w-8 h-6 lg:w-7 lg:h-5 xl:w-10 xl:h-8 relative grayscale opacity-80 shrink-0">
    <Image
      src="/images/card-chip.png"
      alt="Chip"
      fill
      sizes="(max-width: 640px) 2rem, (max-width: 1024px) 1.75rem, 2.5rem"
      className="object-contain"
    />
  </div>
);

const MastercardLogo = () => (
  <div className="w-12 h-12 lg:w-14 lg:h-14 relative shrink-0">
    <Image
      src="/images/master.png"
      alt="Mastercard"
      fill
      sizes="(max-width: 640px) 3rem, (max-width: 1024px) 3.5rem, 3.5rem"
      className="object-contain opacity-80"
    />
  </div>
);

const VisaLogoBlue = () => (
  <div className="w-10 h-6 lg:w-8 lg:h-5 xl:w-12 xl:h-8 relative shrink-0">
    <Image
      src="/images/visa.png"
      alt="Visa"
      fill
      sizes="(max-width: 640px) 2.5rem, (max-width: 1024px) 2rem, 3rem"
      className="object-contain"
    />
  </div>
);

const formatExpiry = (month?: number, year?: number, fallback = "12/27") => {
  if (!month || !year) return fallback;
  return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
};

export function WalletSection({ loading, cards }: WalletSectionProps) {
  if (loading) {
    return (
      <div className="h-full flex flex-col min-h-[350px]">
        <div className="flex justify-between items-center mb-6 px-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="w-full flex-1 rounded-3xl" />
      </div>
    );
  }

  console.log(cards);

  const mainCard = cards?.find((card) => card.isDefault) ?? cards?.[0];
  const secondaryCard =
    cards?.filter((card) => card.id !== mainCard?.id)[0] ?? cards?.[0];

  const renderNetworkLogo = (network?: string) => {
    if (network?.toLowerCase() === "visa") {
      return <VisaLogoBlue />;
    }
    return <MastercardLogo />;
  };

  return (
    <section className="flex flex-col" aria-labelledby="wallet-heading">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 id="wallet-heading" className="text-lg font-bold text-maglo-black">
          Wallet
        </h2>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Wallet options"
          type="button"
        >
          <MoreHorizontal size={24} aria-hidden="true" />
        </button>
      </div>

      {/* --- STACK CONTAINER ---
       */}
      <div className="relative w-full" role="group" aria-label="Wallet cards">
        {/* --- BACK CARD (Black) --- */}
        <div
          className="w-full aspect-[1.618] bg-[linear-gradient(90deg,#4A4A49,#20201F)] rounded-3xl p-6 md:p-8 lg:p-5 xl:p-6 2xl:p-8 text-white z-10 shadow-xl flex flex-col justify-between  group transition-all hover:translate-y-[-5px]"
          role="img"
          aria-label={`Primary card ending in ${
            mainCard?.cardNumber?.slice(-4) || "unknown"
          }`}
        >
          {/* Arkaplan Efekti */}

          {/* Header */}
          <div className="flex justify-between items-center z-20">
            <div className="flex flex-row items-center gap-1 sm:gap-2">
              <span className="font-bold text-xl lg:text-lg xl:text-2xl 2xl:text-4xl  mr-1">
                {mainCard?.bank}
              </span>
            </div>
          </div>

          {/* Chip & Wifi */}
          <div className="flex justify-between items-center mt-2 z-20">
            <div
              className="scale-100 origin-left lg:scale-90 xl:scale-100 2xl:scale-200"
              aria-hidden="true"
            >
              <ChipIcon />
            </div>
            <Wifi
              className="text-gray-600 rotate-90 w-6 h-6 lg:w-5 lg:h-5 xl:w-8 xl:h-8 2xl:w-20 2xl:h-20"
              aria-hidden="true"
            />
          </div>

          {/* Card Number: Laptopta fontu küçültüyoruz (truncate olmaması için) */}
          <div
            className="font-mono text-xl md:text-2xl lg:text-base xl:text-2xl 2xl:text-4xl tracking-widest text-white z-20 mt-2 shadow-black drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis"
            aria-label={`Card number ending in ${(
              mainCard?.cardNumber || "5495 7381 3759 2321"
            ).slice(-4)}`}
          >
            <span aria-hidden="true">
              {mainCard?.cardNumber || "5495 7381 3759 2321"}
            </span>
          </div>
          <div className="flex justify-between 2xl:mb-10">
            <div className="text-sm lg:text-[10px] xl:text-sm text-gray-500 font-bold mt-1 2xl:text-2xl">
              {formatExpiry(
                secondaryCard?.expiryMonth,
                secondaryCard?.expiryYear,
                "09/25"
              )}
            </div>
            <div className="opacity-90 scale-90 origin-top-right lg:scale-75 xl:scale-100 2xl:scale-200">
              {renderNetworkLogo(mainCard?.network)}
            </div>
          </div>
        </div>

        {/* --- FRONT CARD (Glass Effect) --- */}
        <div className="z-20 px-2 transform -translate-y-1/3 -mb-14 2xl:-mb-32">
          <div
            className="w-full aspect-[1.618] bg-white/30 backdrop-blur-xs rounded-3xl border-t border-white/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] p-5 md:p-6 lg:p-4 xl:p-5 2xl:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:translate-y-[-5px]"
            role="img"
            aria-label={`Secondary card ending in ${
              (secondaryCard?.cardNumber || "8595 2548 ****")
                .replace(/\*/g, "")
                .slice(-4) || "unknown"
            }`}
          >
            {/* Parlama */}
            <div className="absolute top-0 left-0 w-full from-transparent via-white to-transparent opacity-60"></div>

            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg lg:text-sm xl:text-lg 2xl:text-4xl text-white">
                  {secondaryCard?.bank}
                </span>
              </div>
            </div>

            {/* Middle Row */}
            <div className="flex justify-between items-center mt-2 z-20">
              <div
                className="scale-100 origin-left lg:scale-90 xl:scale-100 2xl:scale-200"
                aria-hidden="true"
              >
                <ChipIcon />
              </div>
              <Wifi
                className="text-gray-600 rotate-90 w-6 h-6 lg:w-5 lg:h-5 xl:w-8 xl:h-8 2xl:w-20 2xl:h-20"
                aria-hidden="true"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div>
                <div
                  className="font-mono text-lg lg:text-sm xl:text-xl 2xl:text-4xl font-bold text-[#1A1A1A] tracking-wider"
                  aria-label={`Card number ending in ${
                    (secondaryCard?.cardNumber || "8595 2548 ****")
                      .replace(/\*/g, "")
                      .slice(-4) || "unknown"
                  }`}
                >
                  <span aria-hidden="true">
                    {secondaryCard?.cardNumber || "8595 2548 ****"}
                  </span>
                </div>
                <div className="text-sm lg:text-[10px] xl:text-sm text-gray-500 font-bold mt-1 2xl:text-2xl">
                  {formatExpiry(
                    secondaryCard?.expiryMonth,
                    secondaryCard?.expiryYear,
                    "09/25"
                  )}
                </div>
              </div>
              <div className="scale-90 origin-bottom-right lg:scale-75 xl:scale-100 2xl:scale-200">
                {renderNetworkLogo(secondaryCard?.network)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
