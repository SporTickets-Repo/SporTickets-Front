"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Player } from "@/interface/tickets";
import { Search } from "lucide-react";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";

interface PlayersListProps {
  players: Player[];
  selectedPlayers: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddPlayer: () => void;
}

export function PlayersList({
  players,
  selectedPlayers,
  onSelectPlayer,
  onAddPlayer,
}: PlayersListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = searchQuery
    ? players.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;

  const isPlayerSelected = (player: Player) => {
    return selectedPlayers.some((p) => p.Userid === player.Userid);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Jogadores Salvos</h2>
          <p className="text-sm text-muted-foreground">
            Selecionado {selectedPlayers.length}/{players.length}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-sporticket-purple border-sporticket-purple hover:bg-sporticket-purple-50"
          onClick={onAddPlayer}
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
          filteredPlayers.map((player) => (
            <div
              key={player.Userid}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                isPlayerSelected(player)
                  ? "bg-sporticket-purple-50"
                  : "bg-white"
              }`}
              onClick={() => onSelectPlayer(player)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl || "/placeholder.svg"}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                      {player.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{player.name}</p>
                  {player.personalizedFields?.length > 0 && (
                    <p className="text-xs text-yellow-600">
                      Completar informações {player.personalizedFields.length}/
                      {player.personalizedFields.length}
                    </p>
                  )}
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border ${
                  isPlayerSelected(player)
                    ? "bg-sporticket-purple border-sporticket-purple"
                    : "border-gray-300"
                } flex items-center justify-center`}
              >
                {isPlayerSelected(player) && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
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
