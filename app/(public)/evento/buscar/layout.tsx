import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Buscar Evento - SporTickets",
  description: "Encontre o evento perfeito para você!",
};

export default function SearchEventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense>{children}</Suspense>;
}
