"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  Mail,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/service/auth";
import TranslatedLink from "./translated-link";

const existingAccountSchema = z.object({
  email: z
    .string()
    .nonempty("O e‑mail é obrigatório")
    .email("Digite um e‑mail válido, ex: nome@dominio.com"),
});

type ExistingAccountFormData = z.infer<typeof existingAccountSchema>;

export function ExistingAccountForm() {
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email") ?? "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ExistingAccountFormData>({
    resolver: zodResolver(existingAccountSchema),
    defaultValues: { email: emailFromUrl },
  });

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

  const onSubmit = async (data: ExistingAccountFormData) => {
    if (timeLeft !== null && timeLeft > 0) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authService.forgotPassword(data.email);

      const countdownTime = Date.now() + 60 * 1000;
      Cookies.set("recoverPasswordTimer", countdownTime.toString(), {
        expires: 1 / 1440,
      });
      setTimeLeft(60);
      setSuccess(true);
      form.reset({ email: data.email });
    } catch (err: any) {
      if (err?.response?.data?.message === "User not found") {
        setError("E‑mail não encontrado. Verifique o e‑mail digitado.");
        return;
      }
      setError("Erro ao enviar e‑mail de recuperação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Conteúdo */}
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
                      E‑mail enviado com sucesso!
                    </h2>
                    <p className="text-gray-600">
                      Enviamos um link de recuperação para o seu e‑mail.
                      Verifique sua caixa de entrada.
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
                    <p className="text-gray-600">
                      Após fazer login, não esqueça de revisar e atualizar seus
                      dados na página "Meu Perfil".
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
                      Conta já existente
                    </h1>
                    <p className="text-gray-600">
                      Identificamos que você já possui uma conta criada
                      anteriormente.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Info className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Informação importante
                        </h3>
                        <div className="space-y-2 text-gray-600">
                          <p>
                            Sua conta foi criada anteriormente por outro usuário
                            para comprar ingressos. Para acessá-la, você precisa
                            redefinir sua senha.
                          </p>
                          <p>
                            Após fazer login, recomendamos que você revise e
                            atualize seus dados pessoais na página "Meu Perfil".
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  disabled
                                  {...field}
                                  placeholder="contato@sportickets.com"
                                  className="pl-10 py-6 border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-xl"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-lg transition-all"
                        disabled={
                          (timeLeft !== null && timeLeft > 0) || isLoading
                        }
                      >
                        {isLoading ? (
                          <>
                            {"Enviando..."}{" "}
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                          </>
                        ) : (
                          "Enviar e‑mail de recuperação"
                        )}
                      </Button>
                    </form>
                  </Form>

                  <TranslatedLink href="/entrar" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full group border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                    >
                      Voltar
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </TranslatedLink>
                </motion.div>
              )}
            </div>

            {/* Right side - Ilustração */}
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
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    Recupere sua conta em instantes
                  </h3>
                  <p className="text-center text-white text-opacity-80">
                    Enviamos um link direto para seu e‑mail que permitirá que
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
