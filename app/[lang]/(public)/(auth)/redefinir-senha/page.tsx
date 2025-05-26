import { ResetPasswordForm } from "@/components/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir Senha - SporTickets",
  description:
    "Escolha uma nova senha para acessar sua conta no SporTickets e continue comprando seus ingressos favoritos com segurança.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-1 justify-center items-center bg-muted">
      <ResetPasswordForm />
    </div>
  );
}
