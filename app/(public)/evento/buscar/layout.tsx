import type { Metadata } from "next";
import { Suspense } from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Buscar Evento - SporTickets",
    description: "Encontre o evento perfeito para você!",
    alternates: {
      canonical: `${baseUrl}/evento/buscar`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SearchEventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense>{children}</Suspense>;
}
