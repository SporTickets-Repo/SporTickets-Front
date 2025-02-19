import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function ForgotPasswordForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-6 md:p-10">
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
          <p className="text-muted-foreground text-center mb-4">Digite seu e-mail para receber um link de recuperação.</p>
          <form className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contato@sportickets.com" required />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Enviar</Button>
          </form>
          <div className="text-center text-sm mt-4">
            <Link href="/login" className="text-blue-600 hover:underline">Voltar para login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}