import LoginContent from "@/components/pages/auth/login-content";
import { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Entrar - SporTickets",
    description:
      "Acesse sua conta SporTickets para comprar ingressos para os melhores eventos esportivos do Brasil.",
    alternates: {
      canonical: `${baseUrl}/entrar`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LoginPage() {
  return <LoginContent />;
}
