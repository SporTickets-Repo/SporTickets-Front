"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEvent } from "@/context/event";
import { Player, TicketResponse } from "@/interface/tickets";
import { useEffect, useState } from "react";
import { FieldsStep } from "./fields-step";
import { RegisterStep } from "./register-step";
import { SearchStep } from "./search-step";

interface PlayerFormProps {
  open: boolean;
  onClose: () => void;
  currentTicket: TicketResponse;
  player: Player | null;
}

export function PlayerForm({
  open,
  onClose,
  currentTicket,
  player,
}: PlayerFormProps) {
  const { setSelectedTickets } = useEvent();
  const [step, setStep] = useState<"search" | "register" | "fields">(
    player ? "fields" : "search"
  );
  const [playerData, setPlayerData] = useState<Player | null>(player || null);

  const hasPersonalizedFields =
    currentTicket.ticketType.personalizedFields.length > 0;

  const hasCategoryFields = currentTicket.ticketType.categories.length > 0;

  const handleAdd = (newPlayer: Player) => {
    setPlayerData(newPlayer);
    setSelectedTickets((tickets) =>
      tickets.map((ticket) =>
        ticket.id === currentTicket.id
          ? { ...ticket, players: [...ticket.players, newPlayer] }
          : ticket
      )
    );
  };

  const handleUpdate = (updatedPlayer: Player) => {
    setSelectedTickets((tickets) =>
      tickets.map((ticket) =>
        ticket.id === currentTicket.id
          ? {
              ...ticket,
              players: ticket.players.map((player) =>
                player.userId === updatedPlayer.userId ? updatedPlayer : player
              ),
            }
          : ticket
      )
    );
  };

  useEffect(() => {
    if (!open) {
      setStep(player ? "fields" : "search");
      setPlayerData(player || null);
    }
  }, [open, player]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="items-center mb-4">
          <DialogTitle>
            {step === "search"
              ? "Adicionar Jogador"
              : step === "register"
              ? "Registrar Jogador"
              : "Complete os campos"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} className="space-y-4">
          <TabsContent value="search">
            <SearchStep
              onClose={onClose}
              onFound={(player) => {
                handleAdd(player);
                if (hasPersonalizedFields || hasCategoryFields) {
                  setStep("fields");
                } else {
                  onClose();
                }
              }}
              onNotFound={(email) => {
                setPlayerData((prev) => ({ ...prev, email } as Player));
                setStep("register");
              }}
              initialEmail={player?.email}
              currentTicket={currentTicket}
            />
          </TabsContent>

          {step === "register" && (
            <TabsContent value="register">
              <RegisterStep
                email={playerData?.email ?? ""}
                onClose={onClose}
                onRegistered={(newPlayer) => {
                  handleAdd(newPlayer);
                  if (hasPersonalizedFields) {
                    setStep("fields");
                  } else {
                    onClose();
                  }
                }}
              />
            </TabsContent>
          )}

          {step === "fields" && playerData && (
            <TabsContent value="fields">
              <FieldsStep
                player={playerData}
                currentTicket={currentTicket}
                onClose={onClose}
                onSave={handleUpdate}
              />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
