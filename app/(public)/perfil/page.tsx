"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Camera, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {
  const { user, logout } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/entrar");
    }
  }, [router, user]);

  return (
    <section className="container py-4">
      {/* Header Image */}
      <div className="relative h-80 w-full rounded-3xl">
        <Image
          src={user?.profileImageUrl || "/assets/icons/default-profile.png"}
          alt="Cover"
          fill
          className="object-cover rounded-3xl"
        />

        {/* Profile Image and Edit Button */}
        <div className="absolute -bottom-24 left-16 flex items-end">
          <Image
            src={user?.profileImageUrl || "/assets/icons/default-profile.png"}
            alt={user?.name || "Profile"}
            width={240}
            height={240}
            className="rounded-full border-4 border-white"
          />
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end absolute right-5 top-5">
          <Button variant="default-inverse" className="gap-2">
            Editar Perfil
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="">
        {/* User Info */}
        <div className="pt-16">
          <h1 className="text-2xl font-bold">
            {user?.name || "NeymarFanatic99"}
          </h1>
          <p className="text-muted-foreground">
            @{user?.fantasyName || "neymar.lover"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {user?.siteUrl ||
              "Apaixonado por esportes e sempre em busca de novos desafios!"}
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-bold">17</p>
                <p className="text-sm text-muted-foreground">Jogos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-bold">#13.563</p>
                <p className="text-sm text-muted-foreground">Posição</p>
              </div>
            </div>
            <div>
              <p className="font-bold">79%</p>
              <p className="text-sm text-muted-foreground">Vitórias</p>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold">Complete seu perfil</h2>
            <p className="text-sm text-muted-foreground">2/3 completo</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-6 text-center space-y-2">
                <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="font-medium">Foto de Perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Adicionar uma foto para personalizar seu perfil
                </p>
              </div>
              <div className="border rounded-lg p-6 text-center space-y-2">
                <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="font-medium">Nome de Exibição</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha um nome para ser mostrado no perfil
                </p>
              </div>
              <div className="border rounded-lg p-6 text-center space-y-2">
                <Trophy className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="font-medium">Crie uma Bio</h3>
                <p className="text-sm text-muted-foreground">
                  Escreva uma descrição sobre você e seus esportes favoritos
                </p>
              </div>
            </div>
          </div>

          <Button variant="destructive" className="mt-8" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </section>
  );
}
