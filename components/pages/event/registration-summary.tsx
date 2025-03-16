"use client";

import { Button } from "@/components/ui/button";
import { useEvent } from "@/context/event";
import { TicketType } from "@/interface/tickets";
import { ArrowRight, Minus, Plus } from "lucide-react";

interface RegistrationSummaryProps {
  ticketTypes: TicketType[];
}

export default function RegistrationSummary({
  ticketTypes,
}: RegistrationSummaryProps) {
  const { updateTicketQuantity, selectedTickets } = useEvent();

  const getQuantity = (ticketTypeId: string) => {
    return (
      selectedTickets.find((t) => t.ticketType.id === ticketTypeId)?.quantity ||
      0
    );
  };

  const total = selectedTickets.reduce((acc, ticket) => {
    return acc + parseFloat(ticket.ticketLot.price) * ticket.quantity;
  }, 0);

  return (
    <div className="overflow-hidden mb-5">
      <div className="">
        {ticketTypes.map((ticket) => {
          const activeLot = ticket.ticketLots.find((lot) => lot.isActive);

          if (!activeLot) return null;

          return (
            <div
              key={ticket.id}
              className={`flex items-center justify-between bg-zinc-100 mb-3 p-4 rounded-lg ${
                activeLot.quantity === 0 && "opacity-50 pointer-events-none"
              }`}
            >
              <div>
                <h3 className="font-medium">{ticket.name}</h3>
                <p className="text-xs text-gray-500">
                  Resta {activeLot.quantity} vagas
                </p>
                <span className="font-light text-sm text-sporticket-green-700">
                  R$ {parseFloat(activeLot.price).toFixed(2)}
                </span>
              </div>
              {activeLot.quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Button
                      variant="select"
                      size="icon"
                      className="h-6 w-6 "
                      onClick={() =>
                        updateTicketQuantity(
                          ticket.id,
                          Math.max(0, getQuantity(ticket.id) - 1)
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <p className="text-3xs w-[30px] text-center">
                      {getQuantity(ticket.id)}
                    </p>
                    <Button
                      variant="select"
                      size="icon"
                      className="h-6 w-6 "
                      onClick={() =>
                        updateTicketQuantity(
                          ticket.id,
                          Math.min(
                            activeLot.quantity,
                            getQuantity(ticket.id) + 1
                          )
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <span className="text-sporticket-orange font-light text-md">
                  ESGOTADO
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-3 bg-zinc-100 p-4 rounded-lg">
        <div className="mb-2 flex items-center justify-between  ">
          <span className="font-light">Total</span>
          <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
        </div>

        <Button className="w-full" variant="destructive">
          Realizar Inscrição
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
