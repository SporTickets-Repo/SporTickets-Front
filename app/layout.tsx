import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth";
import { EventProvider } from "@/context/event";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <AuthProvider>
          <EventProvider>
            <div className="flex min-h-screen flex-col">
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
