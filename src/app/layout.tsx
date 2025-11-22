import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "@/providers/query-provider";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maglo Dashboard",
  description: "Financial Tracking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* FIX: suppressHydrationWarning={true}
        Bu özellik, tarayıcı eklentilerinin (ColorZilla vb.) body etiketine 
        eklediği ekstra attribute'lar yüzünden oluşan hidrasyon hatalarını görmezden gelir.
      */}
      <body
        className={`${kumbhSans.variable} font-sans antialiased bg-[#FAFBFC]`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
