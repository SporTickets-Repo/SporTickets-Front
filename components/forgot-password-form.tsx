"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/service/auth";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import TranslatedLink from "./translated-link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Content */}
            <div className="w-full lg:w-3/5 p-8 lg:p-12">
              <div className="flex justify-center lg:justify-start mb-8">
                <img
                  src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
                  alt="Sportickets Logo"
                  className="h-10 w-auto"
                />
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center lg:items-start space-y-8"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>

                  <div className="space-y-4 text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">
                      E-mail enviado com sucesso!
                    </h2>
                    <p className="text-gray-600">
                      Enviamos um link de recuperação de senha para seu e-mail.
                      Por favor, verifique sua caixa de entrada e siga as
                      instruções para redefinir sua senha.
                    </p>
                    {timeLeft !== null && timeLeft > 0 && (
                      <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600">
                        <span className="mr-2 font-medium">Aguarde</span>
                        <span className="font-bold">{timeLeft}s</span>
                        <span className="ml-2 font-medium">para reenviar</span>
                      </div>
                    )}
                  </div>

                  <TranslatedLink href="/entrar" className="w-full max-w-md">
                    <Button
                      variant="outline"
                      className="w-full group border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      Voltar para o login
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </TranslatedLink>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">
                      Recuperação de senha
                    </h1>
                    <p className="text-gray-600">
                      Digite seu e-mail para receber um link de recuperação de
                      senha.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <KeyRound className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Esqueceu sua senha?
                        </h3>
                        <div className="space-y-2 text-gray-600">
                          <p>
                            Não se preocupe! Acontece com todos. Enviaremos um
                            link para você redefinir sua senha e recuperar o
                            acesso à sua conta.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Digite seu e-mail
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="contato@sportickets.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 py-6 border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-xl"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-lg transition-all"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Enviando...
                          </>
                        ) : (
                          <>Enviar link de recuperação</>
                        )}
                      </Button>

                      <TranslatedLink href="/entrar" className="block w-full">
                        <Button
                          variant="outline"
                          className="w-full group border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                        >
                          Voltar
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </TranslatedLink>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block lg:w-2/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8">
                    <KeyRound className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    Recupere sua senha em instantes
                  </h3>
                  <p className="text-center text-white text-opacity-80">
                    Enviamos um link direto para seu e-mail que permitirá que
                    você defina uma nova senha e acesse sua conta.
                  </p>
                  <div className="mt-12 w-full max-w-xs">
                    <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rápido e seguro</h4>
                          <p className="text-sm text-white text-opacity-70">
                            Processo simplificado
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Acesso imediato</h4>
                          <p className="text-sm text-white text-opacity-70">
                            Após redefinir sua senha
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
