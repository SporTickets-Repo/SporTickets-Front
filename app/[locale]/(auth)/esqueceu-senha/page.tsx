import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Esqueceu a Senha - SporTickets",
  description:
    "Recupere o acesso à sua conta SporTickets com facilidade. Informe seu e-mail para receber as instruções de redefinição de senha.",
};

export default function ForgotPage() {
  return (
    <div className="flex flex-1 justify-center items-center bg-muted">
      <ForgotPasswordForm />
    </div>
  );
}
