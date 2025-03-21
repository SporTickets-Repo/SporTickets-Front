"use client";
import Image from "next/image";
import { FC } from "react";

interface ProfileEventCardProps {
  title: string;
  image?: string;
  location: string;
  type: string;
}

export const ProfileEventCard: FC<ProfileEventCardProps> = ({
  title,
  image,
  location,
  type,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg relative">
          <Image
            src={image || "/assets/pattern/Pattern-1-fundo-Azul.png"}
            alt="LogoEvento"
            fill
            className="rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-md font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">
            {location} · {type}
          </p>
        </div>
      </div>
    </div>
  );
};
