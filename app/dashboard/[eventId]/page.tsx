
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const { eventoId } = useParams() as { eventoId: string };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard do Evento {eventoId}</h1>
      <p>Gerencie os detalhes e estatísticas do evento {eventoId} aqui.</p>
    </div>
  );
};


