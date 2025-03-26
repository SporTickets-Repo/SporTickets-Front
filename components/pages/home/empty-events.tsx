"use client";

import { FC } from "react";

interface EmptyEventCardProps {
  title?: string;
  description?: string;
  dark?: boolean;
}

export const EmptyEventCard: FC<EmptyEventCardProps> = ({
  title = "Nenhum evento encontrado",
  description = "Tente novamente mais tarde.",
  dark = false,
}) => {
  return (
    <div
      className={`w-full h-[200px] flex flex-col items-center justify-center text-center rounded-md border ${
        dark
          ? "border-zinc-700 text-zinc-400 bg-zinc-900"
          : "border-zinc-200 text-zinc-500 bg-zinc-100"
      }`}
    >
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};
