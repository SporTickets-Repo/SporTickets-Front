"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function EventPage() {

  const { id } = useParams() as { id: string };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Detalhes do Evento {id}</h1>
      <p>Informações detalhadas do evento {id} serão exibidas aqui.</p>
      <div className="mt-4">
        <Link href={`/dashboard/${id}`} className="text-blue-500 hover:underline">
          Acessar Dashboard do Evento
        </Link>
      </div>
    </div>
  );
};


