import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center bg-transparent absolute top-0 z-50">
      {/* Ícone à esquerda */}
      <Link href="/">
        <Image
          src="/assets/logos/Logo-Horizontal-para-fundo-Roxo.png"
          alt="Logo"
          width={1500}
          height={267}
          className=" cursor-pointer h-8 sm:h-10 w-auto"
        />
      </Link>

      {/* Navegação à direita */}
      <nav className="flex items-center gap-6">
        {/* Botão de Login */}
        <Link href="/entrar">
          <Button className="bg-blue-secondary text-purple-primary px-2 sm:px-4">
            <User size={24} />
            <span className="font-extrabold">Entrar</span>
          </Button>
        </Link>
      </nav>
    </header>
  );
}
