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
import Link from "next/link";
import { usePathname } from "next/navigation";

export function UserNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Link href="/perfil" className="rounded-full overflow-hidden">
              <Image
                src={
                  user?.profileImageUrl ?? "/assets/icons/default-profile.png"
                }
                alt="Foto de perfil"
                width={48}
                height={48}
                className="w-16 h-16 rounded-full object-cover"
                unoptimized
              />
            </Link>
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
                <Link
                  href="/perfil"
                  className="flex items-center cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />
                  Meu Perfil
                </Link>
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
        <Link href={`/entrar?redirect=${pathname}`}>
          <Button
            variant="secondary"
            className="px-2 sm:px-4 flex items-center"
          >
            <User size={24} />
            <span className="font-extrabold">Entrar</span>
          </Button>
        </Link>
      )}
    </nav>
  );
}
