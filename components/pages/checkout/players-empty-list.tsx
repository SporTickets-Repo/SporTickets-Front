import { Button } from "@/components/ui/button";
import { FiUserPlus } from "react-icons/fi";

interface PlayersListProps {
  onAddPlayer: () => void;
}

export function PlayersEmptyList({ onAddPlayer }: PlayersListProps) {
  return (
    <div className="flex flex-col w-full space-y-4 items-center  mt-8 ">
      <div className="max-w-[400px] flex flex-col space-y-4 items-center text-center">
        <FiUserPlus size={48} className="text-zinc-400" />
        <h2 className="text-lg font-bold mt-2">Nenhum Jogador Adicionado</h2>
        <p className="text-muted-foreground">
          Adicione os jogadores que irão participar do evento para completar a
          inscrição.
        </p>
        <Button variant="destructive" className="w-full" onClick={onAddPlayer}>
          Adicionar Jogador
          <FiUserPlus size={16} />
        </Button>
      </div>
    </div>
  );
}
