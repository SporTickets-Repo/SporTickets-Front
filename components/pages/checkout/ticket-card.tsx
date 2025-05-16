"use client";

import { Button } from "@/components/ui/button";
import { TicketForm } from "@/interface/tickets";
import { formatMoneyBR } from "@/utils/formatMoney";
import { FaRegCircle, FaTrash } from "react-icons/fa6";
import { HiTicket } from "react-icons/hi2";
import { IoIosCheckmarkCircle } from "react-icons/io";

interface TicketCardProps {
  ticket: TicketForm;
  isSelected: boolean;
  onSelect: (ticket: TicketForm) => void;
  removeTicket: (ticketId: string) => void;
}

export function TicketCard({
  ticket,
  isSelected,
  onSelect,
  removeTicket,
}: TicketCardProps) {
  const handleSelectTicket = () => {
    onSelect(ticket);
  };

  const maxPlayers = ticket.ticketType.teamSize;
  const completedTicket = () => {
    const hasAllPlayers = ticket.players.length === maxPlayers;

    const hasAllPersonalFields = ticket.players.every(
      (player) =>
        (player.personalizedField?.length ?? 0) ===
        ticket.ticketType.personalizedFields.length
    );

    const categoryRequired = ticket.ticketType.categories.length > 0;

    const hasAllCategories =
      !categoryRequired || ticket.players.every((p) => !!p.category?.id);

    return hasAllPlayers && hasAllPersonalFields && hasAllCategories;
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`px-4 w-full py-2 mb-4 cursor-pointer rounded-xl shadow-md ${
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
              <div className="">
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
              {formatMoneyBR(Number(ticket.ticketLot.price) * maxPlayers)}
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
      <Button
        onClick={() => removeTicket(ticket.ticketType.id)}
        variant={"destructive"}
        className="[&_svg]:size-5 h-[80px] px-2 rounded-md bg-zinc-50 hover:bg-zinc-50 "
      >
        <FaTrash className="text-sporticket-orange" />
      </Button>
    </div>
  );
}
