"use client";

import { useCreateEventContext } from "@/context/create-event";

import { PlayerCard } from "@/components/pages/checkout/player-card";
import { Button } from "@/components/ui/button";
import { useSendTicketContext } from "@/context/send-ticket";
import { Player, TicketType } from "@/interface/tickets";
import { ArrowUp, Loader2, Plus, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { PlayerForm } from "./player-form";

export function SendTicketTab() {
  const { event } = useCreateEventContext();
  const { selectedTicket, setSelectedTicket, removePlayer } =
    useSendTicketContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [onSelectPlayer, setOnSelectPlayer] = useState<Player | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectTicket = (ticketType: TicketType) => {
    setSelectedTicket({
      id: "1",
      ticketType,
      players: [],
      ticketLot: {} as any,
      coupon: {} as any,
      paymentData: {} as any,
      slug: "",
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    removePlayer(playerId);
  };

  const handleSelectPlayer = (player: Player) => {
    setOnSelectPlayer(player);
  };

  const handleSendTicket = () => {
    console.log("Sending ticket for player:", selectedTicket);
  };

  const isCompleted =
    selectedTicket?.players.length === selectedTicket?.ticketType.teamSize &&
    selectedTicket?.players.every(
      (player) =>
        player.personalizedField?.length ===
        selectedTicket?.ticketType.personalizedFields.length
    ) &&
    selectedTicket?.players.every((player) => {
      if (selectedTicket?.ticketType.categories.length === 0) return true;
      return player.category.id !== "";
    });

  const isDisabled = !isCompleted || isSaving;

  if (!event) return null;

  useEffect(() => {
    if (onSelectPlayer) {
      setModalOpen(true);
    }
  }, [onSelectPlayer]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Enviar Ingressos</h2>
      <div className="space-y-4">
        <p className="text-sm">Escolha o tipo de ingresso:</p>
        <div className="flex gap-4 flex-wrap">
          {event.ticketTypes.map((ticket) => (
            <Button
              key={ticket.id}
              size="sm"
              variant={
                selectedTicket?.ticketType.id === ticket.id
                  ? "orange-inverse"
                  : "default-inverse"
              }
              onClick={() => handleSelectTicket(ticket)}
              className="text-sm px-4 py-2 "
            >
              {ticket.name}
            </Button>
          ))}
        </div>
      </div>

      {selectedTicket ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              Participantes adicionados {selectedTicket.players.length}/
              {selectedTicket.ticketType.teamSize}
            </h3>
            <Button
              variant="linkPurple"
              size="sm"
              className="text-md"
              onClick={() => setModalOpen(true)}
              disabled={
                selectedTicket.players.length ===
                selectedTicket.ticketType.teamSize
              }
            >
              <Plus />
              Novo Jogador
            </Button>
          </div>

          {selectedTicket.players.length > 0 ? (
            <div className="gap-2">
              {selectedTicket.players.map((player, i) => (
                <div key={i} className="flex items-center gap-2">
                  <PlayerCard
                    player={player}
                    onClick={() => handleSelectPlayer(player)}
                    completed={
                      selectedTicket.ticketType.personalizedFields.length ===
                        player.personalizedField?.length &&
                      player.category.id !== ""
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
              ))}
              <div className="w-full flex justify-end mt-5">
                <Button
                  className="[&_svg]:size-5 items-center"
                  type="button"
                  onClick={() => handleSendTicket()}
                  disabled={isDisabled}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Enviar Ingressos
                      <ArrowUp />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-4 items-center mt-8 pb-10 pt-5">
              <div className="max-w-[400px] flex flex-col space-y-4 items-center text-center">
                <FiUserPlus size={48} className="text-zinc-400" />
                <h2 className="text-lg font-bold mt-2">
                  Nenhum Jogador Adicionado
                </h2>
                <p className="text-muted-foreground">
                  Adicione os jogadores que irão participar do evento para
                  completar a inscrição.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setModalOpen(true)}
                >
                  Adicionar Jogador
                  <FiUserPlus size={16} />
                </Button>
              </div>
            </div>
          )}

          <PlayerForm
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setOnSelectPlayer(null);
            }}
            player={onSelectPlayer}
          />
        </>
      ) : (
        <div className="flex flex-col w-full space-y-4 items-center  mt-8 py-10 ">
          <div className="max-w-[400px] flex flex-col space-y-4 items-center text-center">
            <Ticket size={48} className="text-zinc-400" />
            <h2 className="text-lg font-bold mt-2">
              Nenhum ingresso selecionado
            </h2>
            <p className="text-muted-foreground">
              Selecione o tipo de ingresso aqui em cima para adicionar
              jogadores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
