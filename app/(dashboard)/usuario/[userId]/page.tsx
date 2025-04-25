"use client";

import { MasterProfile } from "@/components/pages/profile/master-profile";
import { useAuth } from "@/context/auth";
import { UserProfile, UserRole } from "@/interface/user";
import { userService } from "@/service/user";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const NotMasterComponent = () => (
  <section className="container py-4">
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p>Você não tem permissão para acessar essa página.</p>
    </div>
  </section>
);

const InvalidUserComponent = () => (
  <section className="container py-4">
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p>Usuário não encontrado ou inválido.</p>
    </div>
  </section>
);

const LoadingComponent = () => (
  <section className="container py-4">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p>Carregando informações do usuário...</p>
    </div>
  </section>
);

const UserInfoBanner = ({ userProfile }: { userProfile?: UserProfile }) => (
  <div className="absolute bottom-0 top-0 right-0 bg-white/50 p-4 ">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-white">
      <div className="flex flex-col gap-1">
        <p className="text-sm md:text-base">
          Telefone: {userProfile?.phone || "Telefone não informado"}
        </p>
        <p className="text-sm md:text-base">
          Documento: {userProfile?.document || "CPF não informado"}
        </p>
        <p className="text-sm md:text-base">
          Data de nascimento:
          {userProfile?.bornAt
            ? new Date(userProfile.bornAt).toLocaleDateString("pt-BR")
            : " Não informada"}
        </p>
        <p className="text-sm md:text-base">
          CEP: {userProfile?.cep || "CEP não informado"}
        </p>
        <p className="text-sm md:text-base">
          Sexo: {userProfile?.sex || "Sexo não informado"}
        </p>
      </div>
      <div className="flex flex-col gap-1"></div>
    </div>
  </div>
);

export default function UserPage() {
  const { userId } = useParams() as { userId: string };
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidUser, setIsValidUser] = useState(true);

  const isMaster = user?.role === UserRole.MASTER;

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        if (!userId) {
          setIsValidUser(false);
          return;
        }
        const response = await userService.userById(userId);
        setUserProfile(response);
      } catch (error) {
        console.log(error);
        setIsValidUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, [userId]);

  if (!isMaster) {
    return <NotMasterComponent />;
  }

  if (!isValidUser) {
    return <InvalidUserComponent />;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <section className="container py-4">
      {/* Header Image */}
      <div className="relative h-40 md:h-80 w-full rounded-3xl">
        <Image
          src={"/assets/icons/default-banner.png"}
          alt="Cover"
          fill
          className={`rounded-3xl w-full h-full bg-gray-500/30 object-cover`}
          unoptimized
        />

        {/* Profile Image and Edit Button */}
        <div className="absolute -bottom-32 md:-bottom-52 left-1/2 transform -translate-y-1/2 -translate-x-1/2 md:left-48 flex items-end">
          <Image
            src={
              userProfile?.profileImageUrl ||
              "/assets/icons/default-profile.png"
            }
            alt={userProfile?.name || "Profile"}
            width={120}
            height={120}
            className="rounded-full border-4 border-white h-[120px] w-[120px] md:h-[240px] md:w-[240px] object-cover min-w-[120px] min-h-[120px]"
            unoptimized
          />
        </div>

        {/* User Info Banner */}
        <UserInfoBanner userProfile={userProfile} />
      </div>

      {/* Profile Section */}
      <div className="flex flex-1 flex-col gap-4 py-6">
        <div className="flex flex-1 flex-col md:pl-[20rem] pt-10 md:pt-0 items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">
            {userProfile?.name || "Nome de Exibição"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {userProfile?.email || "Email de Exibição"}
          </p>
        </div>
        <MasterProfile userId={userId} />
      </div>
    </section>
  );
}
