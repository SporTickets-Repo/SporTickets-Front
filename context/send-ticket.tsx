"use client";

import { Player, TicketForm } from "@/interface/tickets";
import { createContext, ReactNode, useContext, useState } from "react";

interface SendTicketContextData {
  selectedTicket: TicketForm | null;
  setSelectedTicket: (ticket: TicketForm | null) => void;
  updatePlayers: (players: Player[]) => void;
  removePlayer: (playerId: string) => void;
}

const SendTicketContext = createContext<SendTicketContextData | undefined>(
  undefined
);

export function SendTicketProvider({ children }: { children: ReactNode }) {
  const [selectedTicket, setSelectedTicket] = useState<TicketForm | null>(null);

  const updatePlayers = (players: Player[]) => {
    setSelectedTicket((prev) => (prev ? { ...prev, players } : null));
  };

  const removePlayer = (playerId: string) => {
    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            players: prev.players.filter(
              (player) => player.userId !== playerId
            ),
          }
        : null
    );
  };

  return (
    <SendTicketContext.Provider
      value={{
        selectedTicket,
        setSelectedTicket,
        updatePlayers,
        removePlayer,
      }}
    >
      {children}
    </SendTicketContext.Provider>
  );
}

export function useSendTicketContext() {
  const context = useContext(SendTicketContext);
  if (!context) {
    throw new Error(
      "useSendTicketContext must be used within a SendTicketProvider"
    );
  }
  return context;
}
