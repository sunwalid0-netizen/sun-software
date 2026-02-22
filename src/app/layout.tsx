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
  title: "Sun Software | خدمات برمجية احترافية",
  description: "شركة Sun Software تقدم خدمات برمجية عن طريق السريال والتحكم عن بعد. نقدم حلول تقنية متميزة لعملائنا.",
  keywords: ["Sun Software", "خدمات برمجية", "سريال", "تراخيص", "TeamViewer", "تحكم عن بعد", "برمجيات"],
  authors: [{ name: "Sun Software Team" }],
  icons: {
    icon: "/sun-software-logo.png",
  },
  openGraph: {
    title: "Sun Software | خدمات برمجية احترافية",
    description: "شركة Sun Software تقدم خدمات برمجية عن طريق السريال والتحكم عن بعد",
    url: "https://sunsoftware.com",
    siteName: "Sun Software",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sun Software | خدمات برمجية احترافية",
    description: "شركة Sun Software تقدم خدمات برمجية عن طريق السريال والتحكم عن بعد",
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
