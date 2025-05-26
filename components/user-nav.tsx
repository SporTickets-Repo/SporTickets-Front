"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { LogOut, User, UserIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TranslatedLink from "./translated-link";

export function UserNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Image
              src={user?.profileImageUrl ?? "/assets/icons/default-profile.png"}
              alt="Foto de perfil"
              width={24}
              height={24}
              className="w-12 h-12 rounded-full object-cover"
              unoptimized
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "Não informado"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <TranslatedLink
                  href="/perfil"
                  className="flex items-center cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />
                  Meu Perfil
                </TranslatedLink>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <TranslatedLink href={`/entrar?redirect=${pathname}`}>
          <Button
            variant="secondary"
            className="px-2 sm:px-4 flex items-center"
          >
            <User size={24} />
            <span className="font-extrabold">Entrar</span>
          </Button>
        </TranslatedLink>
      )}
    </nav>
  );
}
