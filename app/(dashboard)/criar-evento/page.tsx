"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateEvent from "./useCreateEvent";

export default function CreateEventPage() {
  const { nome, setNome, handleSubmit } = useCreateEvent();

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold mb-4">Criar Evento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium">
            Nome do Evento
          </label>
          <Input
            id="nome"
            type="text"
            placeholder="Digite o nome do evento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium">
            Descrição
          </label>
        </div>
        <Button type="submit">Criar Evento</Button>
      </form>
    </div>
  );
}
