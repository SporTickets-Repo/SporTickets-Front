"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvent } from "@/context/event";
import type { Player, TicketForm } from "@/interface/tickets";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { PlayerCard } from "./player-card";

interface PlayersListProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddPlayer: () => void;
  currentTicket: TicketForm;
}

export function PlayersList({
  players,
  onSelectPlayer,
  onAddPlayer,
  currentTicket,
}: PlayersListProps) {
  const { setSelectedTickets } = useEvent();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = searchQuery
    ? players.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;

  const handleRemovePlayer = (playerId: string) => {
    setSelectedTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === currentTicket.id
          ? {
              ...ticket,
              players: ticket.players.filter((p) => p.userId !== playerId),
            }
          : ticket
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Atletas adicionados</h2>
          <p className="text-sm text-muted-foreground">
            Adicionados {players.length}/{currentTicket.ticketType.teamSize}
          </p>
        </div>
        <Button
          variant="linkPurple"
          size="sm"
          className="text-md"
          onClick={onAddPlayer}
          disabled={players.length === currentTicket.ticketType.teamSize}
        >
          <Plus />
          Novo Atleta
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 " />
        <Input
          placeholder="Pesquisar"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <div key={index} className="flex items-center gap-2">
              <PlayerCard
                player={player}
                onClick={() => onSelectPlayer(player)}
                completed={
                  (player.personalizedField?.length ?? 0) ===
                    currentTicket.ticketType.personalizedFields.length &&
                  (currentTicket.ticketType.categories.length === 0 ||
                    !!player.category?.id)
                }
              />

              <Button
                onClick={() => handleRemovePlayer(player.userId)}
                variant={"destructive"}
                className="[&_svg]:size-5 h-[80px] px-4 rounded-md bg-zinc-50 hover:bg-zinc-100 shadow-sm"
              >
                <FaTrash className="text-sporticket-orange" />
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FiUserPlus size={32} className="text-zinc-400 mb-2" />
            <p className="text-muted-foreground">
              Nenhum atleta encontrado. Adicione um novo atleta.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={onAddPlayer}
            >
              Adicionar atleta
              <FiUserPlus size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
