"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { useEffect, useState } from "react";

import { FieldsStep } from "@/components/pages/checkout/player-form/fields-step";
import { RegisterStep } from "@/components/pages/checkout/player-form/register-step";
import { SearchStep } from "@/components/pages/checkout/player-form/search-step";
import { useSendTicketContext } from "@/context/send-ticket";
import { Player } from "@/interface/tickets";

interface Props {
  open: boolean;
  onClose: () => void;
  player?: Player | null;
}

export function PlayerForm({ open, onClose, player }: Props) {
  console.log("PlayerForm", player);
  const { selectedTicket, updatePlayers } = useSendTicketContext();
  const [step, setStep] = useState<"search" | "register" | "fields">(
    player ? "fields" : "search"
  );
  const [playerData, setPlayerData] = useState<Player | null>(player || null);

  if (!selectedTicket) return null;

  const hasPersonalizedFields =
    selectedTicket.ticketType.personalizedFields.length > 0;
  const hasCategoryFields = selectedTicket.ticketType.categories.length > 0;

  const handleAdd = (newPlayer: Player) => {
    setPlayerData(newPlayer);
    updatePlayers([...selectedTicket.players, newPlayer]);
  };

  const handleUpdate = (updatedPlayer: Player) => {
    updatePlayers(
      selectedTicket.players.map((player) =>
        player.userId === updatedPlayer.userId ? updatedPlayer : player
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
              ? "Adicionar Participante"
              : step === "register"
              ? "Registrar Participante"
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
              initialEmail={playerData?.email}
              currentTicket={selectedTicket}
            />
          </TabsContent>

          {step === "register" && (
            <TabsContent value="register">
              <RegisterStep
                email={playerData?.email || ""}
                onClose={onClose}
                onRegistered={(newPlayer) => {
                  handleAdd(newPlayer);
                  if (hasPersonalizedFields || hasCategoryFields) {
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
                currentTicket={selectedTicket}
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
