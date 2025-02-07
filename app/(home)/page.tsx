import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Home() {

  const events = [
    { id: "1", nome: "Evento 1", descricao: "Descrição do Evento 1" },
    { id: "2", nome: "Evento 2", descricao: "Descrição do Evento 2" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Eventos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evento) => (
          <Card key={evento.id} className="p-4">
            <h2 className="text-xl font-semibold">{evento.nome}</h2>
            <p>{evento.descricao}</p>
            <Link href={`/evento/${evento.id}`} className="text-blue-500 hover:underline">
              Ver Detalhes
            </Link>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/criar-evento" className="text-blue-500 hover:underline">
          Criar Evento
        </Link>
      </div>
    </div>
  );
};


