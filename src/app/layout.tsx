import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "عالم سمسم | نظام الكاشير",
  description: "نظام كاشير متكامل لمحل سوبر ماركت عالم سمسم",
  keywords: ["كاشير", "POS", "سوبر ماركت", "عالم سمسم", "نقاط البيع"],
  authors: [{ name: "عالم سمسم" }],
  icons: {
    icon: "/alam-sesame-logo.png",
  },
  openGraph: {
    title: "عالم سمسم | نظام الكاشير",
    description: "نظام كاشير متكامل لمحل سوبر ماركت عالم سمسم",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
