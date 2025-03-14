"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  logoImage?: string;
  className?: string;
}

export function Header({
  className,
  logoImage = "/assets/logos/Logo-Horizontal-para-fundo-Roxo.png",
}: HeaderProps) {
  return (
    <header
      className={`flex flex-1 container py-6 justify-between items-center bg-transparent absolute top-0 left-0 right-0 z-50 ${className}`}
    >
      {/* Ícone à esquerda */}
      <Link href="/">
        <Image
          src={logoImage}
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
          <Button variant="secondary" className="px-2 sm:px-4">
            <User size={24} />
            <span className="font-extrabold">Entrar</span>
          </Button>
        </Link>
      </nav>
    </header>
  );
}
