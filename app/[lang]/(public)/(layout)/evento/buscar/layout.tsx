import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { Suspense } from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    title: `${
      dictionary.metadata.searchTitle || "Buscar Evento"
    } - SporTickets`,
    description:
      dictionary.metadata.searchDescription ||
      "Encontre o evento perfeito para você!",
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
