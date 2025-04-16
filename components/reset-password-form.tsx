"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
} from "lucide-react";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~]).{8,}$/,
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setValidating(true);
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (!token) {
      setError("Token de recuperação inválido ou expirado.");
      setValidating(false);
      return;
    }

    async function checkToken() {
      try {
        const isValid = await authService.checkResetToken(token as string);
        if (!isValid) {
          setError("Token de recuperação inválido ou expirado.");
        } else {
          setTokenValid(true);
        }
      } catch (err) {
        setError("Token de recuperação inválido ou expirado.");
      } finally {
        setValidating(false);
      }
    }

    checkToken();
  }, []);

  async function onSubmit(data: ResetPasswordForm) {
    setError("");
    setLoading(true);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        setLoading(false);
        setError("Token de recuperação inválido ou expirado.");
        return;
      }

      await authService.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err: any) {
      if (err?.response?.data?.message === "Token invalid or expired") {
        setError("Token de recuperação inválido ou expirado.");
      } else {
        setError("Erro ao redefinir senha. Tente novamente.");
      }
    } finally {
      setLoading(false);
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

              <div className="space-y-2 text-center lg:text-left mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                  Redefinir senha
                </h1>
                <p className="text-gray-600">
                  Digite sua nova senha para continuar
                </p>
              </div>

              {validating ? (
                <motion.div
                  initial={{ opacity: 0.8, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center space-y-4 p-8"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                  <p className="text-gray-600">
                    Validando seu token de recuperação...
                  </p>
                </motion.div>
              ) : (
                <>
                  {error && !tokenValid && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 mb-6 border border-red-200"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-red-700 font-medium text-lg">
                            {error}
                          </p>
                          <p className="text-red-600 text-sm">
                            Por favor, solicite um novo link de recuperação.
                          </p>
                        </div>
                        <Link
                          href="/esqueceu-senha"
                          className="w-full max-w-md"
                        >
                          <Button className="w-full py-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium text-lg transition-all">
                            Solicitar novo link
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center space-y-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                          Senha alterada com sucesso!
                        </h2>
                        <p className="text-gray-600">
                          Sua senha foi redefinida com sucesso. Agora você pode
                          fazer login com sua nova senha.
                        </p>
                      </div>
                      <Link href="/entrar" className="w-full max-w-md">
                        <Button className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-lg transition-all">
                          Ir para o login
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}

                  {!error && !success && tokenValid && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-8">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <KeyRound className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              Crie uma senha forte
                            </h3>
                            <div className="space-y-2 text-gray-600">
                              <p>
                                Para sua segurança, sua senha deve conter pelo
                                menos 8 caracteres, incluindo uma letra
                                maiúscula, uma minúscula, um número e um
                                caractere especial.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6 w-full max-w-md mx-auto lg:mx-0"
                        >
                          {error && (
                            <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
                              <AlertCircle className="h-5 w-5 flex-shrink-0" />
                              <p className="text-sm">{error}</p>
                            </div>
                          )}
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Nova senha
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      className="pl-10 py-6 border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-xl"
                                      {...field}
                                    />
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Confirme a nova senha
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      className="pl-10 py-6 border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-xl"
                                      {...field}
                                    />
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <div className="space-y-4 pt-2">
                            <Button
                              type="submit"
                              className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-lg transition-all disabled:opacity-70"
                              disabled={loading}
                            >
                              {loading && (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              )}
                              {loading
                                ? "Redefinindo senha..."
                                : "Redefinir senha"}
                            </Button>
                            <Link href="/entrar" className="block w-full">
                              <Button
                                variant="outline"
                                className="w-full group border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-6 transition-all"
                                type="button"
                              >
                                Voltar
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </>
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
                    Redefina sua senha
                  </h3>
                  <p className="text-center text-white text-opacity-80">
                    Crie uma nova senha segura para proteger sua conta e
                    continuar aproveitando nossos serviços.
                  </p>
                  <div className="mt-12 w-full max-w-xs">
                    <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Segurança garantida</h4>
                          <p className="text-sm text-white text-opacity-70">
                            Conexão criptografada
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
