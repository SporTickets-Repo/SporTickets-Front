import LoginContent from "@/components/pages/auth/login-content";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    title: `${dictionary.metadata.loginTitle} - SporTickets`,
    description: dictionary.metadata.loginDescription,
    alternates: {
      canonical: `${baseUrl}/entrar`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LoginPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);
  return <LoginContent dictionary={dictionary} />;
}
