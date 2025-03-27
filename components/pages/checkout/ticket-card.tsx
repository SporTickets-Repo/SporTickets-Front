"use client";

import { TicketResponse } from "@/interface/tickets";
import { formatMoneyBR } from "@/utils/formatMoney";
import { FaRegCircle } from "react-icons/fa6";
import { HiTicket } from "react-icons/hi2";
import { IoIosCheckmarkCircle } from "react-icons/io";

interface TicketCardProps {
  ticket: TicketResponse;
  isSelected: boolean;
  onSelect: (ticket: TicketResponse) => void;
}

export function TicketCard({ ticket, isSelected, onSelect }: TicketCardProps) {
  const handleSelectTicket = () => {
    onSelect(ticket);
  };

  const maxPlayers = ticket.ticketType.teamSize;

  const completedTicket = () => {
    if (
      ticket.players.length === maxPlayers &&
      ticket.players.every(
        (player) =>
          player.personalizedField?.length ===
          ticket.ticketType.personalizedFields?.length
      ) &&
      ticket.players.every((player) => player.category.id !== "")
    ) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`p-4 mb-4 cursor-pointer rounded-xl shadow-md ${
        isSelected ? "bg-sporticket-purple-50" : ""
      }`}
      onClick={handleSelectTicket}
    >
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-5">
          <HiTicket className="h-8 w-8 text-zinc-500" />
          <div>
            <h3 className="">{ticket.ticketType.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {ticket.ticketType.description}
            </p>
            <div className="space-y-2">
              {Array.from({ length: maxPlayers }, (_, index) => {
                const player = ticket?.players[index];
                return (
                  <div key={index} className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      {index + 1}. {player ? player.name : "A definir"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-right flex items-center gap-4">
          <p className="font-semibold">
            {formatMoneyBR(ticket.ticketLot.price)}
          </p>

          {completedTicket() ? (
            <IoIosCheckmarkCircle
              className={`h-6 w-6 ${
                !isSelected
                  ? "text-sporticket-green-500"
                  : "text-sporticket-purple"
              }`}
            />
          ) : (
            <FaRegCircle
              className={`h-6 w-6 ${
                !isSelected ? "text-yellow-600" : "text-sporticket-purple"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
