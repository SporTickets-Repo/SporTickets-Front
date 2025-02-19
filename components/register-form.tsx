import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function RegisterForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-6 md:p-10">
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center">Criar Conta</h1>
          <p className="text-muted-foreground text-center mb-4">Preencha os campos abaixo para se registrar.</p>
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
            Já tem uma conta? <Link href="/login" className="text-blue-600 hover:underline">Entrar</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
