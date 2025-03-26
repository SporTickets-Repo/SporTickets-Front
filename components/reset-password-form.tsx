"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import Image from "next/image";
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
    <div className="container min-h-screen px-4 py-8 mx-auto flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-6xl overflow-hidden shadow-xl rounded-2xl border-0">
        <CardContent className="grid md:grid-cols-2 p-0 lg:min-h-[36em]">
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-12 lg:px-16 bg-white">
            <div className="flex flex-col items-center mb-8 space-y-6">
              <img
                src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
                alt="Sportickets Logo"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
              <div className="flex flex-col w-full text-center md:text-left space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Redefinir senha
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Digite sua nova senha para continuar
                </p>
              </div>
            </div>

            {validating ? (
              <div className="flex flex-col items-center space-y-4 p-8">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Validando seu token de recuperação...
                </p>
              </div>
            ) : (
              <>
                {error && !tokenValid && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <KeyRound className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="text-red-700 font-medium">{error}</p>
                        <p className="text-red-600 text-sm mt-1">
                          Por favor, solicite um novo link de recuperação.
                        </p>
                      </div>
                      <Link href="/esqueceu-senha" className="w-full">
                        <Button variant="default" className="w-full">
                          Solicitar novo link
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold text-green-700">
                        Senha alterada com sucesso!
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Sua senha foi redefinida com sucesso. Agora você pode
                        fazer login com sua nova senha.
                      </p>
                    </div>
                    <Link href="/entrar" className="w-full max-w-md">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors">
                        Ir para o login
                      </Button>
                    </Link>
                  </div>
                )}

                {!error && !success && tokenValid && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="grid gap-5 w-full max-w-md mx-auto md:mx-0"
                    >
                      {error && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-700 text-sm text-center">
                          {error}
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-gray-700">
                              Nova senha
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-11"
                                password
                                {...field}
                              />
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
                            <FormLabel className="text-gray-700">
                              Confirme a nova senha
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-11"
                                password
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col gap-3 pt-2">
                        <Button
                          type="submit"
                          className="w-full h-11 bg-purple-600 hover:bg-purple-700 transition-colors"
                          disabled={loading}
                        >
                          {loading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          {loading ? "Redefinindo senha..." : "Redefinir senha"}
                        </Button>
                        <Link href="/entrar" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full h-11 border-gray-200 hover:bg-gray-50"
                          >
                            Voltar
                          </Button>
                        </Link>
                      </div>
                    </form>
                  </Form>
                )}
              </>
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
