"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Player } from "@/interface/tickets";
import { Search } from "lucide-react";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { PlayerCard } from "./player-card";

interface PlayersListProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddPlayer: () => void;
  maxPlayers: number;
  numberPersonalizedFields: number;
}

export function PlayersList({
  players,
  onSelectPlayer,
  onAddPlayer,
  maxPlayers,
  numberPersonalizedFields,
}: PlayersListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = searchQuery
    ? players.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Jogadores adicionados</h2>
          <p className="text-sm text-muted-foreground">
            Adicionados {players.length}/{maxPlayers}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-md text-sporticket-purple border-sporticket-purple hover:bg-sporticket-purple-50"
          onClick={onAddPlayer}
          disabled={players.length === maxPlayers}
        >
          Novo Jogador
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <PlayerCard
              key={index}
              player={player}
              onClick={() => onSelectPlayer(player)}
              completed={
                numberPersonalizedFields === player.personalizedField?.length
              }
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FiUserPlus size={32} className="text-zinc-400 mb-2" />
            <p className="text-muted-foreground">
              Nenhum jogador encontrado. Adicione um novo jogador.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={onAddPlayer}
            >
              Adicionar Jogador
              <FiUserPlus size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
