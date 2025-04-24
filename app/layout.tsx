import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth";
import { EventProvider } from "@/context/event";
import Analytics from "@/components/analytics";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SporTickets",
  description: "SporTickets seu site de ingressos para eventos esportivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={rubik.className}>
        <AuthProvider>
          <EventProvider>
            <div className="flex min-h-screen flex-col">
              <Analytics />
              <main className="flex-1 flex flex-col min-h-[calc(100vh_-_81px)] overflow-x-hidden">
                {children}
              </main>
              <Toaster />
            </div>
          </EventProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
