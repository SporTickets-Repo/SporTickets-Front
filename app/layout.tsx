import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth";
import { EventProvider } from "@/context/event";
import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import { GoogleAnalytics } from "@next/third-parties/google";
import { type Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!;

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    keywords: dictionary.metadata.keywords,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br"
    ),
    openGraph: {
      type: "website",
      locale: params.lang === "pt" ? "pt_BR" : "en_US",
      url: "/",
      siteName: "SporTickets",
      title: dictionary.metadata.ogTitle,
      description: dictionary.metadata.description,
      images: [
        {
          url: "/assets/logos/Logo-Reduzida-para-fundo-Branco.png",
          width: 1200,
          height: 630,
          alt: "SporTickets",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.ogTitle,
      description: dictionary.metadata.description,
      images: ["/assets/logos/Logo-Reduzida-para-fundo-Branco.png"],
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
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={params.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
      </head>
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
