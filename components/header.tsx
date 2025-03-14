"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
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
  const { user } = useAuth();

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
        {user ? (
          <Link href="/perfil" className="flex items-center gap-3">
            <Image
              src={user?.profileImageUrl ?? "/assets/icons/default-profile.png"}
              alt="Foto de perfil"
              width={48}
              height={48}
              className="w-16 h-16 rounded-full object-cover text-center text-xs"
              unoptimized
            />
          </Link>
        ) : (
          <Link href="/entrar">
            <Button variant="secondary" className="px-2 sm:px-4">
              <User size={24} />
              <span className="font-extrabold">Entrar</span>
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
