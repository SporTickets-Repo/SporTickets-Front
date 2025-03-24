"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/service/auth";
import { Mail } from "lucide-react";
import Image from "next/image";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const storedTimer = Cookies.get("recoverPasswordTimer");
    if (storedTimer) {
      const timeRemaining = Number(storedTimer) - Date.now();
      if (timeRemaining > 0) {
        setTimeLeft(Math.ceil(timeRemaining / 1000));
        setSuccess(true);
      } else {
        Cookies.remove("recoverPasswordTimer");
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0) {
      Cookies.remove("recoverPasswordTimer");
      setTimeLeft(null);
      setSuccess(false);
    }
  }, [timeLeft]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (timeLeft !== null && timeLeft > 0) {
      return;
    }

    setError("");
    setSuccess(false);

    try {
      await authService.forgotPassword(email);

      const countdownTime = Date.now() + 60 * 1000;
      Cookies.set("recoverPasswordTimer", countdownTime.toString(), {
        expires: 1 / 1440,
      });
      setTimeLeft(60);

      setEmail("");
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.data?.message === "User not found") {
        setError("E-mail não encontrado. Verifique o e-mail digitado.");
        return;
      }
      setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
    }
  }

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto flex items-center justify-center">
      <Card className="w-full max-w-6xl overflow-hidden shadow-lg">
        <CardContent className="grid md:grid-cols-2 p-0 lg:h-[36em]">
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-12 lg:px-16">
            <div className="flex flex-col items-center mb-6 space-y-6">
              <img
                src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
                alt="Sportickets Logo"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
              <div className="flex flex-col w-full text-center md:text-left space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold">
                  Recuperação de senha
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Digite seu e-mail para receber um link de recuperação de senha
                </p>
              </div>
            </div>

            {success ? (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-green-600">
                    E-mail enviado com sucesso!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enviamos um link de recuperação de senha para seu e-mail.
                    Por favor, verifique sua caixa de entrada e siga as
                    instruções para redefinir sua senha.
                  </p>
                  {timeLeft !== null && timeLeft > 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Aguarde {timeLeft}s para reenviar.
                    </p>
                  )}
                </div>
                <Link href="/entrar" className="w-full">
                  <Button variant="default-inverse" className="w-full">
                    Voltar para o login
                  </Button>
                </Link>
              </div>
            ) : (
              <form
                className="grid gap-4 w-full max-w-md mx-auto md:mx-0"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div className="text-red-500 text-sm text-center md:text-left">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@sportickets.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Enviar
                </Button>
                <Link href="/entrar" className="w-full">
                  <Button variant="default-inverse" className="w-full">
                    Voltar
                  </Button>
                </Link>
              </form>
            )}
          </div>
          <div className="relative hidden md:block">
            <Image
              src="/assets/pattern/Pattern-1-fundo-Azul.png"
              alt="Login Visual"
              fill
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
