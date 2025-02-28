"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventPage() {
  const { slug } = useParams() as { slug: string };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Detalhes do Evento {slug}</h1>
      <p>Informações detalhadas do evento {slug} serão exibidas aqui.</p>
      <div className="mt-4">
        <Link
          href={`/dashboard/${slug}`}
          className="text-blue-500 hover:underline"
        >
          Acessar Dashboard do Evento
        </Link>
      </div>
    </div>
  );
}
