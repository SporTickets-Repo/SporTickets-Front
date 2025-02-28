import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SporTickets",
  description: "SporTickets seu site de ingressos para eventos esportivos",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
