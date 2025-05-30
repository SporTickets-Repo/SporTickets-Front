import type { Metadata } from "next";
import { Rubik } from "next/font/google";

import { ClientProviders } from "@/components/client-providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SporTickets",
  description:
    "Compre ingressos para eventos esportivos de forma segura e fácil. Encontre os melhores eventos esportivos e garanta sua participação.",
  keywords: [
    "ingressos esportivos",
    "eventos esportivos",
    "comprar ingressos",
    "esportes",
    "tickets esportivos",
  ],
  authors: [{ name: "SporTickets" }],
  creator: "SporTickets",
  publisher: "SporTickets",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "SporTickets",
    title: "SporTickets - Seu site de ingressos para eventos esportivos",
    description:
      "Compre ingressos para eventos esportivos de forma segura e fácil. Encontre os melhores eventos esportivos e garanta sua participação.",
    images: [
      {
        url: "/logos/Logo-Reduzida-para-fundo-Branco.png",
        width: 1200,
        height: 630,
        alt: "SporTickets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SporTickets - Seu site de ingressos para eventos esportivos",
    description:
      "Compre ingressos para eventos esportivos de forma segura e fácil. Encontre os melhores eventos esportivos e garanta sua participação.",
    images: ["/logos/Logo-Reduzida-para-fundo-Branco.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SporTickets",
              url:
                process.env.NEXT_PUBLIC_SITE_URL ||
                "https://www.sportickets.com.br",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logos/Logo-Reduzida-para-fundo-Branco.png`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+55-61-996476207",
                contactType: "customer support",
                areaServed: "BR",
                availableLanguage: "Portuguese",
              },
            }),
          }}
        />
      </head>
      <body className={rubik.className}>
        <div className="flex min-h-screen flex-col">
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          <main className="flex-1 flex flex-col min-h-[calc(100vh_-_81px)] overflow-x-hidden">
            <ClientProviders>{children}</ClientProviders>
          </main>
        </div>
      </body>
    </html>
  );
}
