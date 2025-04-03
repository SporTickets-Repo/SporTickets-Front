"use client";

import { EditProfileDialog } from "@/components/pages/profile/edit-profile/edit-profile-dialog";
import { OrganizerProfile } from "@/components/pages/profile/organizer-profile";
import { UserProfile } from "@/components/pages/profile/user-profile";
import { useAuth } from "@/context/auth";
import { UserRole } from "@/interface/user";
import Image from "next/image";
import { useState } from "react";

export default function UserPage() {
  const { user } = useAuth();
  const [profileImageUrl] = useState(
    user?.profileImageUrl || "/assets/icons/default-profile.png"
  );

  const [bannerImageUrl] = useState(
    user?.profileImageUrl || "/assets/icons/default-banner.png"
  );

  const isOrganizer =
    user?.role === UserRole.PARTNER ||
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.MASTER;

  return (
    <section className="container py-4">
      {/* Header Image */}
      <div className="relative h-40 md:h-80 w-full rounded-3xl">
        <Image
          src={bannerImageUrl}
          alt="Cover"
          fill
          className={`rounded-3xl bg-gray-500/30 ${
            !bannerImageUrl ? "object-contain" : "object-cover"
          }`}
          unoptimized
        />

        {/* Profile Image and Edit Button */}
        <div className="absolute -bottom-32 md:-bottom-52 left-1/2 transform -translate-y-1/2 -translate-x-1/2 md:left-48 flex items-end">
          <Image
            src={profileImageUrl}
            alt={user?.name || "Profile"}
            width={120}
            height={120}
            className="rounded-full border-4 border-white h-[120px] w-[120px] md:h-[240px] md:w-[240px] object-cover min-w-[120px] min-h-[120px]"
            unoptimized
          />
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end absolute right-3 top-3 md:right-5 md:top-5">
          <EditProfileDialog />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-1 flex-col gap-4 py-6">
        <div className="flex flex-1 flex-col md:pl-[20rem] pt-10 md:pt-0 items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">
            {user?.name || "Nome de Exibição"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {user?.email || "Email de Exibição"}
          </p>
        </div>

        {isOrganizer && <OrganizerProfile />}

        {user?.role === UserRole.USER && <UserProfile />}
      </div>
    </section>
  );
}
