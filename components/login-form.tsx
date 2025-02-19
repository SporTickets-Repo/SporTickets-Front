import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  return (
    <div className="flex flex-col justify-center align-center bg-muted p-6 md:p-10">
      <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
        <CardContent className="grid md:grid-cols-2 p-0">
          {/* Left side - Form */}
          <form className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-6">
              <img src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png" alt="Sportickets Logo" className="h-12 mb-10" />
              <div className="flex flex-col w-full align-start ">

                <h1 className="text-2xl font-bold">Digite seu e-mail</h1>
                <p className="text-muted-foreground text-base">A sporTickets agradece a preferência</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contato@sportickets.com" required />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Esqueci minha senha</Link>
              <Button type="submit" className="w-full bg-purple-800 hover:bg-purple-900">Continuar</Button>
            </div>

            <div className="text-center text-sm mt-4">
              Não tem conta? <Link href="/register" className="text-blue-600 hover:underline">Registre-se</Link>
            </div>
          </form>

          {/* Right side              src="/assets/pattern/Pattern-1-fundo-Azul.png" - Image */}
          <div className="relative hidden md:block">
            <img src="/assets/pattern/Pattern-1-fundo-Azul.png" alt="Login Visual" className="w-full h-full object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}