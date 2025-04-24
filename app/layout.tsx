import type { Metadata } from "next";
import { Rubik } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth";
import { EventProvider } from "@/context/event";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SporTickets",
  description: "SporTickets seu site de ingressos para eventos esportivos",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <AuthProvider>
          <EventProvider>
            <div className="flex min-h-screen flex-col">
              <GoogleAnalytics gaId={GA_ID} />
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
