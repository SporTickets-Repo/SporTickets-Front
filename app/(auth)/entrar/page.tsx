import LoginContent from "@/components/pages/auth/login-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar - SporTickets",
  description:
    "Acesse sua conta SporTickets para comprar ingressos para os melhores eventos esportivos do Brasil.",
};

export default function LoginPage() {
  return <LoginContent />;
}
