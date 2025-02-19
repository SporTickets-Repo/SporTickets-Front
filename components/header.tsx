import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full border-b px-6 py-4 flex justify-between items-center bg-background">
      {/* Ícone à esquerda */}
      <Link href="/">
        <Image
          src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
          alt="Logo"
          width={200}
          height={40}
          className=" cursor-pointer"
        />
      </Link>

      {/* Navegação à direita */}
      <nav className="flex items-center gap-6">
        <Link href="/eventos" className="hover:underline text-sm sm:text-base">
          Eventos
        </Link>
        <Link href="/sobre" className="hover:underline text-sm sm:text-base">
          Sobre
        </Link>

        {/* Botão de Login */}
        <Button asChild>
          <Link href="/entrar">Login</Link>
        </Button>
      </nav>
    </header>
  );
}
