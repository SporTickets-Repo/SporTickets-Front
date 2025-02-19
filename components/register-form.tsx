import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function RegisterForm() {
  return (
    <div className="flex flex-col justify-center align-center bg-muted p-6 md:p-10">
      <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
        <CardContent className="grid md:grid-cols-2 p-0">
          <div>
            <div className="flex flex-col items-center mb-6">
              <img src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png" alt="Sportickets Logo" className="h-12 mb-10" />
              <div className="flex flex-col w-full align-start ">
                <h1 className="text-2xl font-bold">Digite seu e-mail</h1>
                <p className="text-muted-foreground text-base">A sporTickets agradece a preferência</p>
              </div>
            </div>
            <form className="grid gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" type="text" placeholder="Seu nome" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contato@sportickets.com" required />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Registrar</Button>
            </form>
            <div className="text-center text-sm mt-4">
              Já tem uma conta? <Link href="/entrar" className="text-blue-600 hover:underline">Entrar</Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <img src="/assets/pattern/Pattern-1-fundo-Azul.png" alt="Login Visual" className="w-full h-full object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
