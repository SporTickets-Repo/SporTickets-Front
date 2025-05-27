"use client";
import Image from "next/image";
import LanguageSwitcher from "./language-switcher";
import TranslatedLink from "./translated-link";
import { UserNav } from "./user-nav";

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
      {/* Logo à esquerda */}
      <TranslatedLink href="/">
        <Image
          src={logoImage || "/placeholder.svg"}
          alt="Logo"
          width={1500}
          height={267}
          className="cursor-pointer h-8 sm:h-10 w-auto"
        />
      </TranslatedLink>

      {/* Navegação à direita */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  );
}
