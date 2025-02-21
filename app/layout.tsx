import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
      <body
        className={rubik.className}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </div>

      </body>
    </html>
  );
}
