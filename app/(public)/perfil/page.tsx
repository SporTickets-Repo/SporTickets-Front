"use client";

import { OrganizerProfile } from "@/components/pages/profile/organizer-profile";
import { UserProfile } from "@/components/pages/profile/user-profile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { UserRole } from "@/interface/user";
import Image from "next/image";

export default function UserPage() {
  const { user, logout } = useAuth();

  const isOrganizer =
    user?.role === UserRole.PARTNER ||
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.MASTER;

  return (
    <section className="container py-4">
      {/* Header Image */}
      <div className="relative h-80 w-full rounded-3xl">
        <Image
          src={user?.profileImageUrl || "/assets/icons/default-banner.png"}
          alt="Cover"
          fill
          className={`rounded-3xl bg-gray-500/30 ${
            user?.profileImageUrl ? "object-contain" : "object-cover"
          }`}
          unoptimized
        />

        {/* Profile Image and Edit Button */}
        <div className="absolute -bottom-44 md:-bottom-52 left-1/2 transform -translate-y-1/2 -translate-x-1/2 md:left-48 flex items-end">
          <Image
            src={user?.profileImageUrl || "/assets/icons/default-profile.png"}
            alt={user?.name || "Profile"}
            width={240}
            height={240}
            className="rounded-full border-4 border-white h-[180px] w-[180px] md:h-[240px] md:w-[240px] object-cover min-w-[180px] min-h-[180px]"
            unoptimized
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
      <div className="flex flex-1 flex-col gap-4 py-6">
        <div className="flex flex-1 flex-col md:pl-[20rem] pt-20 md:pt-0 items-center md:items-start">
          <h1 className="text-3xl font-bold">
            {user?.name || "Nome de Exibição"}
          </h1>
          <p className="text-muted-foreground">
            {user?.email || "Email de Exibição"}
          </p>
        </div>

        {isOrganizer && <OrganizerProfile />}

        {user?.role === UserRole.USER && <UserProfile />}
      </div>
    </section>
  );
}
